import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { inputs } from "../constants";
import { useState } from "react";
import validateForm from "../utils/validate";

const Form = () => {
	const [values, setValues] = useState({
		snapType: "",
		photoNo: "",
		photoSizePrint: "",
		quantity: 0,
		amount: 0,
		printType: "",
		deliveryType: "",
		photoSizeLab: "",
		labQuantity: 0,
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => {
			if (!prev) return {};
			const next = { ...prev };
			delete next[name];
			return next;
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validate = validateForm(values, inputs);
		if (Object.keys(validate).length) {
			setErrors(validate);
			return;
		}

		try {
			await fetch("http://localhost:3000", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-[#222222] px-5 py-4 rounded-md text-[#cccccc] text-center w-5xl">
			{inputs
				.filter((input) => {
					return !input.isLab ? true : values.printType === "Lab";
				})
				.map((input) => (
					<div className="mb-5" key={input.id}>
						<label htmlFor={input.id} className="block mb-2">
							{input.label}
						</label>
						{input.type === "select" ? (
							<Select options={input.options} id={input.id} onChange={handleChange} />
						) : (
							<Input
								id={input.id}
								type={input.type}
								placeholder={input.placeholder}
								disabled={values.snapType === "Scan"}
								onChange={handleChange}
								value={values[input.id]}
							/>
						)}
						{errors[input.id] && (
							<p className="text-sm text-red-600">{errors[input.id]}</p>
						)}
					</div>
				))}
			<Button />
		</form>
	);
};

export default Form;
