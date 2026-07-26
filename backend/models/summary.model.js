import db from "../database/db.js";

const TABLES = {
	orders: "orders",
	expenses: "expenses",
};

const PERIOD_WHERE = {
	day: "date(created_at) = ?",
	month: "strftime('%Y-%m', created_at) = ?",
	year: "strftime('%Y', created_at) = ?",
};

const sumWhere = (tableKey, periodKey, params, extraWhere = "", extraParams = []) => {
	const table = TABLES[tableKey];
	const whereClause = PERIOD_WHERE[periodKey];

	if (!table || !whereClause) {
		throw new Error("Unsupported summary query.");
	}

	return db
		.prepare(
			`SELECT COALESCE(SUM(amount), 0) as total FROM ${table} WHERE ${whereClause}${extraWhere}`,
		)
		.get(...params, ...extraParams).total;
};

const buildSummary = (label, value, periodKey, params) => {
	const income = sumWhere("orders", periodKey, params);
	const expense = sumWhere("expenses", periodKey, params);
	const salary = sumWhere("expenses", periodKey, params, " AND category = ?", ["salary"]);
	return { [label]: value, income, expense, salary, net: income - expense };
};

export const getDailySummary = (date) =>
	buildSummary("date", date, "day", [date]);

export const getMonthlySummary = (month) =>
	// month format: 'YYYY-MM'
	buildSummary("month", month, "month", [month]);

export const getYearlySummary = (year) =>
	// year format: 'YYYY'
	buildSummary("year", year, "year", [year]);

export const getTotalOutstandingBalance = () => {
	const totalOrders = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM orders").get().total;
	const totalPaid = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments").get().total;
	return totalOrders - totalPaid;
};
