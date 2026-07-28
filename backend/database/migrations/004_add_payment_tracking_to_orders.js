/**
 * Migration 004: Add payment tracking fields to orders table
 */
export const up = (db) => {
	const colInfo = db.pragma("table_info(orders)");
	const columns = colInfo.map((c) => c.name);

	if (!columns.includes("payment_method")) {
		db.exec(`
			ALTER TABLE orders ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'internet_banking', 'bank_transfer'))
		`);
	}
	if (!columns.includes("is_paid")) {
		db.exec(`
			ALTER TABLE orders ADD COLUMN is_paid INTEGER NOT NULL DEFAULT 0 CHECK (is_paid IN (0, 1))
		`);
	}
	if (!columns.includes("paid_amount")) {
		db.exec(`
			ALTER TABLE orders ADD COLUMN paid_amount REAL NOT NULL DEFAULT 0
		`);
	}
	if (!columns.includes("due_amount")) {
		db.exec(`
			ALTER TABLE orders ADD COLUMN due_amount REAL NOT NULL DEFAULT 0
		`);
	}
	if (!columns.includes("payment_notes")) {
		db.exec(`
			ALTER TABLE orders ADD COLUMN payment_notes TEXT
		`);
	}

	// For existing orders, backfill/update values
	db.exec(`
		UPDATE orders
		SET payment_method = 'cash',
		    paid_amount = 0,
		    due_amount = amount,
		    is_paid = 0;
	`);
};

export const down = (db) => {
	db.exec(`
		ALTER TABLE orders RENAME TO orders_old;

		CREATE TABLE orders (
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

		INSERT INTO orders (
			id, snap_type, photo_no, photo_size, quantity, amount,
			print_method, print_type, delivery_type, lab_photo_size, lab_quantity,
			created_at, updated_at
		)
		SELECT 
			id, snap_type, photo_no, photo_size, quantity, amount,
			print_method, print_type, delivery_type, lab_photo_size, lab_quantity,
			created_at, updated_at
		FROM orders_old;

		DROP TABLE orders_old;

		CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
	`);
};
