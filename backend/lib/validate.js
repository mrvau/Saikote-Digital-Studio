const validateForm = (formData) => {
	const errors = {};

	const {
		snapType,
		photoNo,
		photoSizePrint,
		quantity,
		amount,
		printType,
		deliveryType,
		photoSizeLab,
		labQuantity,
	} = formData;

	if (snapType === "Select One") {
		errors.snapType = "Please select a snap type.";
	}

	if (snapType === "Snapshot" && (!photoNo || !photoNo.trim())) {
		errors.photoNo = "Photo No. is required for Snapshot.";
	}

	if (photoSizePrint === "Select One") {
		errors.photoSizePrint = "Please select a photo size for Print.";
	}

	if (!quantity || quantity <= 0) {
		errors.quantity = "Quantity must be greater than zero.";
	}

	if (!amount || amount <= 0) {
		errors.amount = "Amount must be greater than zero.";
	}

	if (printType === "Select One") {
		errors.printType = "Please select a print type.";
	}

	if (printType === "Lab") {
		if (deliveryType === "Select One") {
			errors.deliveryType = "Please select a delivery type for Lab prints.";
		}
		if (photoSizeLab === "Select One") {
			errors.photoSizeLab = "Please select a photo size for Lab prints.";
		}
		if (!labQuantity || labQuantity <= 0) {
			errors.labQuantity = "Lab Quantity must be greater than zero.";
		}
	}

	return errors;
};

export default validateForm;
