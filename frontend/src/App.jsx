import Form from "./components/Form";
import Navbar from "./components/Navbar";

function App() {
	return (
		<div className="flex flex-col justify-center items-center pb-10">
			<header className="py-10">
				<h1 className="font-italiana text-7xl text-white">SAIKOTE DIGITAL STUDIO</h1>
			</header>
			<Navbar />
			<Form />
		</div>
	);
}

export default App;
