import db from "../database/db.js";
import { rowToCamel } from "../lib/mapper.js";

export const calculateDueAmount = (amount, paidAmount) => Math.max(0, amount - paidAmount);

const toRow = (data) => ({
	snapType: data.snapType,
	photoNo: data.photoNo,
	photoSize: data.photoSize,
	quantity: data.quantity,
	amount: data.amount,
	printMethod: data.printMethod,
	printType: data.printType,
	deliveryType: data.deliveryType,
	labPhotoSize: data.labPhotoSize,
	labQuantity: data.labQuantity,
	paymentMethod: data.paymentMethod,
	isPaid: data.isPaid,
	paidAmount: data.paidAmount,
	dueAmount: data.dueAmount,
	paymentNotes: data.paymentNotes,
});

const insertStmt = db.prepare(`
	INSERT INTO orders (
		snap_type, photo_no, photo_size, quantity, amount,
		print_method, print_type, delivery_type, lab_photo_size, lab_quantity,
		payment_method, is_paid, paid_amount, due_amount, payment_notes
	) VALUES (
		@snapType, @photoNo, @photoSize, @quantity, @amount,
		@printMethod, @printType, @deliveryType, @labPhotoSize, @labQuantity,
		@paymentMethod, @isPaid, @paidAmount, @dueAmount, @paymentNotes
	)
`);

const updateStmt = db.prepare(`
	UPDATE orders SET
		snap_type = @snapType, photo_no = @photoNo, photo_size = @photoSize,
		quantity = @quantity, amount = @amount, print_method = @printMethod,
		print_type = @printType, delivery_type = @deliveryType,
		lab_photo_size = @labPhotoSize, lab_quantity = @labQuantity,
		payment_method = @paymentMethod, is_paid = @isPaid,
		paid_amount = @paidAmount, due_amount = @dueAmount,
		payment_notes = @paymentNotes,
		updated_at = datetime('now', 'localtime')
	WHERE id = @id
`);

export const getOrderById = (id) =>
	rowToCamel(db.prepare("SELECT * FROM orders WHERE id = ?").get(id));

export const getAllOrders = ({ from, to } = {}) => {
	if (from && to) {
		return db
			.prepare(
				"SELECT * FROM orders WHERE date(created_at) BETWEEN ? AND ? ORDER BY created_at DESC",
			)
			.all(from, to)
			.map(rowToCamel);
	}
	return db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all().map(rowToCamel);
};

export const createOrder = (data) => {
	const result = insertStmt.run(toRow(data));
	return getOrderById(result.lastInsertRowid);
};

export const updateOrder = (id, data) => {
	updateStmt.run({ id, ...toRow(data) });
	return getOrderById(id);
};

export const deleteOrder = (id) => db.prepare("DELETE FROM orders WHERE id = ?").run(id);
