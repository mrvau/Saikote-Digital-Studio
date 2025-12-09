import { useState } from "react";
import Form from "./components/Form";
import Navbar from "./components/Navbar";

function App() {
	const [income, setIncome] = useState(0);
	return (
		<div className="flex flex-col justify-center items-center pb-10">
			<header className="py-10">
				<h1 className="font-italiana text-7xl text-white">SAIKOTE DIGITAL STUDIO</h1>
			</header>
			<Navbar income={income} />
			<Form setIncome={setIncome} />
		</div>
	);
}

export default App;
