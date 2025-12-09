import mongoose from "mongoose";

const photoSchema = mongoose.Schema(
	{
		snapType: {
			type: String,
			enum: ["Snapshot", "Scan"],
			default: "Snapshot",
			required: true,
		},
		photoNo: {
			type: String,
			required: function () {
				return this.snapType === "Snapshot";
			},
		},
		photoSizePrint: {
			type: String,
			required: true,
		},
		quantity: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		printType: {
			type: String,
			enum: ["Normal", "Lab"],
			default: "Normal",
			required: true,
		},
		deliveryType: {
			type: String,
			default: "Non-Urgent",
			required: function () {
				return this.printType === "Lab";
			},
		},
		photoSizeLab: {
			type: String,
			required: function () {
				return this.printType === "Lab";
			},
		},
		labQuantity: {
			type: Number,
			required: function () {
				return this.printType === "Lab";
			},
		},
		date: {
			type: Date,
			default: Date.now(),
		},
	},
	{ timestamps: true },
);

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;
