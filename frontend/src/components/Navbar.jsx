import { NavLink } from "react-router-dom";
import { SummaryContext } from "../contexts/summaryContext";
import { useContext, useState, useEffect } from "react";
import { getTotalOutstandingBalance } from "../api/client";
import { isAbortError } from "../api/client";

const navLinkClass = ({ isActive }) =>
	`hover:text-white transition-colors ${isActive ? "text-white" : "text-[#888888]"}`;

const Navbar = () => {
	const { summary } = useContext(SummaryContext);
	const [outstanding, setOutstanding] = useState(null);

	useEffect(() => {
		const controller = new AbortController();
		getTotalOutstandingBalance({ signal: controller.signal })
			.then((res) => setOutstanding(res.data.outstandingBalance))
			.catch((error) => {
				if (!isAbortError(error)) {
					console.error("Failed to load outstanding balance:", error);
				}
			});
		return () => controller.abort();
	}, []);

	return (
		<div className="w-5xl mb-8 flex justify-between items-end">
			<nav className="flex gap-6 font-bold text-[#cccccc]">
				<NavLink to="/" end className={navLinkClass}>
					New order
				</NavLink>
				<NavLink to="/expenses" className={navLinkClass}>
					New expense
				</NavLink>
				<NavLink to="/documents" className={navLinkClass}>
					Documents
				</NavLink>
				<NavLink to="/reports" className={navLinkClass}>
					Reports
				</NavLink>
			</nav>
			<div className="text-right text-sm">
				<div className="text-[#888888] mb-1">Today</div>
				{summary ? (
					<div className="flex gap-4 font-bold">
						<span className="text-[#7ed9a8]">+{summary.income}</span>
						<span className="text-[#e08b8b]">-{summary.expense}</span>
						<span className="text-white">Net {summary.net}</span>
					</div>
				) : (
					<div className="text-[#888888]">Loading…</div>
				)}
				{outstanding !== null && outstanding > 0 && (
					<div className="text-[#e08b8b] text-xs mt-1">
						Outstanding: {outstanding} ৳
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;