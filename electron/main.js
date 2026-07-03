import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

let mainWindow;
let backupInterval;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		backgroundColor: "#161616",
		icon: path.join(__dirname, "..", "build", "icon.png"),
		webPreferences: {
			preload: path.join(__dirname, "preload.cjs"),
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	if (isDev) {
		mainWindow.loadURL("http://localhost:5173");
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
	}
};

app.whenReady().then(async () => {
	if (!isDev) Menu.setApplicationMenu(null);

	// Must be set before the backend is imported, since database/db.js reads it
	// the moment that module is evaluated. A static `import` at the top of this
	// file would be hoisted and run before this line ever executed — that's
	// why a dynamic import() is used here instead.
	process.env.DB_PATH = path.join(app.getPath("userData"), "studio.db");

	const { startServer } = await import("../backend/app.js");
	const { backupDatabase } = await import("../backend/lib/backup.js");
	await startServer();

	const runBackup = () =>
		backupDatabase().catch((error) => console.error("Backup failed:", error));
	runBackup(); // once on launch — covers whatever changed since the last time the app was open
	backupInterval = setInterval(runBackup, 6 * 60 * 60 * 1000); // and every 6 hours, for long-running sessions

	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
	if (backupInterval) clearInterval(backupInterval);
});
