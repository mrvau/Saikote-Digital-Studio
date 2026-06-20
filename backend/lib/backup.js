import path from "path";
import fs from "fs";
import db from "../database/db.js";

const MAX_BACKUPS = 30; // roughly a month of daily backups

const backupDir = () => {
	const dir = path.join(path.dirname(db.name), "backups");
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
	return dir;
};

const timestamp = () => new Date().toISOString().replace(/[:.]/g, "-");

const pruneOldBackups = (dir) => {
	const files = fs
		.readdirSync(dir)
		.filter((f) => f.endsWith(".db"))
		.map((f) => ({ f, time: fs.statSync(path.join(dir, f)).mtimeMs }))
		.sort((a, b) => b.time - a.time);

	files.slice(MAX_BACKUPS).forEach(({ f }) => fs.unlinkSync(path.join(dir, f)));
};

// Uses SQLite's online backup API (db.backup()), not a raw file copy. The database runs in
// WAL mode, so recent committed writes can live in a separate -wal file — copying just the
// .db file directly risks a backup that's missing them. db.backup() produces a single,
// complete, consistent snapshot regardless of WAL state, and is safe to call on a live database.
export const backupDatabase = async () => {
	const dir = backupDir();
	const dest = path.join(dir, `studio-${timestamp()}.db`);
	await db.backup(dest);
	pruneOldBackups(dir);
	return dest;
};
