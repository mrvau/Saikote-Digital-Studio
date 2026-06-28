import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import Toast from "./Toast";
import { useReducer, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getExpense, createExpense, updateExpense } from "../api/client";
import { useToast } from "../hooks/useToast";
import { expenseInputs } from "../constants";

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
				{expenseInputs.map((input, index) => {
					// Hide Expense Type if category is Salary
					if (isSalary && input.id === "expenseType") return null;

					return (
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
								<p className="text-[#e08b8b] text-sm mt-1 text-left">{errors[input.id]}</p>
							)}
						</div>
					);
				})}

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
