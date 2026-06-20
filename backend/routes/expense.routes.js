import { Router } from "express";
import {
	listExpenses,
	getExpense,
	addExpense,
	editExpense,
	removeExpense,
} from "../controllers/expense.controller.js";

const router = Router();

router.get("/", listExpenses);
router.get("/:id", getExpense);
router.post("/", addExpense);
router.put("/:id", editExpense);
router.delete("/:id", removeExpense);

export default router;
