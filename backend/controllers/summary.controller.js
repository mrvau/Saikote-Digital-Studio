import { getDailySummary, getMonthlySummary, getYearlySummary, getTotalOutstandingBalance } from "../models/summary.model.js";
import { currentMonthString, currentYearString, todayString } from "../../shared/date.js";

const sendSummaryError = (res, label, error) => {
	console.error(`Failed to load ${label} summary:`, error);
	res.status(500).json({ success: false, message: `Failed to load ${label} summary.` });
};

export const dailySummary = (req, res) => {
	try {
		const date = req.query.date || todayString();
		res.json({ success: true, data: getDailySummary(date) });
	} catch (error) {
		sendSummaryError(res, "daily", error);
	}
};

export const monthlySummary = (req, res) => {
	try {
		const month = req.query.month || currentMonthString();
		res.json({ success: true, data: getMonthlySummary(month) });
	} catch (error) {
		sendSummaryError(res, "monthly", error);
	}
};

export const yearlySummary = (req, res) => {
	try {
		const year = req.query.year || currentYearString();
		res.json({ success: true, data: getYearlySummary(year) });
	} catch (error) {
		sendSummaryError(res, "yearly", error);
	}
};

export const outstandingBalance = (req, res) => {
	try {
		res.json({ success: true, data: { outstandingBalance: getTotalOutstandingBalance() } });
	} catch (error) {
		sendSummaryError(res, "outstanding balance", error);
	}
};
