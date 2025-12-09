const validateForm = (formData, inputs) => {
	const errors = {};

	const snapType = formData.snapType;
	const printType = formData.printType;

	inputs.forEach((input) => {
		const value = formData[input.id];

		// RULE B — Any select with "Select One"
		if (input.type === "select" && value === "Select One") {
			errors[input.id] = "Please select a valid option.";
			return;
		}

		// RULE A — snapshot → photoNo required
		if (snapType === "Snapshot" && input.id === "photoNo") {
			if (!value || value.trim() === "") {
				errors[input.id] = "Photo number is required for Snapshot.";
				return;
			}
		}

		// RULE C — If printType = Lab → only isLab=true fields are required
		if (printType === "Lab" && input.isLab) {
			if (!value || value === "Select One" || value === "") {
				errors[input.id] = "This field is required for Lab prints.";
				return;
			}
		}

		// RULE D — Every normal field must be filled
		if (!input.isLab) {
			if ((!value || value === "" || value === "Select One") && input.id !== "photoNo") {
				errors[input.id] = "This field is required.";
				return;
			}
		}
	});

	return errors;
};

export default validateForm;
