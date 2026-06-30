import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { normalInputs, labInputs } from "../constants";
import { getOrder, createOrder, updateOrder } from "../api/client";
import { FormContext } from "../contexts/formContext";
import { useFormSubmit } from "../hooks/useFormSubmit";
import FormLayout from "./FormLayout";
import FormField from "./FormField";

const Form = () => {
	const { id } = useParams();
	const isEditing = Boolean(id);
	const { orderState: state, orderDispatch: dispatch } = useContext(FormContext);
	const [loading, setLoading] = useState(isEditing);
	const { handleFormSubmit, errors, toast } = useFormSubmit();

	useEffect(() => {
		if (!isEditing) return;
		getOrder(id)
			.then((res) => dispatch({ type: "LOAD", payload: res.data }))
			.catch((error) => {
				console.error("Couldn't load order:", error);
			})
			.finally(() => setLoading(false));
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
			{normalInputs.map((input, index) => (
				<FormField key={index} input={input} state={state} dispatch={dispatch} errors={errors} />
			))}

			{state.printMethod === "Lab" &&
				labInputs.map((input, index) => (
					<FormField key={index} input={input} state={state} dispatch={dispatch} errors={errors} />
				))}
		</FormLayout>
	);
};

export default Form;
