import { useEffect, useState } from "react";
import {
	getDailySummary,
	getMonthlySummary,
	getYearlySummary,
	getOrders,
	getExpenses,
	isAbortError,
} from "../api/client";
import { currentMonthString, currentYearString, getMonthBounds, todayString } from "../../../shared/date.js";
import { downloadCsv } from "../utils/csv";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import TabButton from "./TabButton";

const RANGE_TABS = [
	{ key: "day", label: "Day" },
	{ key: "month", label: "Month" },
	{ key: "year", label: "Year" },
];

const Reports = () => {
	const [range, setRange] = useState("day");
	const [date, setDate] = useState(todayString());
	const [month, setMonth] = useState(currentMonthString());
	const [year, setYear] = useState(currentYearString());
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);
	const { toast, showToast } = useToast();

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		const fetchers = {
			day: () => getDailySummary(date, { signal: controller.signal }),
			month: () => getMonthlySummary(month, { signal: controller.signal }),
			year: () => getYearlySummary(year, { signal: controller.signal }),
		};
		fetchers[range]()
			.then((res) => setSummary(res.data))
			.catch((error) => {
				if (!isAbortError(error)) {
					console.error("Failed to load summary:", error);
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});

		return () => controller.abort();
	}, [range, date, month, year]);

	const getRangeBounds = () => {
		if (range === "day") return { from: date, to: date, label: date };
		if (range === "month") {
			return { ...getMonthBounds(month), label: month };
		}
		return { from: `${year}-01-01`, to: `${year}-12-31`, label: year };
	};

	const handleExport = async () => {
		const { from, to, label } = getRangeBounds();
		setExporting(true);
		try {
			const [ordersRes, expensesRes] = await Promise.all([
				getOrders({ from, to }),
				getExpenses({ from, to }),
			]);

			const rows = [["Date", "Type", "Details", "Amount"]];
			ordersRes.data.forEach((order) => {
				rows.push([
					order.createdAt,
					"Order",
					`${order.snapType} ${order.photoSize} x${order.quantity}`,
					order.amount,
				]);
			});
			expensesRes.data.forEach((expense) => {
				const isSalary = expense.category === "salary";
				rows.push([
					expense.createdAt,
					isSalary ? "Salary" : "Expense",
					isSalary ? "Salary" : expense.expenseType,
					-expense.amount,
				]);
			});

			downloadCsv(`saikote-${range}-${label}.csv`, rows);
		} catch (error) {
			showToast(error.message || "Couldn't export CSV.", "error");
		} finally {
			setExporting(false);
		}
	};

	return (
		<>
			<div className="bg-[#222222] rounded-md text-[#cccccc] w-5xl p-6">
				<div className="flex justify-between items-center mb-6">
					<div className="flex gap-2">
						{RANGE_TABS.map((tab) => (
							<TabButton
								key={tab.key}
								active={range === tab.key}
								onClick={() => setRange(tab.key)}
							>
								{tab.label}
							</TabButton>
						))}
					</div>
					<button
						onClick={handleExport}
						disabled={exporting}
						className="px-4 py-1 rounded-sm font-bold cursor-pointer bg-[#333333] text-[#cccccc] hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed">
						{exporting ? "Exporting…" : "Export CSV"}
					</button>
				</div>

				<div className="mb-8">
					{range === "day" && (
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="bg-[#333333] rounded-sm py-2 px-3 outline-none"
						/>
					)}
					{range === "month" && (
						<input
							type="month"
							value={month}
							onChange={(e) => setMonth(e.target.value)}
							className="bg-[#333333] rounded-sm py-2 px-3 outline-none"
						/>
					)}
					{range === "year" && (
						<input
							type="number"
							value={year}
							onChange={(e) => setYear(e.target.value)}
							className="bg-[#333333] rounded-sm py-2 px-3 outline-none w-28"
						/>
					)}
				</div>

				{loading || !summary ? (
					<p className="text-[#888888]">Loading…</p>
				) : (
					<div className="grid grid-cols-3 gap-4">
						<div className="bg-[#1d3a2f] rounded-md p-5">
							<div className="text-[#7ed9a8] text-sm font-bold mb-1">Income</div>
							<div className="text-2xl font-bold text-white">{summary.income}</div>
						</div>
						<div className="bg-[#3a1d1d] rounded-md p-5">
							<div className="text-[#e08b8b] text-sm font-bold mb-1">Expense</div>
							<div className="text-2xl font-bold text-white">{summary.expense}</div>
						</div>
						<div className="bg-[#2a2a2a] rounded-md p-5">
							<div className="text-[#cccccc] text-sm font-bold mb-1">Net</div>
							<div className="text-2xl font-bold text-white">{summary.net}</div>
						</div>
					</div>
				)}
			</div>
			<Toast toast={toast} />
		</>
	);
};

export default Reports;
