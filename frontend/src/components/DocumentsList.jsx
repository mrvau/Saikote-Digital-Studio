import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { getOrders, getExpenses, deleteOrder, deleteExpense, getMonthlySummary } from "../api/client";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import { useSummary } from "../hooks/useSummary";


const formatDate = (value) => (value ? value.slice(0, 16) : "");
const toDate = (value) => new Date(value.replace(" ", "T"));
const todayString = () => new Date().toLocaleDateString("sv-SE");

const KIND_TABS = [
	{ key: "all", label: "All" },
	{ key: "order", label: "Orders" },
	{ key: "expense", label: "Expenses" },
	{ key: "salary", label: "Salary" },
];

const DocumentsList = () => {
	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [confirmTarget, setConfirmTarget] = useState(null);
	const [filterDate, setFilterDate] = useState(todayString());
	const [filterKind, setFilterKind] = useState("all"); // "all" | "order" | "expense"
	const [monthlySalary, setMonthlySalary] = useState(0);
	const { toast, showToast } = useToast();
	const {refetch} = useSummary()

	const load = useCallback(async (date, kind) => {
		setLoading(true);
		setError(null);
		try {
			let params = date ? { from: date, to: date } : {};
			if (kind === "salary" && date) {
				const month = date.slice(0, 7);
				const lastDay = new Date(month.slice(0, 4), month.slice(5, 7), 0).getDate();
				params = { from: `${month}-01`, to: `${month}-${lastDay}` };
			}
			const monthStr = date ? date.slice(0, 7) : todayString().slice(0, 7);
			
			const [ordersRes, expensesRes, summaryRes] = await Promise.all([
				getOrders(params),
				getExpenses(params),
				getMonthlySummary(monthStr),
			]);
			
			setMonthlySalary(summaryRes.data.salary || 0);

			const orders = ordersRes.data.map((order) => ({
				...order,
				kind: "order",
				summary: `${order.snapType} · ${order.photoSize} × ${order.quantity}`,
			}));
			const expenses = expensesRes.data.map((expense) => ({
				...expense,
				kind: expense.category === "salary" ? "salary" : "expense",
				summary: expense.category === "salary" ? "Salary" : expense.expenseType,
			}));
			const merged = [...orders, ...expenses].sort(
				(a, b) => toDate(b.createdAt) - toDate(a.createdAt),
			);
			setDocuments(merged);
		} catch (err) {
			setError(err.message || "Couldn't load documents.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load(filterDate, filterKind);
	}, [load, filterDate, filterKind]);

	// Kind filtering is applied client-side — no extra API call needed
	// since the data is already loaded and kind is a property on every row.
	const visibleDocuments =
		filterKind === "all" ? documents : documents.filter((d) => d.kind === filterKind);

	const totals = useMemo(() => {
		if (!filterDate) return null;
		let income = 0;
		let expense = 0;
		for (const doc of documents) {
			if (doc.kind === "order") income += doc.amount;
			else expense += doc.amount;
		}
		return { income, expense, net: income - expense };
	}, [documents, filterDate]);

	const handleConfirmDelete = async () => {
		const doc = confirmTarget;
		setConfirmTarget(null);
		try {
			if (doc.kind === "order") {
				await deleteOrder(doc.id);
			} else {
				await deleteExpense(doc.id);
			}
			refetch()
			setDocuments((prev) => prev.filter((d) => !(d.kind === doc.kind && d.id === doc.id)));
		} catch (err) {
			showToast(err.message || "Couldn't delete that entry.", "error");
		}
	};

	const kindLabels = { order: "orders", expense: "expenses", salary: "salary records" };
	const emptyMessage =
		filterKind !== "all"
			? `No ${kindLabels[filterKind] || filterKind} found${filterDate ? ` for ${filterDate}` : ""}.`
			: filterDate
				? `No records found for ${filterDate}.`
				: "No orders or expenses yet — add one to see it here.";

	return (
		<>
			<div className="bg-[#222222] rounded-md text-[#cccccc] w-5xl overflow-hidden">
				{/* Filter bar */}
				<div className="flex items-center gap-3 px-5 py-4 border-b border-[#333333]">
					{/* Kind tabs */}
					<div className="flex gap-2">
						{KIND_TABS.map((tab) => (
							<button
								key={tab.key}
								onClick={() => setFilterKind(tab.key)}
								className={`px-3 py-1.5 rounded-sm text-sm font-bold cursor-pointer ${
									filterKind === tab.key
										? "bg-[#382798] text-white"
										: "bg-[#333333] text-[#888888] hover:text-white"
								}`}>
								{tab.label}
							</button>
						))}
					</div>

					{/* Divider */}
					<div className="w-px h-5 bg-[#333333]" />

					{/* Date filter */}
					<input
						type={filterKind === "salary" ? "month" : "date"}
						value={filterKind === "salary" ? filterDate.slice(0, 7) : filterDate}
						onChange={(e) => {
							const val = e.target.value;
							if (filterKind === "salary") {
								setFilterDate(val ? `${val}-01` : "");
							} else {
								setFilterDate(val);
							}
						}}
						className="bg-[#333333] rounded-sm py-1.5 px-3 outline-none text-sm text-[#cccccc]"
					/>
					<button
						onClick={() => setFilterDate(todayString())}
						className="px-3 py-1.5 rounded-sm text-sm font-bold bg-[#333333] text-[#888888] hover:text-white cursor-pointer">
						Today
					</button>
					{filterDate && (
						<button
							onClick={() => setFilterDate("")}
							className="px-3 py-1.5 rounded-sm text-sm font-bold bg-[#333333] text-[#888888] hover:text-white cursor-pointer">
							Clear
						</button>
					)}

					{/* Record count */}
					<span className="ml-auto text-sm text-[#888888]">
						{!loading &&
							`${visibleDocuments.length} record${visibleDocuments.length !== 1 ? "s" : ""}`}
					</span>
				</div>

				{/* Column headers */}
				<div className="grid grid-cols-[110px_90px_1fr_110px_140px] gap-2 px-5 py-3 text-[#888888] text-sm font-bold border-b border-[#333333]">
					<span>Date</span>
					<span>Type</span>
					<span>Details</span>
					<span>Amount</span>
					<span></span>
				</div>

				{/* Body */}
				{loading ? (
					<p className="px-5 py-8 text-center text-[#888888]">Loading…</p>
				) : error ? (
					<p className="px-5 py-8 text-center text-[#e08b8b]">{error}</p>
				) : visibleDocuments.length === 0 ? (
					<p className="px-5 py-8 text-center text-[#888888]">{emptyMessage}</p>
				) : (
					visibleDocuments.map((doc) => (
						<div
							key={`${doc.kind}-${doc.id}`}
							className="grid grid-cols-[110px_90px_1fr_110px_140px] gap-2 px-5 py-3 items-center border-b border-[#2a2a2a] last:border-none">
							<span className="text-sm text-[#888888]">
								{formatDate(doc.createdAt)}
							</span>
							<span
								className={`text-xs font-bold px-2 py-1 rounded-sm w-fit ${
									doc.kind === "order"
										? "bg-[#1d3a2f] text-[#7ed9a8]"
										: doc.kind === "salary"
											? "bg-[#3a351d] text-[#e0c97d]"
											: "bg-[#3a1d1d] text-[#e08b8b]"
								}`}>
								{doc.kind === "order" ? "Order" : doc.kind === "salary" ? "Salary" : "Expense"}
							</span>
							<span>{doc.summary}</span>
							<span
								className={
									doc.kind === "order"
										? "text-[#7ed9a8]"
										: doc.kind === "salary"
											? "text-[#e0c97d]"
											: "text-[#e08b8b]"
								}>
								{doc.kind === "order" ? "+" : "-"}
								{doc.amount}
							</span>
							<span className="flex gap-3 justify-end">
								<Link
									to={
										doc.kind === "order"
											? `/orders/${doc.id}/edit`
											: `/expenses/${doc.id}/edit`
									}
									className="text-[#888888] hover:text-white">
									Edit
								</Link>
								<button
									onClick={() => setConfirmTarget(doc)}
									className="text-[#888888] hover:text-[#e08b8b] cursor-pointer">
									Delete
								</button>
							</span>
						</div>
					))
				)}

				{/* Totals Footer */}
				{!loading && !error && (filterKind === "salary" || filterDate) && (
					<div className="px-5 py-4 bg-[#1a1a1a] border-t border-[#333333] flex gap-8 font-bold text-sm items-center">
						{filterKind === "salary" ? (
							<span className="text-[#e0c97d]">Monthly Total Salary: {monthlySalary}</span>
						) : filterDate ? (
							<>
								<span className="text-[#7ed9a8]">Total Income: {totals?.income || 0}</span>
								<span className="text-[#e08b8b]">Total Expense: {totals?.expense || 0}</span>
								<span className={totals?.net >= 0 ? "text-[#7ed9a8]" : "text-[#e08b8b] ml-auto"}>
									Net: {totals?.net > 0 ? "+" : ""}{totals?.net || 0}
								</span>
							</>
						) : null}
					</div>
				)}
			</div>

			<ConfirmDialog
				open={Boolean(confirmTarget)}
				message={`Delete this ${confirmTarget?.kind === "order" ? "order" : confirmTarget?.kind === "salary" ? "salary entry" : "expense"}? This can't be undone.`}
				onConfirm={handleConfirmDelete}
				onCancel={() => setConfirmTarget(null)}
			/>
			<Toast toast={toast} />
		</>
	);
};

export default DocumentsList;
