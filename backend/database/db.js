import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { runMigrations } from "./migrate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "studio.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// Run all pending migrations at startup
await runMigrations(db);

export default db;
