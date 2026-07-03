import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./useToast";
import { SummaryContext } from "../contexts/summaryContext";

export const useFormSubmit = () => {
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const { toast, showToast } = useToast();
	const { fetchSummary } = useContext(SummaryContext);

	const handleFormSubmit = async (e, { isEditing, payload, submitAction, successMessage, dispatch }) => {
		e.preventDefault();
		setErrors({});
		try {
			await submitAction(payload);
			if (isEditing) {
				navigate("/documents");
			} else {
				showToast(successMessage);
				if (dispatch) dispatch({ type: "RESET" });
			}
			await fetchSummary();
		} catch (error) {
			if (error.errors) {
				setErrors(error.errors);
			} else {
				showToast(error.message || "Something went wrong.", "error");
			}
		}
	};

	return { handleFormSubmit, errors, setErrors, toast, showToast };
};
