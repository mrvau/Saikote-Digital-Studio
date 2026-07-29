import { useEffect, useState, useCallback, useMemo, useContext } from "react";
import {
	getOrders,
	getExpenses,
	deleteOrder,
	deleteExpense,
	getMonthlySummary,
	isAbortError,
} from "../api/client";
import { currentMonthString, getMonthBounds, todayString } from "../../../shared/date.js";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import { SummaryContext } from "../contexts/summaryContext";
import DocumentRow from "./DocumentRow";
import TabButton from "./TabButton";


const toDate = (value) => new Date(value.replace(" ", "T"));

const getDocumentParams = (date, isSalaryFilter) => {
	if (!date) return {};
	if (isSalaryFilter) return getMonthBounds(date.slice(0, 7));
	return { from: date, to: date };
};

const KIND_TABS = [
	{ key: "all", label: "All" },
	{ key: "order", label: "Orders" },
	{ key: "expense", label: "Expenses" },
	{ key: "salary", label: "Salary" },
];

const PAYMENT_TABS = [
	{ key: "all", label: "All" },
	{ key: "paid", label: "Paid" },
	{ key: "unpaid", label: "Unpaid" },
	{ key: "partial", label: "Partial" },
];

const DocumentsList = () => {
	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [confirmTarget, setConfirmTarget] = useState(null);
	const [filterDate, setFilterDate] = useState(todayString());
	const [filterKind, setFilterKind] = useState("all");
	const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
	const [monthlySalary, setMonthlySalary] = useState(0);
	const { toast, showToast } = useToast();
	const {fetchSummary} = useContext(SummaryContext)
	const isSalaryFilter = filterKind === "salary";
	const documentParams = useMemo(
		() => getDocumentParams(filterDate, isSalaryFilter),
		[filterDate, isSalaryFilter],
	);
	const summaryMonth = filterDate ? filterDate.slice(0, 7) : currentMonthString();

	// Reset payment filter when switching to a kind that doesn't support it
	useEffect(() => {
		if (filterKind === "expense" || filterKind === "salary") {
			setFilterPaymentStatus("all");
		}
	}, [filterKind]);

	const load = useCallback(async (params, month, options = {}) => {
		setLoading(true);
		setError(null);
		try {
			const [ordersRes, expensesRes, summaryRes] = await Promise.all([
				getOrders(params, options),
				getExpenses(params, options),
				getMonthlySummary(month, options),
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
			if (isAbortError(err)) return;
			setError(err.message || "Couldn't load documents.");
		} finally {
			if (!options.signal?.aborted) setLoading(false);
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		load(documentParams, summaryMonth, { signal: controller.signal });
		return () => controller.abort();
	}, [load, documentParams, summaryMonth]);

	const visibleDocuments = useMemo(() => {
		let docs = filterKind === "all" ? documents : documents.filter((d) => d.kind === filterKind);

		if (filterPaymentStatus !== "all") {
			docs = docs.filter((d) => {
				if (d.kind !== "order") return true; // non-orders always pass
				if (filterPaymentStatus === "paid") return d.isPaid;
				if (filterPaymentStatus === "unpaid") return !d.isPaid && d.paidAmount === 0;
				if (filterPaymentStatus === "partial") return !d.isPaid && d.paidAmount > 0;
				return true;
			});
		}

		return docs;
	}, [documents, filterKind, filterPaymentStatus]);

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
		if (!confirmTarget) return;
		const doc = confirmTarget;
		setConfirmTarget(null);
		try {
			if (doc.kind === "order") {
				await deleteOrder(doc.id);
			} else {
				await deleteExpense(doc.id);
			}
			await fetchSummary();
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

	const showPaymentFilter = filterKind === "all" || filterKind === "order";

	return (
		<>
			<div className="bg-[#222222] rounded-md text-[#cccccc] w-5xl overflow-visible">
				{/* Filter bar */}
				<div className="flex items-center gap-3 px-5 py-4 border-b border-[#333333]">
					{/* Kind tabs */}
					<div className="flex gap-2">
						{KIND_TABS.map((tab) => (
							<TabButton
								key={tab.key}
								active={filterKind === tab.key}
								onClick={() => setFilterKind(tab.key)}
								size="sm"
								hover>
								{tab.label}
							</TabButton>
						))}
					</div>

					{/* Divider */}
					<div className="w-px h-5 bg-[#333333]" />

					{/* Payment status filter — only when orders are visible */}
					{showPaymentFilter && (
						<>
							<div className="flex gap-1.5">
								{PAYMENT_TABS.map((tab) => (
									<TabButton
										key={tab.key}
										active={filterPaymentStatus === tab.key}
										onClick={() => setFilterPaymentStatus(tab.key)}
										size="sm"
										hover>
										{tab.label}
									</TabButton>
								))}
							</div>
							<div className="w-px h-5 bg-[#333333]" />
						</>
					)}

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

				{/* Column headers — 6 columns to match DocumentRow */}
				<div className="grid grid-cols-[110px_90px_110px_1fr_110px_140px] gap-2 px-5 py-3 text-[#888888] text-sm font-bold border-b border-[#333333]">
					<span>Date</span>
					<span>Type</span>
					<span>Status</span>
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
						<DocumentRow
							key={`${doc.kind}-${doc.id}`}
							doc={doc}
							onConfirmDelete={setConfirmTarget}
						/>
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
