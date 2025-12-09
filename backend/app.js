import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDatabase from "./database/mongodb.js";
import { savePhotoDetails } from "./controllers/savePhoto.controller.js";
import { saveTotalAmount } from "./controllers/amount.controller.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/", savePhotoDetails, saveTotalAmount);

app.listen(process.env.PORT, () => {
	console.log(`App running on ${process.env.APP_URL}`);
	connectDatabase();
});
