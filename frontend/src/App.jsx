import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import ExpenseForm from "./components/ExpenseForm";
import DocumentsList from "./components/DocumentsList";
import Reports from "./components/Reports";
import ErrorBoundary from "./components/ErrorBoundary";
import { SummaryProvider } from "./contexts/summaryContext";
import { FormProvider } from "./contexts/formContext";

function App() {
	return (
		<div className="flex flex-col items-center min-h-screen pb-16">
			<header className="py-10">
				<h1 className="font-italiana text-7xl text-white">SAIKOTE DIGITAL STUDIO</h1>
			</header>
			<SummaryProvider>
				<FormProvider>
					<ErrorBoundary>
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
					</ErrorBoundary>
				</FormProvider>
			</SummaryProvider>
		</div>
	);
}

export default App;
