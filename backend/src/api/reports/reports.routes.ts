import { Router } from "express";
import {
  weeklyFinancialReport,
  monthlyFinancialReport,
  yearlyFinancialReport,
  weeklyOwnerDashboard,
  monthlyOwnerDashboard,
  yearlyOwnerDashboard,
} from "./reports.controller.js";

const router = Router();

/* =========================
   FINANCIAL REPORTS
   ========================= */
// Accounting / summaries / exports
router.get("/weekly", weeklyFinancialReport);
router.get("/monthly", monthlyFinancialReport);
router.get("/yearly", yearlyFinancialReport);

/* =========================
   OWNER DASHBOARD
   ========================= */
// Insights / charts / management view
router.get("/dashboard/weekly", weeklyOwnerDashboard);
router.get("/dashboard/monthly", monthlyOwnerDashboard);
router.get("/dashboard/yearly", yearlyOwnerDashboard);

export default router;
