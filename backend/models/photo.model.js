import mongoose from "mongoose";

const photoSchema = mongoose.Schema(
	{
		imageType: {
			type: String,
			default: "Snapshot",
		},
		photoId: {
			type: String,
			required: true,
		},
		photoSize: {
			type: String,
			required: true,
		},
		quantity: {
			type: String,
			required: true,
		},
		amount: {
			type: String,
			required: true,
		},
		printType: {
			type: String,
			default: "Normal",
		},
		labPhotoSize: {
			type: String,
		},
		labQuantity: {
			type: Number,
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
