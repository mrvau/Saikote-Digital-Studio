import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { useReducer, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { normalInputs, labInputs } from "../constants";
import { getOrder, createOrder, updateOrder } from "../api/client";

const updateState = (state, action) => {
	switch (action.type) {
		case "UPDATE_FIELD":
			return { ...state, [action.field]: action.value };
		case "LOAD":
			return { ...state, ...action.payload };
		case "RESET":
			return action.initialState;
		default:
			return state;
	}
};

const initialState = {
	snapType: "",
	photoNo: "",
	photoSize: "",
	quantity: 4,
	amount: 50,
	printMethod: "",
	printType: "",
	deliveryType: "",
	labPhotoSize: "",
	labQuantity: 1,
};

const Form = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditing = Boolean(id);
	const [state, dispatch] = useReducer(updateState, initialState);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(isEditing);

	useEffect(() => {
		if (!isEditing) return;
		getOrder(id)
			.then((res) => dispatch({ type: "LOAD", payload: res.data }))
			.catch((error) => alert(`Couldn't load that order: ${error.message}`))
			.finally(() => setLoading(false));
	}, [id, isEditing]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		try {
			if (isEditing) {
				await updateOrder(id, state);
				navigate("/documents");
			} else {
				await createOrder(state);
				alert("Order saved.");
				dispatch({ type: "RESET", initialState });
			}
		} catch (error) {
			if (error.errors) {
				setErrors(error.errors);
			} else {
				alert(error.message || "Something went wrong saving the order.");
			}
		}
	};

	if (loading) {
		return <p className="text-[#888888] text-center">Loading order…</p>;
	}

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
						<Select
							options={input.options}
							id={input.id}
							dispatch={dispatch}
							value={state[input.id]}
						/>
					) : (
						<Input
							id={input.id}
							type={input.type}
							placeholder={input.placeholder}
							disabled={state.snapType === "Scan" && input.id === "photoNo"}
							dispatch={dispatch}
							value={state[input.id]}
						/>
					)}
					{errors[input.id] && (
						<p className="text-[#e08b8b] text-sm mt-1 text-left">{errors[input.id]}</p>
					)}
				</div>
			))}

			{state.printMethod === "Lab" &&
				labInputs.map((input, index) => (
					<div className="mb-5" key={index}>
						<label htmlFor={input.id} className="block mb-2">
							{input.label}
						</label>
						{input.type === "select" ? (
							<Select
								options={input.options}
								id={input.id}
								dispatch={dispatch}
								value={state[input.id]}
							/>
						) : (
							<Input
								id={input.id}
								type={input.type}
								placeholder={input.placeholder}
								dispatch={dispatch}
								value={state[input.id]}
							/>
						)}
						{errors[input.id] && (
							<p className="text-[#e08b8b] text-sm mt-1 text-left">
								{errors[input.id]}
							</p>
						)}
					</div>
				))}

			<div className="flex gap-3 justify-center">
				<Button>{isEditing ? "Update order" : "Save order"}</Button>
				{isEditing && (
					<Link
						to="/documents"
						className="font-bold text-center bg-[#333333] w-3xl my-4 py-1 rounded-sm cursor-pointer flex items-center justify-center">
						Cancel
					</Link>
				)}
			</div>
		</form>
	);
};

export default Form;
