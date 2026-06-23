import { validateExpense } from "../lib/validate.js";
import {
	createExpense,
	getAllExpenses,
	getExpenseById,
	updateExpense,
	deleteExpense,
} from "../models/expense.model.js";

export const listExpenses = (req, res) => {
	const { from, to, category } = req.query;
	res.json({ success: true, data: getAllExpenses({ from, to, category }) });
};

export const getExpense = (req, res) => {
	const expense = getExpenseById(Number(req.params.id));
	if (!expense) return res.status(404).json({ success: false, message: "Expense not found." });
	res.json({ success: true, data: expense });
};

export const addExpense = (req, res) => {
	const { errors, data } = validateExpense(req.body);
	if (Object.keys(errors).length) {
		return res.status(400).json({ success: false, message: "Validation error", errors });
	}
	try {
		const expense = createExpense(data);
		res.status(201).json({ success: true, message: "Expense saved.", data: expense });
	} catch (error) {
		console.error("Error saving expense:", error);
		res.status(500).json({ success: false, message: "Failed to save expense." });
	}
};

export const editExpense = (req, res) => {
	const id = Number(req.params.id);
	if (!getExpenseById(id)) {
		return res.status(404).json({ success: false, message: "Expense not found." });
	}
	const { errors, data } = validateExpense(req.body);
	if (Object.keys(errors).length) {
		return res.status(400).json({ success: false, message: "Validation error", errors });
	}
	const expense = updateExpense(id, data);
	res.json({ success: true, message: "Expense updated.", data: expense });
};

export const removeExpense = (req, res) => {
	const id = Number(req.params.id);
	if (!getExpenseById(id)) {
		return res.status(404).json({ success: false, message: "Expense not found." });
	}
	deleteExpense(id);
	res.json({ success: true, message: "Expense deleted." });
};
