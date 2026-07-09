import { Component } from "react";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		console.error("Unhandled React error:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<main className="flex flex-col items-center w-full">
					<div className="bg-[#222222] rounded-md text-[#cccccc] w-5xl p-6 text-center">
						<p className="text-[#e08b8b] font-bold mb-4">Something went wrong.</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="px-4 py-1 rounded-sm font-bold cursor-pointer bg-[#333333] text-[#cccccc] hover:bg-[#3a3a3a]">
							Reload
						</button>
					</div>
				</main>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
