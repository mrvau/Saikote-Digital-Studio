import Input from "./Input";
import Select from "./Select";
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
	category: "",
	expenseType: "",
	amount: "",
};

const CATEGORY_OPTIONS = ["Salary", "Shop Expense"];
const CATEGORY_MAP = { Salary: "salary", "Shop Expense": "shop_expense" };
const CATEGORY_REVERSE = { salary: "Salary", shop_expense: "Shop Expense" };

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
			.then((res) => {
				const data = res.data;
				dispatch({
					type: "LOAD",
					payload: {
						...data,
						// Map DB value back to display label for the Select component
						category: CATEGORY_REVERSE[data.category] || "",
					},
				});
			})
			.catch((error) => {
				console.error("Couldn't load expense:", error);
				navigate("/documents");
			})
			.finally(() => setLoading(false));
	}, [id, isEditing, navigate]);

	const isSalary = CATEGORY_MAP[state.category] === "salary";

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		// Map the display label to the DB value before sending
		const payload = {
			...state,
			category: CATEGORY_MAP[state.category] || state.category,
			expenseType: isSalary ? null : state.expenseType,
		};
		try {
			if (isEditing) {
				await updateExpense(id, payload);
				navigate("/documents");
			} else {
				await createExpense(payload);
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
				{/* Category selector */}
				<div className="mb-5">
					<label htmlFor="category" className="block mb-2">
						Category
					</label>
					<Select
						id="category"
						options={CATEGORY_OPTIONS}
						dispatch={dispatch}
						value={state.category}
					/>
					{errors.category && (
						<p className="text-[#e08b8b] text-sm mt-1 text-left">{errors.category}</p>
					)}
				</div>

				{/* Expense type — only shown for Shop Expense */}
				{!isSalary && (
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
				)}

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
