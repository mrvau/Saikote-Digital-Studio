import { Router } from "express";
import {
	listPaymentsByOrder,
	createPaymentRecord,
	getOutstandingBalanceRecord,
	removePayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.get("/order/:orderId", listPaymentsByOrder);
router.post("/", createPaymentRecord);
router.get("/outstanding/:orderId", getOutstandingBalanceRecord);
router.delete("/:id", removePayment);

export default router;