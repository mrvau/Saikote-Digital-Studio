import { createContext, useReducer } from "react";

const FormContext = createContext();

const orderInitialState = {
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

const expenseInitialState = {
	category: "",
	expenseType: "",
	amount: "",
};

const orderReducer = (state, action) => {
	switch (action.type) {
		case "UPDATE_FIELD":
			return { ...state, [action.field]: action.value };
		case "LOAD":
			return { ...state, ...action.payload };
		case "RESET":
			return orderInitialState;
		default:
			return state;
	}
};

const expenseReducer = (state, action) => {
	switch (action.type) {
		case "UPDATE_FIELD":
			return { ...state, [action.field]: action.value };
		case "LOAD":
			return { ...state, ...action.payload };
		case "RESET":
			return expenseInitialState;
		default:
			return state;
	}
};

const FormProvider = ({ children }) => {
	const [orderState, orderDispatch] = useReducer(orderReducer, orderInitialState);
	const [expenseState, expenseDispatch] = useReducer(expenseReducer, expenseInitialState);

	return (
		<FormContext.Provider value={{ orderState, orderDispatch, expenseState, expenseDispatch }}>
			{children}
		</FormContext.Provider>
	);
};


export {FormProvider, FormContext}