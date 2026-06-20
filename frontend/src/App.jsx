import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import ExpenseForm from "./components/ExpenseForm";
import DocumentsList from "./components/DocumentsList";
import Reports from "./components/Reports";

function App() {
	return (
		<div className="flex flex-col items-center min-h-screen pb-16">
			<header className="py-10">
				<h1 className="font-italiana text-7xl text-white">SAIKOTE DIGITAL STUDIO</h1>
			</header>
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
		</div>
	);
}

export default App;
