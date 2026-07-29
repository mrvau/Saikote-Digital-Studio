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

/**
 * Sums a specific column from a table, filtered by period and optional extra conditions.
 * Used for paid_amount, due_amount, etc.
 */
const sumColumnWhere = (tableKey, column, periodKey, params, extraWhere = "", extraParams = []) => {
	const table = TABLES[tableKey];
	const whereClause = PERIOD_WHERE[periodKey];

	if (!table || !whereClause) {
		throw new Error("Unsupported summary query.");
	}

	return db
		.prepare(
			`SELECT COALESCE(SUM(${column}), 0) as total FROM ${table} WHERE ${whereClause}${extraWhere}`,
		)
		.get(...params, ...extraParams).total;
};

/**
 * Counts rows in a table, filtered by period and optional extra conditions.
 */
const countWhere = (tableKey, periodKey, params, extraWhere = "", extraParams = []) => {
	const table = TABLES[tableKey];
	const whereClause = PERIOD_WHERE[periodKey];

	if (!table || !whereClause) {
		throw new Error("Unsupported summary query.");
	}

	return db
		.prepare(
			`SELECT COUNT(*) as total FROM ${table} WHERE ${whereClause}${extraWhere}`,
		)
		.get(...params, ...extraParams).total;
};

const buildSummary = (label, value, periodKey, params) => {
	const income = sumWhere("orders", periodKey, params);
	const expense = sumWhere("expenses", periodKey, params);
	const salary = sumWhere("expenses", periodKey, params, " AND category = ?", ["salary"]);

	// Payment metrics
	const totalPaid = sumColumnWhere("orders", "paid_amount", periodKey, params);
	const totalOutstanding = sumColumnWhere("orders", "due_amount", periodKey, params, " AND is_paid = ?", [0]);
	const unpaidOrderCount = countWhere("orders", periodKey, params, " AND is_paid = ?", [0]);

	return {
		[label]: value,
		income,
		expense,
		salary,
		net: income - expense,
		totalPaid,
		totalOutstanding,
		unpaidOrderCount,
	};
};

export const getDailySummary = (date) =>
	buildSummary("date", date, "day", [date]);

export const getMonthlySummary = (month) =>
	// month format: 'YYYY-MM'
	buildSummary("month", month, "month", [month]);

export const getYearlySummary = (year) =>
	// year format: 'YYYY'
	buildSummary("year", year, "year", [year]);
