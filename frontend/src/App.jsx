import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import ExpenseForm from "./components/ExpenseForm";
import DocumentsList from "./components/DocumentsList";
import Reports from "./components/Reports";
import { useCallback, useEffect, useState } from "react";
import { getDailySummary } from "./api/client.js";
import { SummaryContext } from "./context/summaryContext";

function App() {
	const [summary, setSummary] = useState(null)

  const dailySummary = useCallback(() => {
    getDailySummary()
      .then(res => setSummary(res.data))
      .catch(error => console.error("Failed to load today's summary:", error))
  }, [])

  useEffect(() => {
    dailySummary()
  }, [dailySummary])

	return (
		<div className="flex flex-col items-center min-h-screen pb-16">
			<header className="py-10">
				<h1 className="font-italiana text-7xl text-white">SAIKOTE DIGITAL STUDIO</h1>
			</header>
			<SummaryContext.Provider value={{summary, refetch: dailySummary}}>
				<Navbar />
				<main className="flex flex-col items-center w-full">
					<Routes>
						<Route path="/" element={<Form />} />
						<Route path="/orders/:id/edit" element={<Form />} />
						<Route path="/expenses" element={<ExpenseForm />} />
						<Route path="/expenses/:id/edit" element={<ExpenseForm />} />
						<Route path="/documents" element={<DocumentsList />} />
						<Route path="/reports" element={<Reports />} />
					</Routes>
				</main>
			</SummaryContext.Provider>
		</div>
	);
}

export default App;
