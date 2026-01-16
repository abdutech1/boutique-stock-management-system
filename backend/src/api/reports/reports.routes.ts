import { Router } from "express";
import { authorize } from "../../middleware/authorize.js";
import {
  weeklyFinancialReport,
  monthlyFinancialReport,
  yearlyFinancialReport,
  weeklyOwnerDashboard,
  monthlyOwnerDashboard,
  yearlyOwnerDashboard,
  dailySalesReport,
  weeklySalesReport,
  monthlySalesReport,
} from "./reports.controller.js";

const router = Router();

/* =========================
   FINANCIAL REPORTS
   ========================= */
// Accounting / summaries / exports
router.get("/weekly", authorize("OWNER"), weeklyFinancialReport);
router.get("/monthly",  authorize("OWNER"),monthlyFinancialReport);
router.get("/yearly",  authorize("OWNER"),yearlyFinancialReport);

/* =========================
   OWNER DASHBOARD
   ========================= */
// Insights / charts / management view
router.get("/dashboard/weekly", authorize("OWNER"), weeklyOwnerDashboard);
router.get("/dashboard/monthly",  authorize("OWNER"),monthlyOwnerDashboard);
router.get("/dashboard/yearly", authorize("OWNER"), yearlyOwnerDashboard);

// OWNER & EMPLOYEE
router.get("/sales/daily", authorize("OWNER", "EMPLOYEE"), dailySalesReport);
router.get("/sales/weekly", authorize("OWNER", "EMPLOYEE"), weeklySalesReport);
router.get("/sales/monthly", authorize("OWNER", "EMPLOYEE"), monthlySalesReport);

export default router;
