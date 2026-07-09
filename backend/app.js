import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pathToFileURL } from "url";

import orderRoutes from "./routes/order.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import summaryRoutes from "./routes/summary.routes.js";

// Only the Vite dev server needs an explicit origin here. Requests with no Origin header
// (Electron's loadFile() pages, curl, etc.) are allowed through — this server only ever
// binds to 127.0.0.1, so the real boundary is "same machine", not the Origin header.
const allowedOrigins = ["http://localhost:5173"];

export const createApp = () => {
	const app = express();
	app.use(helmet());

	app.use(
		cors({
			origin: (origin, callback) => {
				if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
				callback(new Error("Not allowed by CORS"));
			},
		}),
	);
	app.use(express.json());


	app.get("/", (req, res) => {
		res.json({ success: true, message: "Welcome to Saikote Digital Studio" });
	});

	app.use("/orders", orderRoutes);
	app.use("/expenses", expenseRoutes);
	app.use("/summary", summaryRoutes);

	app.use((error, _req, res, next) => {
		if (res.headersSent) return next(error);

		if (error.type === "entity.parse.failed") {
			return res.status(400).json({ success: false, message: "Invalid JSON payload." });
		}

		console.error("Unhandled request error:", error);
		res.status(500).json({ success: false, message: "Internal server error." });
	});

	return app;
};

export const startServer = (port = process.env.PORT || 5000) =>
	new Promise((resolve) => {
		const server = createApp().listen(port, "127.0.0.1", () => {
			console.log(`App running on: http://127.0.0.1:${port}`);
			resolve(server);
		});
	});

// Only auto-start when this file is run directly (`node app.js` / `nodemon app.js` or via `fork`),
// not when Electron's main process imports startServer() itself.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	startServer().then(async () => {
		const { backupDatabase } = await import("./lib/backup.js");
		const runBackup = () =>
			backupDatabase().catch((error) => console.error("Backup failed:", error));
		runBackup();
		setInterval(runBackup, 6 * 60 * 60 * 1000);
	});
}
