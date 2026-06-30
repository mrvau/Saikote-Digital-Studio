import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExpense, createExpense, updateExpense } from "../api/client";
import { expenseInputs } from "../constants";
import { FormContext } from "../contexts/formContext";
import { useFormSubmit } from "../hooks/useFormSubmit";
import FormLayout from "./FormLayout";
import FormField from "./FormField";

const CATEGORY_MAP = { Salary: "salary", "Shop Expense": "shop_expense" };
const CATEGORY_REVERSE = { salary: "Salary", shop_expense: "Shop Expense" };

const ExpenseForm = () => {
	const { id } = useParams();
	const isEditing = Boolean(id);
	const { expenseState: state, expenseDispatch: dispatch } = useContext(FormContext);
	const [loading, setLoading] = useState(isEditing);
	const { handleFormSubmit, errors, toast } = useFormSubmit();

	useEffect(() => {
		if (!isEditing) return;
		getExpense(id)
			.then((res) => {
				const data = res.data;
				dispatch({
					type: "LOAD",
					payload: {
						...data,
						category: CATEGORY_REVERSE[data.category] || "",
					},
				});
			})
			.catch((error) => {
				console.error("Couldn't load expense:", error);
			})
			.finally(() => setLoading(false));
	}, [id, isEditing, dispatch]);

	const isSalary = CATEGORY_MAP[state.category] === "salary";

	const onSubmit = (e) => {
		const payload = {
			...state,
			category: CATEGORY_MAP[state.category] || state.category,
			expenseType: isSalary ? null : state.expenseType,
		};
		handleFormSubmit(e, {
			isEditing,
			payload,
			submitAction: isEditing ? (data) => updateExpense(id, data) : createExpense,
			successMessage: "Expense saved.",
			dispatch,
		});
	};

	if (loading) {
		return <p className="text-[#888888] text-center">Loading expense…</p>;
	}

	return (
		<FormLayout
			onSubmit={onSubmit}
			isEditing={isEditing}
			submitText={isEditing ? "Update expense" : "Save expense"}
			toast={toast}
		>
			{expenseInputs.map((input, index) => {
				if (isSalary && input.id === "expenseType") return null;
				return <FormField key={index} input={input} state={state} dispatch={dispatch} errors={errors} />;
			})}
		</FormLayout>
	);
};

export default ExpenseForm;
