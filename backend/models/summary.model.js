import db from "../database/db.js";

const sumWhere = (table, whereClause, params) =>
	db.prepare(`SELECT COALESCE(SUM(amount), 0) as total FROM ${table} WHERE ${whereClause}`).get(
		...params,
	).total;

const buildSummary = (label, value, whereClause, params) => {
	const income = sumWhere("orders", whereClause, params);
	const expense = sumWhere("expenses", whereClause, params);
	return { [label]: value, income, expense, net: income - expense };
};

export const getDailySummary = (date) =>
	buildSummary("date", date, "date(created_at) = ?", [date]);

export const getMonthlySummary = (month) =>
	// month format: 'YYYY-MM'
	buildSummary("month", month, "strftime('%Y-%m', created_at) = ?", [month]);

export const getYearlySummary = (year) =>
	// year format: 'YYYY'
	buildSummary("year", year, "strftime('%Y', created_at) = ?", [year]);
