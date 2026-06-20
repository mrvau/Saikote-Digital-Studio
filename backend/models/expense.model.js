import db from "../database/db.js";

const toCamel = (row) => {
	if (!row) return row;
	return {
		id: row.id,
		expenseType: row.expense_type,
		amount: row.amount,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
};

const insertStmt = db.prepare(
	"INSERT INTO expenses (expense_type, amount) VALUES (@expenseType, @amount)",
);

const updateStmt = db.prepare(`
	UPDATE expenses SET
		expense_type = @expenseType, amount = @amount, updated_at = datetime('now', 'localtime')
	WHERE id = @id
`);

export const getExpenseById = (id) =>
	toCamel(db.prepare("SELECT * FROM expenses WHERE id = ?").get(id));

export const getAllExpenses = ({ from, to } = {}) => {
	if (from && to) {
		return db
			.prepare(
				"SELECT * FROM expenses WHERE date(created_at) BETWEEN ? AND ? ORDER BY created_at DESC",
			)
			.all(from, to)
			.map(toCamel);
	}
	return db.prepare("SELECT * FROM expenses ORDER BY created_at DESC").all().map(toCamel);
};

export const createExpense = (data) => {
	const result = insertStmt.run({ expenseType: data.expenseType, amount: data.amount });
	return getExpenseById(result.lastInsertRowid);
};

export const updateExpense = (id, data) => {
	updateStmt.run({ id, expenseType: data.expenseType, amount: data.amount });
	return getExpenseById(id);
};

export const deleteExpense = (id) => db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
