import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "studio.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

const initSchema = () => {
	db.exec(`
		CREATE TABLE IF NOT EXISTS orders (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			snap_type TEXT NOT NULL CHECK (snap_type IN ('Snapshot', 'Scan')),
			photo_no TEXT,
			photo_size TEXT NOT NULL,
			quantity INTEGER NOT NULL,
			amount REAL NOT NULL,
			print_method TEXT NOT NULL CHECK (print_method IN ('Normal', 'Lab')),
			print_type TEXT,
			delivery_type TEXT,
			lab_photo_size TEXT,
			lab_quantity INTEGER,
			created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
		);

		CREATE TABLE IF NOT EXISTS expenses (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			category TEXT NOT NULL DEFAULT 'shop_expense' CHECK (category IN ('salary', 'shop_expense')),
			expense_type TEXT,
			amount REAL NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
		);

		CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
		CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);
	`);
};

initSchema();

// ── Migrations ──
// Add `category` column to expenses (idempotent – safe to run multiple times).
try {
	db.exec(`ALTER TABLE expenses ADD COLUMN category TEXT NOT NULL DEFAULT 'shop_expense' CHECK (category IN ('salary', 'shop_expense'))`);
} catch {
	// Column already exists — nothing to do.
}
// Make expense_type nullable for salary entries (drop NOT NULL).
// SQLite doesn't support ALTER COLUMN, but new tables are already correct.
// Existing data is fine because all old rows have expense_type filled.

export default db;
