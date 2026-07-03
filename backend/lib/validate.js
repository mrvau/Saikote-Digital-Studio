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
