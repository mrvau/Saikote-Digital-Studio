import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExpense, createExpense, updateExpense, isAbortError } from "../api/client";
import { expenseInputs } from "../constants";
import { FormContext } from "../contexts/formContext";
import { useFormSubmit } from "../hooks/useFormSubmit";
import { isSalaryCategory, toExpenseFormState, toExpensePayload } from "../utils/expense";
import FormLayout from "./FormLayout";
import FormField from "./FormField";

const ExpenseForm = () => {
	const { id } = useParams();
	const isEditing = Boolean(id);
	const { expenseState: state, expenseDispatch: dispatch } = useContext(FormContext);
	const [loading, setLoading] = useState(isEditing);
	const { handleFormSubmit, errors, toast } = useFormSubmit();

	useEffect(() => {
		if (!isEditing) return;
		const controller = new AbortController();
		getExpense(id, { signal: controller.signal })
			.then((res) => {
				dispatch({
					type: "LOAD",
					payload: toExpenseFormState(res.data),
				});
			})
			.catch((error) => {
				if (!isAbortError(error)) {
					console.error("Couldn't load expense:", error);
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});

		return () => controller.abort();
	}, [id, isEditing, dispatch]);

	const isSalary = isSalaryCategory(state.category);

	const onSubmit = (e) => {
		handleFormSubmit(e, {
			isEditing,
			payload: toExpensePayload(state),
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
			{expenseInputs.map((input) => {
				if (isSalary && input.id === "expenseType") return null;
				return <FormField key={input.id} input={input} state={state} dispatch={dispatch} errors={errors} />;
			})}
		</FormLayout>
	);
};

export default ExpenseForm;
