import db from "../database/db.js";
import { rowToCamel } from "../lib/mapper.js";

const insertStmt = db.prepare(`
	INSERT INTO payments (order_id, amount, payment_method, notes)
	VALUES (@orderId, @amount, @paymentMethod, @notes)
`);

const deleteStmt = db.prepare("DELETE FROM payments WHERE id = ?");

export const getPaymentsByOrderId = (orderId) =>
	db
		.prepare("SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC")
		.all(orderId)
		.map(rowToCamel);

export const getTotalPaid = (orderId) => {
	const row = db
		.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE order_id = ?")
		.get(orderId);
	return row.total;
};

export const getOutstandingBalance = (orderId) => {
	const order = db.prepare("SELECT amount FROM orders WHERE id = ?").get(orderId);
	if (!order) return null;
	return order.amount - getTotalPaid(orderId);
};

export const createPayment = (data) => {
	const result = insertStmt.run(data);
	return getPaymentById(result.lastInsertRowid);
};

export const getPaymentById = (id) =>
	rowToCamel(db.prepare("SELECT * FROM payments WHERE id = ?").get(id));

export const deletePayment = (id) => {
	deleteStmt.run(id);
};