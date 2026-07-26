import { Link } from "react-router-dom";
import { KIND_THEMES } from "../constants";

const formatDate = (value) => (value ? value.slice(0, 16) : "");
const formatDateFull = (value) => {
	if (!value) return "—";
	const d = new Date(value.replace(" ", "T"));
	return d.toLocaleString("en-GB", {
		day: "2-digit", month: "short", year: "numeric",
		hour: "2-digit", minute: "2-digit", hour12: true,
	});
};

const TooltipField = ({ label, value }) => {
	if (value === null || value === undefined || value === "") return null;
	return (
		<div className="flex justify-between gap-4">
			<span className="text-[#888888] whitespace-nowrap">{label}</span>
			<span className="text-[#cccccc] font-medium text-right">{value}</span>
		</div>
	);
};

const PaymentBadge = ({ orderAmount, totalPaid }) => {
	const outstanding = orderAmount - totalPaid;
	if (outstanding <= 0) {
		return <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-[#1d3a2f] text-[#7ed9a8]">Paid</span>;
	}
	if (totalPaid > 0) {
		return <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-[#3a351d] text-[#e0c97d]">Partially Paid</span>;
	}
	return <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-[#3a1d1d] text-[#e08b8b]">Unpaid</span>;
};

const DocumentRow = ({ doc, onConfirmDelete, onPay }) => {
	const theme = KIND_THEMES[doc.kind] || KIND_THEMES.order;
	const isOrder = doc.kind === "order";

	return (
		<div className="group relative grid grid-cols-[110px_90px_1fr_110px_180px] gap-2 px-5 py-3 items-center border-b border-[#2a2a2a] last:border-none hover:bg-[#2a2a2a]/50 transition-colors">
			<span className="text-sm text-[#888888]">{formatDate(doc.createdAt)}</span>
			<span className={`text-xs font-bold px-2 py-1 rounded-sm w-fit ${theme.badge}`}>
				{theme.label}
			</span>
			<span>{doc.summary}</span>
			<span className={theme.text}>
				{theme.sign}
				{doc.amount} ৳
			</span>
			<span className="flex gap-3 justify-end items-center">
				{isOrder && onPay && (
					<button
						type="button"
						onClick={() => onPay(doc.id)}
						className="text-xs font-bold bg-[#382798] text-white px-2 py-0.5 rounded-sm cursor-pointer hover:bg-[#4a37a8]">
						Pay
					</button>
				)}
				{isOrder && <PaymentBadge orderAmount={doc.amount} totalPaid={doc.totalPaid || 0} />}
				<Link
					to={doc.kind === "order" ? `/orders/${doc.id}/edit` : `/expenses/${doc.id}/edit`}
					className="text-[#888888] hover:text-white">
					Edit
				</Link>
				<button
					onClick={() => onConfirmDelete(doc)}
					className="text-[#888888] hover:text-[#e08b8b] cursor-pointer">
					Delete
				</button>
			</span>

			{/* Tooltip */}
			<div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-72 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-bottom">
				<div className="bg-[#1a1a1a] border border-[#333333] rounded-lg shadow-2xl shadow-black/60 p-4">
					{/* Header */}
					<div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2a2a2a]">
						<span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${theme.badge}`}>
							{theme.label}
						</span>
						<span className="text-[#666666] text-xs ml-auto">ID: {doc.id}</span>
					</div>

					{/* Fields */}
					<div className="flex flex-col gap-1.5 text-xs">
						{doc.kind === "order" ? (
							<>
								<TooltipField label="Snap Type" value={doc.snapType} />
								<TooltipField label="Photo No." value={doc.photoNo} />
								<TooltipField label="Photo Size" value={doc.photoSize} />
								<TooltipField label="Quantity" value={doc.quantity} />
								<TooltipField label="Print Method" value={doc.printMethod} />
								{doc.printMethod === "Lab" && (
									<>
										<TooltipField label="Print Type" value={doc.printType} />
										<TooltipField label="Delivery" value={doc.deliveryType} />
										<TooltipField label="Lab Size" value={doc.labPhotoSize} />
										<TooltipField label="Lab Qty" value={doc.labQuantity} />
									</>
								)}
							</>
						) : (
							<>
								<TooltipField label="Category" value={doc.category} />
								{doc.expenseType && (
									<TooltipField label="Type" value={doc.expenseType} />
								)}
							</>
						)}

						{/* Amount */}
						<div className="flex justify-between gap-4 mt-1 pt-2 border-t border-[#2a2a2a]">
							<span className="text-[#888888]">Amount</span>
							<span className={`font-bold ${theme.text}`}>
								{theme.sign}{doc.amount} ৳
							</span>
						</div>

						{/* Payment Info */}
						{isOrder && (
							<div className="mt-1 pt-2 border-t border-[#2a2a2a]">
								<TooltipField label="Total Paid" value={`${doc.totalPaid || 0} ৳`} />
								<TooltipField label="Outstanding" value={`${(doc.amount - (doc.totalPaid || 0))} ৳`} />
							</div>
						)}

						{/* Timestamps */}
						<div className="mt-1 pt-2 border-t border-[#2a2a2a] flex flex-col gap-1">
							<TooltipField label="Created" value={formatDateFull(doc.createdAt)} />
							{doc.updatedAt && doc.updatedAt !== doc.createdAt && (
								<TooltipField label="Updated" value={formatDateFull(doc.updatedAt)} />
							)}
						</div>
					</div>
				</div>
				{/* Arrow */}
				<div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-[#1a1a1a] border-r border-b border-[#333333] rotate-45" />
			</div>
		</div>
	);
};

export default DocumentRow;

