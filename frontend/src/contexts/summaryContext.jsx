import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getDailySummary, isAbortError } from "../api/client";

const SummaryContext = createContext();

const SummaryProvider = ({ children }) => {
	const [summary, setSummary] = useState(null);

	const fetchSummary = useCallback(async (options) => {
		try {
			const res = await getDailySummary(undefined, options);
			setSummary(res.data);
		} catch (error) {
			if (!isAbortError(error)) {
				console.error("Failed to load today's summary:", error);
			}
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		fetchSummary({ signal: controller.signal });
		return () => controller.abort();
	}, [fetchSummary]);

	const value = useMemo(() => ({ summary, fetchSummary }), [summary, fetchSummary]);

	return <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>;
};

export { SummaryContext, SummaryProvider };
