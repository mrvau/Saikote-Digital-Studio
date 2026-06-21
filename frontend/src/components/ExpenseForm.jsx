import Input from "./Input";
import Button from "./Button";
import Toast from "./Toast";
import { useReducer, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getExpense, createExpense, updateExpense } from "../api/client";
import { useToast } from "../hooks/useToast";

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
	expenseType: "",
	amount: "",
};

const ExpenseForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditing = Boolean(id);
	const [state, dispatch] = useReducer(updateState, initialState);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(isEditing);
	const { toast, showToast } = useToast();

	useEffect(() => {
		if (!isEditing) return;
		getExpense(id)
			.then((res) => dispatch({ type: "LOAD", payload: res.data }))
			.catch((error) => {
				console.error("Couldn't load expense:", error);
				navigate("/documents");
			})
			.finally(() => setLoading(false));
	}, [id, isEditing, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		try {
			if (isEditing) {
				await updateExpense(id, state);
				navigate("/documents");
			} else {
				await createExpense(state);
				showToast("Expense saved.");
				dispatch({ type: "RESET", initialState });
			}
		} catch (error) {
			if (error.errors) {
				setErrors(error.errors);
			} else {
				showToast(error.message || "Something went wrong saving the expense.", "error");
			}
		}
	};

	if (loading) {
		return <p className="text-[#888888] text-center">Loading expense…</p>;
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="bg-[#222222] px-5 py-4 rounded-md text-[#cccccc] text-center w-5xl">
				<div className="mb-5">
					<label htmlFor="expenseType" className="block mb-2">
						Expense type
					</label>
					<Input
						id="expenseType"
						type="text"
						placeholder="Chemicals, rent, electricity…"
						dispatch={dispatch}
						value={state.expenseType}
					/>
					{errors.expenseType && (
						<p className="text-[#e08b8b] text-sm mt-1 text-left">{errors.expenseType}</p>
					)}
				</div>
				<div className="mb-5">
					<label htmlFor="amount" className="block mb-2">
						Amount
					</label>
					<Input id="amount" type="number" placeholder="0" dispatch={dispatch} value={state.amount} />
					{errors.amount && <p className="text-[#e08b8b] text-sm mt-1 text-left">{errors.amount}</p>}
				</div>

				<div className="flex gap-3 justify-center">
					<Button>{isEditing ? "Update expense" : "Save expense"}</Button>
					{isEditing && (
						<Link
							to="/documents"
							className="font-bold text-center bg-[#333333] w-3xl my-4 py-1 rounded-sm cursor-pointer flex items-center justify-center">
							Cancel
						</Link>
					)}
				</div>
			</form>
			<Toast toast={toast} />
		</>
	);
};

export default ExpenseForm;
