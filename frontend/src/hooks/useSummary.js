import { useContext } from "react"
import { SummaryContext } from "../context/summaryContext"

export const useSummary = () => {
  const context = useContext(SummaryContext)
  if(!context) throw new Error("useSummary must be used within a SummaryProvider")
  
  return context
}