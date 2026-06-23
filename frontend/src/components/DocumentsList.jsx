import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getOrders, getExpenses, deleteOrder, deleteExpense } from "../api/client";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import ConfirmDialog from "./ConfirmDialog";

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
	const { toast, showToast } = useToast();

	const load = useCallback(async (date) => {
		setLoading(true);
		setError(null);
		try {
			const params = date ? { from: date, to: date } : {};
			const [ordersRes, expensesRes] = await Promise.all([
				getOrders(params),
				getExpenses(params),
			]);
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
		load(filterDate);
	}, [load, filterDate]);

	// Kind filtering is applied client-side — no extra API call needed
	// since the data is already loaded and kind is a property on every row.
	const visibleDocuments =
		filterKind === "all" ? documents : documents.filter((d) => d.kind === filterKind);

	const handleConfirmDelete = async () => {
		const doc = confirmTarget;
		setConfirmTarget(null);
		try {
			if (doc.kind === "order") {
				await deleteOrder(doc.id);
			} else {
				await deleteExpense(doc.id);
			}
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
						type="date"
						value={filterDate}
						onChange={(e) => setFilterDate(e.target.value)}
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
