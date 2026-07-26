import { Router } from "express";
import { dailySummary, monthlySummary, yearlySummary, outstandingBalance } from "../controllers/summary.controller.js";

const router = Router();

router.get("/daily", dailySummary);
router.get("/monthly", monthlySummary);
router.get("/yearly", yearlySummary);
router.get("/outstanding", outstandingBalance);

export default router;
