const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: { "Content-Type": "application/json" },
		...options,
	});
	const result = await response.json().catch(() => ({}));
	if (!response.ok) {
		const error = new Error(result.message || "Request failed");
		error.errors = result.errors;
		throw error;
	}
	return result;
};

const toQuery = (params = {}) => {
	const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
	return entries.length ? `?${new URLSearchParams(entries).toString()}` : "";
};

export const getOrders = (params) => request(`/orders${toQuery(params)}`);
export const getOrder = (id) => request(`/orders/${id}`);
export const createOrder = (data) => request("/orders", { method: "POST", body: JSON.stringify(data) });
export const updateOrder = (id, data) =>
	request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteOrder = (id) => request(`/orders/${id}`, { method: "DELETE" });

export const getExpenses = (params) => request(`/expenses${toQuery(params)}`);
export const getExpense = (id) => request(`/expenses/${id}`);
export const createExpense = (data) =>
	request("/expenses", { method: "POST", body: JSON.stringify(data) });
export const updateExpense = (id, data) =>
	request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteExpense = (id) => request(`/expenses/${id}`, { method: "DELETE" });

export const getDailySummary = (date) => request(`/summary/daily${date ? `?date=${date}` : ""}`);
export const getMonthlySummary = (month) =>
	request(`/summary/monthly${month ? `?month=${month}` : ""}`);
export const getYearlySummary = (year) => request(`/summary/yearly${year ? `?year=${year}` : ""}`);
