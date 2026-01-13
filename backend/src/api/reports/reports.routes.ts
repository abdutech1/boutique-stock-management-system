import { Router } from "express";
import { weeklyReport,monthlyReport,yearlyReport } from "./reports.controller.js";

const router = Router();

router.get("/weekly", weeklyReport);
router.get("/monthly", monthlyReport);
router.get("/yearly", yearlyReport);


export default router;
