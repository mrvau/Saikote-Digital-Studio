import Photo from "../models/photo.model.js";

export const savePhotoDetails = async (req, res, next) => {
	// const {
	// 	imageType,
	// 	photoId,
	// 	photoSize,
	// 	quantity,
	// 	amount,
	// 	printType,
	// 	labPhotoSize,
	// 	labQuantity,
	// } = req.body;

	// const newPhoto = new Photo({
	// 	imageType,
	// 	photoId,
	// 	photoSize,
	// 	quantity,
	// 	amount,
	// 	printType,
	// 	labPhotoSize,
	// 	labQuantity,
	// });

	// try {
	// 	await newPhoto.save();
	// 	res.status(201).json({ message: "Photo details saved successfully" });
	// } catch (error) {
	// 	console.error("Error saving photo details:", error);
	// 	res.status(500).json({ message: "Internal server error" });
	// }
	console.log(req.body);
};
