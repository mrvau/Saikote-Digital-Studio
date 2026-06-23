/**
 * Migration 001: Create orders table
 */
export const up = (db) => {
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

		CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
	`);
};

export const down = (db) => {
	db.exec(`
		DROP INDEX IF EXISTS idx_orders_created_at;
		DROP TABLE IF EXISTS orders;
	`);
};
