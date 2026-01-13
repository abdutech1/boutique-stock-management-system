import { Router } from "express";
import { weeklyReport,monthlyReport,yearlyReport,weeklyEmployeePerformance } from "./reports.controller.js";

const router = Router();

router.get("/weekly", weeklyReport);
router.get("/monthly", monthlyReport);
router.get("/yearly", yearlyReport);
router.get("/employees/weekly", weeklyEmployeePerformance);



export default router;
