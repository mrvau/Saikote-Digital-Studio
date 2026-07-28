import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { normalInputs, labInputs, paymentInputs, normalizePaymentMethod } from "../constants";
import { getOrder, createOrder, updateOrder, isAbortError } from "../api/client";
import { FormContext } from "../contexts/formContext";
import { useFormSubmit } from "../hooks/useFormSubmit";
import FormLayout from "./FormLayout";
import FormField from "./FormField";

const calculateDueAmount = (amount, paidAmount) => {
	const paid = parseFloat(paidAmount) || 0;
	const total = parseFloat(amount) || 0;
	return Math.max(0, total - paid);
};

const Form = () => {
	const { id } = useParams();
	const isEditing = Boolean(id);
	const { orderState: state, orderDispatch: dispatch } = useContext(FormContext);
	const [loading, setLoading] = useState(isEditing);
	const { handleFormSubmit, errors, toast } = useFormSubmit();

	const handlePaidAmountChange = (value) => {
		dispatch({ type: "UPDATE_FIELD", field: "paidAmount", value });
		const due = calculateDueAmount(state.amount, value);
		dispatch({ type: "UPDATE_FIELD", field: "dueAmount", value: due });
	};

	useEffect(() => {
		const due = calculateDueAmount(state.amount, state.paidAmount);
		dispatch({ type: "UPDATE_FIELD", field: "dueAmount", value: due });
	}, [state.amount, state.paidAmount, dispatch]);

	useEffect(() => {
		if (!isEditing) return;

		const controller = new AbortController();
		getOrder(id, { signal: controller.signal })
			.then((res) => dispatch({ type: "LOAD", payload: res.data }))
			.catch((error) => {
				if (!isAbortError(error)) {
					console.error("Couldn't load order:", error);
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});

		return () => controller.abort();
	}, [id, isEditing, dispatch]);

	const onSubmit = (e) => {
		handleFormSubmit(e, {
			isEditing,
			payload: state,
			submitAction: isEditing ? (data) => updateOrder(id, data) : createOrder,
			successMessage: "Order saved.",
			dispatch,
		});
	};

	if (loading) {
		return <p className="text-[#888888] text-center">Loading order…</p>;
	}

	return (
		<FormLayout
			onSubmit={onSubmit}
			isEditing={isEditing}
			submitText={isEditing ? "Update order" : "Save order"}
			toast={toast}
		>
			{normalInputs.map((input) => (
				<FormField key={input.id} input={input} state={state} dispatch={dispatch} errors={errors} />
			))}

			{state.printMethod === "Lab" &&
				labInputs.map((input) => (
					<FormField key={input.id} input={input} state={state} dispatch={dispatch} errors={errors} />
				))}

			<div className="border-t border-[#333333] my-6 pt-6">
				<h3 className="text-lg font-semibold mb-4 text-left">Payment Details</h3>
				{paymentInputs.map((input) => {
					const customDispatch = input.id === "paidAmount"
						? (action) => handlePaidAmountChange(action.value)
						: dispatch;
					return (
						<FormField
							key={input.id}
							input={input}
							state={state}
							dispatch={customDispatch}
							errors={errors}
						/>
					);
				})}
			</div>
		</FormLayout>
	);
};

export default Form;
