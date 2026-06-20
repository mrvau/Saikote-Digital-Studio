import { Router } from "express";
import { dailySummary, monthlySummary, yearlySummary } from "../controllers/summary.controller.js";

const router = Router();

router.get("/daily", dailySummary);
router.get("/monthly", monthlySummary);
router.get("/yearly", yearlySummary);

export default router;
