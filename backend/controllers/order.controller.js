import { validateOrder } from "../lib/validate.js";
import {
	createOrder,
	getAllOrders,
	getOrderById,
	updateOrder,
	deleteOrder,
} from "../models/order.model.js";

export const listOrders = (req, res) => {
	const { from, to } = req.query;
	res.json({ success: true, data: getAllOrders({ from, to }) });
};

export const getOrder = (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID." });
	const order = getOrderById(id);
	if (!order) return res.status(404).json({ success: false, message: "Order not found." });
	res.json({ success: true, data: order });
};

export const addOrder = (req, res) => {
	const { errors, data } = validateOrder(req.body);
	if (Object.keys(errors).length) {
		return res.status(400).json({ success: false, message: "Validation error", errors });
	}
	try {
		const order = createOrder(data);
		res.status(201).json({ success: true, message: "Order saved.", data: order });
	} catch (error) {
		console.error("Error saving order:", error);
		res.status(500).json({ success: false, message: "Failed to save order." });
	}
};

export const editOrder = (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID." });
	if (!getOrderById(id)) {
		return res.status(404).json({ success: false, message: "Order not found." });
	}
	const { errors, data } = validateOrder(req.body);
	if (Object.keys(errors).length) {
		return res.status(400).json({ success: false, message: "Validation error", errors });
	}
	const order = updateOrder(id, data);
	res.json({ success: true, message: "Order updated.", data: order });
};

export const removeOrder = (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID." });
	if (!getOrderById(id)) {
		return res.status(404).json({ success: false, message: "Order not found." });
	}
	deleteOrder(id);
	res.json({ success: true, message: "Order deleted." });
};
