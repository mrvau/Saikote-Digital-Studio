/**
 * Migration 003: Add category column and make expense_type nullable
 *
 * For existing databases created before the category column was introduced.
 * SQLite doesn't support ALTER COLUMN, so we recreate the table to drop
 * the NOT NULL constraint on expense_type.
 */
export const up = (db) => {
	// 1. Add category column if it doesn't exist yet
	const colInfo = db.pragma("table_info(expenses)");
	const hasCategory = colInfo.some((c) => c.name === "category");

	if (!hasCategory) {
		db.exec(
			`ALTER TABLE expenses ADD COLUMN category TEXT NOT NULL DEFAULT 'shop_expense' CHECK (category IN ('salary', 'shop_expense'))`,
		);
	}

	// 2. Make expense_type nullable (if it's currently NOT NULL)
	const expTypeCol = colInfo.find((c) => c.name === "expense_type");
	if (expTypeCol && expTypeCol.notnull === 1) {
		db.exec(`
			ALTER TABLE expenses RENAME TO expenses_old;

			CREATE TABLE expenses (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				category TEXT NOT NULL DEFAULT 'shop_expense' CHECK (category IN ('salary', 'shop_expense')),
				expense_type TEXT,
				amount REAL NOT NULL,
				created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
				updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
			);

			INSERT INTO expenses (id, category, expense_type, amount, created_at, updated_at)
				SELECT id, category, expense_type, amount, created_at, updated_at FROM expenses_old;

			DROP TABLE expenses_old;

			CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);
		`);
	}
};

export const down = (db) => {
	// Reverse: make expense_type NOT NULL again and drop category
	db.exec(`
		ALTER TABLE expenses RENAME TO expenses_old;

		CREATE TABLE expenses (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			expense_type TEXT NOT NULL,
			amount REAL NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
		);

		INSERT INTO expenses (id, expense_type, amount, created_at, updated_at)
			SELECT id, COALESCE(expense_type, ''), amount, created_at, updated_at FROM expenses_old;

		DROP TABLE expenses_old;

		CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);
	`);
};
