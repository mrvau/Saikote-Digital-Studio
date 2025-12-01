import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { useReducer } from "react";
import { normalInputs, labInputs } from "../constants";

const updateState = (state, action) => {
	switch (action.type) {
		case "UPDATE_FIELD":
			return { ...state, [action.field]: action.value };
		default:
			return state;
	}
};

const Form = () => {
	const initialState = {
		snapType: "",
		photoNo: "",
		photoSizePrint: "",
		quantity: 0,
		amount: 0,
		printType: "",
		deliveryType: "",
		photoSizeLab: "",
		labQuantity: 0,
	};

	const [state, dispatch] = useReducer(updateState, initialState);

	const handleSubmit = async (e) => {
		e.preventDefault();
		await fetch("http://localhost:3000", {
			body: JSON.stringify(state),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-[#222222] px-5 py-4 rounded-md text-[#cccccc] text-center w-5xl">
			{normalInputs.map((input, index) => (
				<div className="mb-5" key={index}>
					<label htmlFor={input.id} className="block mb-2">
						{input.label}
					</label>
					{input.type === "select" ? (
						<Select options={input.options} id={input.id} dispatch={dispatch} />
					) : (
						<Input
							id={input.id}
							type={input.type}
							placeholder={input.placeholder}
							disabled={state.snapType === "Scan"}
							dispatch={dispatch}
							value={state[input.id]}
						/>
					)}
				</div>
			))}

			{state.printType === "Lab" &&
				labInputs.map((input, index) => (
					<div className="mb-5" key={index}>
						<label htmlFor={input.id} className="block mb-2">
							{input.label}
						</label>
						{input.type === "select" ? (
							<Select options={input.options} id={input.id} dispatch={dispatch} />
						) : (
							<Input
								id={input.id}
								type={input.type}
								placeholder={input.placeholder}
								disabled={state.snapType === "Scan"}
								dispatch={dispatch}
								value={state[input.id]}
							/>
						)}
					</div>
				))}
			<Button />
		</form>
	);
};

export default Form;
