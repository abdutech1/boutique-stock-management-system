import { Request, Response } from "express";
import { generateBusinessReport, Period } from "../../services/reports.service.js";
import {
  getWeeklyRange,
  getMonthlyRange,
  getYearlyRange,
} from "../../utils/dateRange.js";

/* =========================
   PERIOD MAP
   ========================= */

const rangeMap: Record<"weekly" | "monthly" | "yearly", () => Period> = {
  weekly: getWeeklyRange,
  monthly: getMonthlyRange,
  yearly: getYearlyRange,
};

/* =========================
   GENERIC HANDLER FACTORY
   ========================= */

async function handleReportRequest(
  req: Request,
  res: Response,
  type: "weekly" | "monthly" | "yearly",
  isDashboard: boolean
) {
  try {
    const period = rangeMap[type]();

    const report = await generateBusinessReport(period, {
      includeTopEmployees: isDashboard,
      includeLowStock: isDashboard,
    });

    return res.status(200).json(report);
  } catch (error) {
    console.error("Report error:", error);
    return res.status(500).json({
      message: "Failed to generate report",
    });
  }
}

/* =========================
   FINANCIAL REPORTS (NO DASHBOARD DATA)
   ========================= */

export const weeklyFinancialReport = (req: Request, res: Response) =>
  handleReportRequest(req, res, "weekly", false);

export const monthlyFinancialReport = (req: Request, res: Response) =>
  handleReportRequest(req, res, "monthly", false);

export const yearlyFinancialReport = (req: Request, res: Response) =>
  handleReportRequest(req, res, "yearly", false);

/* =========================
   OWNER DASHBOARD REPORTS
   ========================= */

export const weeklyOwnerDashboard = (req: Request, res: Response) =>
  handleReportRequest(req, res, "weekly", true);

export const monthlyOwnerDashboard = (req: Request, res: Response) =>
  handleReportRequest(req, res, "monthly", true);

export const yearlyOwnerDashboard = (req: Request, res: Response) =>
  handleReportRequest(req, res, "yearly", true);
