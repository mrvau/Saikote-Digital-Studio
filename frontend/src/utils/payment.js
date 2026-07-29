/**
 * Derives payment-status badge metadata from an order object.
 * Returns { status, label, color, bgColor } for rendering badges.
 */
export const getPaymentStatus = (order) => {
	if (order.isPaid) {
		return {
			status: "paid",
			label: "✓ Paid",
			color: "text-[#7ed9a8]",
			bgColor: "bg-[#1d3a2f]",
		};
	}
	if (order.paidAmount > 0) {
		return {
			status: "partial",
			label: `⚠ Due: ৳${order.dueAmount}`,
			color: "text-[#e0c97d]",
			bgColor: "bg-[#3a351d]",
		};
	}
	return {
		status: "unpaid",
		label: "✗ Unpaid",
		color: "text-[#e08b8b]",
		bgColor: "bg-[#3a1d1d]",
	};
};
