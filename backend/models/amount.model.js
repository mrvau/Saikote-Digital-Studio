import mongoose from "mongoose";

const amountSchema = mongoose.Schema({
	totalAmount: {
		type: Number,
		required: true,
	},
});

const Amount = mongoose.model("Amount", amountSchema);

export default Amount;
