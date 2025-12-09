import validateForm from "../lib/validate.js";
import Photo from "../models/photo.model.js";

export const savePhotoDetails = async (req, res, next) => {
	const errors = validateForm(req.body);
	if (Object.keys(errors).length) {
		return res.status(400).json({ errors });
	}
	const photo = new Photo(req.body);
	console.log(photo);
	try {
		await photo.save();
		console.log("Photo details saved successfully.");
		next();
	} catch (error) {
		console.error("Error saving photo details:", error);
		next(error);
	}
};
