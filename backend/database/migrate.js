import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "migrations");

/**
 * Lightweight versioned migration runner for better-sqlite3.
 *
 * Tracks applied migrations in a `_migrations` meta-table.
 * Each migration file must export `up(db)` and optionally `down(db)`.
 *
 * Migration files are sorted lexicographically by filename, so use the
 * naming convention:  001_description.js, 002_description.js, …
 */
export const runMigrations = async (db) => {
	// Ensure the meta-table exists
	db.exec(`
		CREATE TABLE IF NOT EXISTS _migrations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			applied_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
		);
	`);

	// Gather already-applied migration names
	const applied = new Set(
		db
			.prepare("SELECT name FROM _migrations ORDER BY id")
			.all()
			.map((r) => r.name),
	);

	// Discover migration files on disk
	if (!fs.existsSync(MIGRATIONS_DIR)) return;

	const files = fs
		.readdirSync(MIGRATIONS_DIR)
		.filter((f) => f.endsWith(".js"))
		.sort();

	const pending = files.filter((f) => !applied.has(f));
	if (pending.length === 0) return;

	console.log(`[migrate] ${pending.length} pending migration(s) found.`);

	const insertMigration = db.prepare(
		"INSERT INTO _migrations (name) VALUES (?)",
	);

	for (const file of pending) {
		const filePath = path.join(MIGRATIONS_DIR, file);
		const fileUrl = pathToFileURL(filePath).href;
		const mod = await import(fileUrl);

		if (typeof mod.up !== "function") {
			throw new Error(`Migration ${file} does not export an 'up' function.`);
		}

		console.log(`[migrate] Applying: ${file}`);

		const runInTransaction = db.transaction(() => {
			mod.up(db);
			insertMigration.run(file);
		});

		runInTransaction();
		console.log(`[migrate] Applied:  ${file} ✓`);
	}

	console.log(`[migrate] All migrations applied successfully.`);
};
