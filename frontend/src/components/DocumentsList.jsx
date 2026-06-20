import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getOrders, getExpenses, deleteOrder, deleteExpense } from "../api/client";

const formatDate = (value) => (value ? value.slice(0, 16) : "");
const toDate = (value) => new Date(value.replace(" ", "T"));

const DocumentsList = () => {
	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [ordersRes, expensesRes] = await Promise.all([getOrders(), getExpenses()]);
			const orders = ordersRes.data.map((order) => ({
				...order,
				kind: "order",
				summary: `${order.snapType} · ${order.photoSize} × ${order.quantity}`,
			}));
			const expenses = expensesRes.data.map((expense) => ({
				...expense,
				kind: "expense",
				summary: expense.expenseType,
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
		load();
	}, [load]);

	const handleDelete = async (doc) => {
		const label = doc.kind === "order" ? "this order" : "this expense";
		if (!window.confirm(`Delete ${label}? This can't be undone.`)) return;
		try {
			if (doc.kind === "order") {
				await deleteOrder(doc.id);
			} else {
				await deleteExpense(doc.id);
			}
			setDocuments((prev) => prev.filter((d) => !(d.kind === doc.kind && d.id === doc.id)));
		} catch (err) {
			alert(err.message || "Couldn't delete that entry.");
		}
	};

	if (loading) return <p className="text-[#888888] text-center">Loading documents…</p>;
	if (error) return <p className="text-[#e08b8b] text-center">{error}</p>;

	return (
		<div className="bg-[#222222] rounded-md text-[#cccccc] w-5xl overflow-hidden">
			<div className="grid grid-cols-[110px_90px_1fr_110px_140px] gap-2 px-5 py-3 text-[#888888] text-sm font-bold border-b border-[#333333]">
				<span>Date</span>
				<span>Type</span>
				<span>Details</span>
				<span>Amount</span>
				<span></span>
			</div>
			{documents.length === 0 ? (
				<p className="px-5 py-8 text-center text-[#888888]">
					No orders or expenses yet — add one to see it here.
				</p>
			) : (
				documents.map((doc) => (
					<div
						key={`${doc.kind}-${doc.id}`}
						className="grid grid-cols-[110px_90px_1fr_110px_140px] gap-2 px-5 py-3 items-center border-b border-[#2a2a2a] last:border-none">
						<span className="text-sm text-[#888888]">{formatDate(doc.createdAt)}</span>
						<span
							className={`text-xs font-bold px-2 py-1 rounded-sm w-fit ${
								doc.kind === "order" ? "bg-[#1d3a2f] text-[#7ed9a8]" : "bg-[#3a1d1d] text-[#e08b8b]"
							}`}>
							{doc.kind === "order" ? "Order" : "Expense"}
						</span>
						<span>{doc.summary}</span>
						<span className={doc.kind === "order" ? "text-[#7ed9a8]" : "text-[#e08b8b]"}>
							{doc.kind === "order" ? "+" : "-"}
							{doc.amount}
						</span>
						<span className="flex gap-3 justify-end">
							<Link
								to={doc.kind === "order" ? `/orders/${doc.id}/edit` : `/expenses/${doc.id}/edit`}
								className="text-[#888888] hover:text-white">
								Edit
							</Link>
							<button
								onClick={() => handleDelete(doc)}
								className="text-[#888888] hover:text-[#e08b8b] cursor-pointer">
								Delete
							</button>
						</span>
					</div>
				))
			)}
		</div>
	);
};

export default DocumentsList;
