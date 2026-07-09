const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
	const { headers, ...fetchOptions } = options;
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...fetchOptions,
		headers: { "Content-Type": "application/json", ...headers },
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

export const isAbortError = (error) => error?.name === "AbortError";

export const getOrders = (params, options) => request(`/orders${toQuery(params)}`, options);
export const getOrder = (id, options) => request(`/orders/${id}`, options);
export const createOrder = (data) => request("/orders", { method: "POST", body: JSON.stringify(data) });
export const updateOrder = (id, data) =>
	request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteOrder = (id) => request(`/orders/${id}`, { method: "DELETE" });

export const getExpenses = (params, options) => request(`/expenses${toQuery(params)}`, options);
export const getExpense = (id, options) => request(`/expenses/${id}`, options);
export const createExpense = (data) =>
	request("/expenses", { method: "POST", body: JSON.stringify(data) });
export const updateExpense = (id, data) =>
	request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteExpense = (id) => request(`/expenses/${id}`, { method: "DELETE" });

export const getDailySummary = (date, options) => request(`/summary/daily${toQuery({ date })}`, options);
export const getMonthlySummary = (month, options) =>
	request(`/summary/monthly${toQuery({ month })}`, options);
export const getYearlySummary = (year, options) =>
	request(`/summary/yearly${toQuery({ year })}`, options);
