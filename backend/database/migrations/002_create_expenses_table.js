/**
 * Migration 002: Create expenses table
 */
export const up = (db) => {
	db.exec(`
		CREATE TABLE IF NOT EXISTS expenses (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			category TEXT NOT NULL DEFAULT 'shop_expense' CHECK (category IN ('salary', 'shop_expense')),
			expense_type TEXT,
			amount REAL NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
		);

		CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);
	`);
};

export const down = (db) => {
	db.exec(`
		DROP INDEX IF EXISTS idx_expenses_created_at;
		DROP TABLE IF EXISTS expenses;
	`);
};
