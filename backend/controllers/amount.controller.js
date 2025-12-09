import Amount from "../models/amount.model.js";

export const saveTotalAmount = async (req, res, next) => {
	const { amount } = req.body;
	// Validate amount
	const parsed = Number(amount);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return res
			.status(400)
			.json({ message: "Invalid amount. Amount must be a positive number." });
	}

	try {
		// Atomically increment the stored totalAmount. If no document exists, create one (upsert).
		// Using an empty filter to keep a single document that holds the running total.
		const updated = await Amount.findOneAndUpdate(
			{},
			{ $inc: { totalAmount: parsed } },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
		).lean();

		return res.status(200).json({
			success: true,
			data: { photoNo: req.body.photoNo || "Scan", totalAmount: updated.totalAmount },
		});
	} catch (err) {
		return next(err);
	}
};

export const getTotalAmount = async (req, res, next) => {
	try {
		const amountDoc = await Amount.findOne({}).lean();
		res.status(200).json({
			success: true,
			data: { totalAmount: amountDoc ? amountDoc.totalAmount : 0 },
		});
	} catch (err) {
		return next(err);
	}
};
