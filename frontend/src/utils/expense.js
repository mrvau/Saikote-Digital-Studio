const CATEGORY_TO_VALUE = {
	Salary: "salary",
	"Shop Expense": "shop_expense",
};

const CATEGORY_TO_LABEL = {
	salary: "Salary",
	shop_expense: "Shop Expense",
};

export const normalizeExpenseCategory = (category) => CATEGORY_TO_VALUE[category] || category;

export const toExpenseFormState = (expense) => ({
	...expense,
	category: CATEGORY_TO_LABEL[expense.category] || "",
});

export const toExpensePayload = (state) => ({
	...state,
	category: normalizeExpenseCategory(state.category),
});

export const isSalaryCategory = (category) => normalizeExpenseCategory(category) === "salary";
