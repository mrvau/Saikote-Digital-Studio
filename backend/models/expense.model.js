import db from "../database/db.js";

const toCamel = (row) => {
	if (!row) return row;
	return {
		id: row.id,
		category: row.category,
		expenseType: row.expense_type,
		amount: row.amount,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
};

const insertStmt = db.prepare(
	"INSERT INTO expenses (category, expense_type, amount) VALUES (@category, @expenseType, @amount)",
);

const updateStmt = db.prepare(`
	UPDATE expenses SET
		category = @category, expense_type = @expenseType, amount = @amount, updated_at = datetime('now', 'localtime')
	WHERE id = @id
`);

export const getExpenseById = (id) =>
	toCamel(db.prepare("SELECT * FROM expenses WHERE id = ?").get(id));

export const getAllExpenses = ({ from, to, category } = {}) => {
	const conditions = [];
	const params = [];

	if (from && to) {
		conditions.push("date(created_at) BETWEEN ? AND ?");
		params.push(from, to);
	}
	if (category) {
		conditions.push("category = ?");
		params.push(category);
	}

	const whereClause = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
	return db
		.prepare(`SELECT * FROM expenses${whereClause} ORDER BY created_at DESC`)
		.all(...params)
		.map(toCamel);
};

export const createExpense = (data) => {
	const result = insertStmt.run({
		category: data.category,
		expenseType: data.expenseType || null,
		amount: data.amount,
	});
	return getExpenseById(result.lastInsertRowid);
};

export const updateExpense = (id, data) => {
	updateStmt.run({
		id,
		category: data.category,
		expenseType: data.expenseType || null,
		amount: data.amount,
	});
	return getExpenseById(id);
};

export const deleteExpense = (id) => db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
