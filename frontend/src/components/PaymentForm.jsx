import { useState, useContext } from "react";
import { createPayment } from "../api/client";
import { useToast } from "../hooks/useToast";
import { SummaryContext } from "../contexts/summaryContext";
import Button from "./Button";
import Toast from "./Toast";

const paymentMethods = ["cash", "card", "transfer", "other"];

const PaymentForm = ({ orderId, orderAmount, onPaymentRecorded }) => {
	const [amount, setAmount] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("cash");
	const [notes, setNotes] = useState("");
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const { showToast } = useToast();
	const { fetchSummary } = useContext(SummaryContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		setLoading(true);

		try {
			await createPayment({
				orderId,
				amount,
				paymentMethod,
				notes,
			});
			setAmount("");
			setNotes("");
			setPaymentMethod("cash");
			setShow(false);
			showToast("Payment recorded successfully.");
			await fetchSummary();
			if (onPaymentRecorded) onPaymentRecorded();
		} catch (error) {
			if (error.errors) {
				setErrors(error.errors);
			} else {
				showToast(error.message || "Failed to record payment.", "error");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setShow(true)}
				className="text-xs font-bold bg-[#382798] text-white px-3 py-1 rounded-sm cursor-pointer hover:bg-[#4a37a8]">
				Pay
			</button>
			{show && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
					<div className="bg-[#222222] rounded-md p-6 w-sm text-[#cccccc]">
						<h3 className="font-bold mb-4 text-white">Record Payment</h3>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block mb-1 text-sm">Amount (Outstanding: {orderAmount})</label>
								<input
									id="amount"
									type="number"
									step="10"
									min="1"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className="outline-none w-full rounded-sm py-2 px-2 bg-[#333333] text-[#cccccc]"
								/>
								{errors.amount && <p className="text-[#e08b8b] text-sm mt-1">{errors.amount}</p>}
							</div>
							<div className="mb-4">
								<label className="block mb-1 text-sm">Payment Method</label>
								<select
									id="paymentMethod"
									value={paymentMethod}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="rounded-sm py-2 px-1 cursor-pointer bg-[#333333] w-full text-[#cccccc]">
									{paymentMethods.map((method) => (
										<option key={method} value={method}>
											{method}
										</option>
									))}
								</select>
							</div>
							<div className="mb-4">
								<label className="block mb-1 text-sm">Notes</label>
								<input
									id="notes"
									type="text"
									placeholder="Optional"
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									className="outline-none w-full rounded-sm py-2 px-2 bg-[#333333] text-[#cccccc]"
								/>
							</div>
							<div className="flex gap-3 justify-center">
								<Button type="submit" disabled={loading}>
									{loading ? "Saving…" : "Save Payment"}
								</Button>
								<button
									type="button"
									onClick={() => setShow(false)}
									className="font-bold text-center bg-[#333333] w-3xl my-4 py-1 rounded-sm cursor-pointer">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default PaymentForm;