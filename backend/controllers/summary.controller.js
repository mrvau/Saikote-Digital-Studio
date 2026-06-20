import { getDailySummary, getMonthlySummary, getYearlySummary } from "../models/summary.model.js";

// sv-SE locale formats as YYYY-MM-DD, matching SQLite's date(created_at) output
const todayParts = () => new Date().toLocaleDateString("sv-SE");

export const dailySummary = (req, res) => {
	const date = req.query.date || todayParts();
	res.json({ success: true, data: getDailySummary(date) });
};

export const monthlySummary = (req, res) => {
	const month = req.query.month || todayParts().slice(0, 7);
	res.json({ success: true, data: getMonthlySummary(month) });
};

export const yearlySummary = (req, res) => {
	const year = req.query.year || todayParts().slice(0, 4);
	res.json({ success: true, data: getYearlySummary(year) });
};
