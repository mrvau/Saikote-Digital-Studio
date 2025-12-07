import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { useReducer } from "react";
import { normalInputs, labInputs } from "../constants";
import { initialState } from "../constants";

const reducer = (state, action) => {
	switch (action.type) {
		case "UPDATE_FIELD":
			const {field, value} = action
			const {}
			return {
				...state[action.field],
				
				
			};
		case "ERROR":
			return { ...state, errors: { ...state.errors, [action.field]: action.value } };
		default:
			return state;
	}
};

const validateForm = () => {
		Object.keys(state).forEach((input) => {
			if (state[input] === "Select One" || state[input] === 0) {
				dispatch({
					type: "ERROR",
					field: input,
					value: "This field is required!",
				});
			}
		});
		console.log(state.errors);
	};

const Form = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	

	const handleSubmit = async (e) => {
		e.preventDefault();
		validateForm();
		// console.log(e);
		// await fetch("http://localhost:3000", {
		// 	body: JSON.stringify(state),
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// });
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
