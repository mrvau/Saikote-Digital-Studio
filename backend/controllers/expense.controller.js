import { createCrudController } from "./crudController.js";
import { validateExpense } from "../lib/validate.js";
import {
	createExpense,
	getAllExpenses,
	getExpenseById,
	updateExpense,
	deleteExpense,
} from "../models/expense.model.js";

const expenseController = createCrudController({
	resource: "expense",
	list: getAllExpenses,
	getById: getExpenseById,
	create: createExpense,
	update: updateExpense,
	remove: deleteExpense,
	validate: validateExpense,
	getListQuery: ({ from, to, category }) => ({ from, to, category }),
});

export const listExpenses = expenseController.list;
export const getExpense = expenseController.get;
export const addExpense = expenseController.add;
export const editExpense = expenseController.edit;
export const removeExpense = expenseController.remove;
