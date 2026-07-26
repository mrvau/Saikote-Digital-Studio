import { createCrudController } from "./crudController.js";
import {
	getPaymentsByOrderId,
	createPayment,
	getOutstandingBalance,
	getTotalPaid,
	getPaymentById,
	deletePayment,
} from "../models/payment.model.js";
import { getOrderById } from "../models/order.model.js";

const validatePayment = (data) => {
	const errors = {};
	const amount = Number(data.amount);

	if (!data.orderId || !Number.isFinite(Number(data.orderId)) || Number(data.orderId) <= 0) {
		errors.orderId = "A valid order ID is required.";
	}

	if (!Number.isFinite(amount) || amount <= 0) {
		errors.amount = "Payment amount must be greater than zero.";
	}

	const order = getOrderById(Number(data.orderId));
	if (order) {
		const outstanding = order.amount - getTotalPaid(Number(data.orderId));
		if (amount > outstanding) {
			errors.amount = `Payment amount exceeds the outstanding balance of ${outstanding}.`;
		}
	} else if (!errors.orderId) {
		errors.orderId = "Order not found.";
	}

	return {
		errors,
		data: {
			...data,
			orderId: Number(data.orderId),
			amount,
			paymentMethod: data.paymentMethod || "cash",
			notes: data.notes || null,
		},
	};
};

const paymentController = createCrudController({
	resource: "payment",
	getById: getPaymentById,
	create: createPayment,
	remove: (id) => {
		const payment = getPaymentById(id);
		if (!payment) return null;
		deletePayment(id);
		return payment;
	},
	validate: validatePayment,
});

export const listPaymentsByOrder = (req, res) => {
	try {
		const orderId = parseInt(req.params.orderId, 10);
		if (!Number.isFinite(orderId) || orderId <= 0) {
			return res.status(400).json({ success: false, message: "Invalid order ID." });
		}
		const payments = getPaymentsByOrderId(orderId);
		res.json({ success: true, data: payments });
	} catch (error) {
		console.error("Failed to load payments:", error);
		res.status(500).json({ success: false, message: "Failed to load payments." });
	}
};

export const createPaymentRecord = paymentController.add;
export const removePayment = paymentController.remove;
export const getOutstandingBalanceRecord = (req, res) => {
	try {
		const orderId = parseInt(req.params.orderId, 10);
		if (!Number.isFinite(orderId) || orderId <= 0) {
			return res.status(400).json({ success: false, message: "Invalid order ID." });
		}
		const balance = getOutstandingBalance(orderId);
		if (balance === null) {
			return res.status(404).json({ success: false, message: "Order not found." });
		}
		res.json({ success: true, data: { outstandingBalance: balance } });
	} catch (error) {
		console.error("Failed to load outstanding balance:", error);
		res.status(500).json({ success: false, message: "Failed to load outstanding balance." });
	}
};