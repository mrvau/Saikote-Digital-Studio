/**
 * Migration 004: Create payments table
 */
export const up = (db) => {
	db.exec(`
		CREATE TABLE IF NOT EXISTS payments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
			amount REAL NOT NULL CHECK (amount > 0),
			payment_method TEXT DEFAULT 'cash',
			notes TEXT,
			created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
		);

		CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
	`);
};

export const down = (db) => {
	db.exec(`
		DROP INDEX IF EXISTS idx_payments_order_id;
		DROP TABLE IF EXISTS payments;
	`);
};