import { createContext, useCallback, useEffect, useState } from "react";
import { getDailySummary } from "../api/client";

const SummaryContext = createContext()

const SummaryProvider = ({children}) => {
  const [summary, setSummary] = useState(null);

  const fetchSummary = useCallback(async () => {
    try{
      const res = await getDailySummary()
      setSummary(res.data)
    } catch (error) {
      console.error("Failed to load today's summary:", error);
    }
  }, [])

	useEffect(() => {
		fetchSummary()
	}, [fetchSummary]);

  return (
    <SummaryContext.Provider value={{summary, fetchSummary}}>
      {children}
    </SummaryContext.Provider>
  )
}

export { SummaryContext, SummaryProvider }