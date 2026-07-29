import { calculateDueAmount } from "../models/order.model.js";

const toNumber = (value) => {
	const n = Number(value);
	return Number.isFinite(n) ? n : NaN;
};

export const validateOrder = (data) => {
	const errors = {};
	const quantity = toNumber(data.quantity);
	const amount = toNumber(data.amount);
	const labQuantity = data.printMethod === "Lab" ? toNumber(data.labQuantity) : null;

	if (!data.snapType || !["Snapshot", "Scan"].includes(data.snapType)) {
		errors.snapType = "Please select a valid snap type.";
	}
	if (data.snapType === "Snapshot" && (!data.photoNo || !data.photoNo.trim())) {
		errors.photoNo = "Photo No. is required for Snapshot.";
	}
	if (!data.photoSize || !data.photoSize.trim()) {
		errors.photoSize = "Please select a photo size.";
	}
	if (!Number.isFinite(quantity) || quantity <= 0) {
		errors.quantity = "Quantity must be greater than zero.";
	}
	if (!Number.isFinite(amount) || amount <= 0) {
		errors.amount = "Amount must be greater than zero.";
	}
	if (!data.printMethod || !["Normal", "Lab"].includes(data.printMethod)) {
		errors.printMethod = "Please select a valid print method.";
	}
	if (data.printMethod === "Lab") {
		if (!data.printType) errors.printType = "Please select a print type.";
		if (!data.deliveryType) errors.deliveryType = "Please select a delivery type.";
		if (!data.labPhotoSize) errors.labPhotoSize = "Please select a lab photo size.";
		if (!Number.isFinite(labQuantity) || labQuantity <= 0) {
			errors.labQuantity = "Lab quantity must be greater than zero.";
		}
	}

	// Payment fields validation
	const paymentMethod = data.paymentMethod !== undefined && data.paymentMethod !== null ? data.paymentMethod : "cash";
	const paidAmount = data.paidAmount !== undefined && data.paidAmount !== null ? toNumber(data.paidAmount) : 0;
	const dueAmount = data.dueAmount !== undefined && data.dueAmount !== null ? toNumber(data.dueAmount) : calculateDueAmount(amount, paidAmount);
	
	let isPaidUser = data.isPaid;
	if (isPaidUser === undefined || isPaidUser === null) {
		isPaidUser = paidAmount >= amount;
	} else {
		isPaidUser = isPaidUser === true || isPaidUser === 1 || isPaidUser === "true";
	}

	if (!paymentMethod || !["cash", "card", "internet_banking", "bank_transfer"].includes(paymentMethod)) {
		errors.paymentMethod = "Payment method is required and must be one of: 'cash', 'card', 'internet_banking', 'bank_transfer'.";
	}
	if (!Number.isFinite(paidAmount) || paidAmount < 0 || paidAmount > amount) {
		errors.paidAmount = "Paid amount must be >= 0 and <= amount.";
	}
	if (!Number.isFinite(dueAmount) || dueAmount < 0 || dueAmount > amount) {
		errors.dueAmount = "Due amount must be >= 0 and <= amount.";
	}
	if (Number.isFinite(paidAmount) && Number.isFinite(dueAmount) && Number.isFinite(amount)) {
		if ((paidAmount + dueAmount).toFixed(2) !== amount.toFixed(2)) {
			errors.dueAmount = "Paid amount + dueAmount must equal amount.";
		}
	}
	if (paidAmount === amount && !isPaidUser) {
		errors.isPaid = "If paidAmount equals amount, isPaid must be true.";
	}
	if (isPaidUser && dueAmount !== 0) {
		errors.dueAmount = "If isPaid is true, dueAmount must be 0.";
	}

	const paymentNotes = data.paymentNotes !== undefined && data.paymentNotes !== null ? String(data.paymentNotes) : null;

	return {
		errors,
		data: {
			...data,
			photoNo: data.snapType === "Snapshot" ? data.photoNo : null,
			quantity,
			amount,
			printType: data.printMethod === "Lab" ? data.printType : null,
			deliveryType: data.printMethod === "Lab" ? data.deliveryType : null,
			labPhotoSize: data.printMethod === "Lab" ? data.labPhotoSize : null,
			labQuantity,
			paymentMethod,
			isPaid: paidAmount >= amount ? 1 : 0,
			paidAmount,
			dueAmount: calculateDueAmount(amount, paidAmount),
			paymentNotes,
		},
	};
};

export const validateExpense = (data) => {
	const errors = {};
	const amount = toNumber(data.amount);

	// Category is required and must be one of the two allowed values
	if (!data.category || !["salary", "shop_expense"].includes(data.category)) {
		errors.category = "Please select a valid category.";
	}

	// Expense type is only required for shop expenses
	if (data.category === "shop_expense" && (!data.expenseType || !data.expenseType.trim())) {
		errors.expenseType = "Expense type is required.";
	}

	if (!Number.isFinite(amount) || amount <= 0) {
		errors.amount = "Amount must be greater than zero.";
	}

	return {
		errors,
		data: {
			...data,
			amount,
			expenseType: data.category === "salary" ? null : data.expenseType,
		},
	};
};
