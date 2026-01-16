import { Request, Response } from "express";
import { generateBusinessReport, Period,generateSalesReport } from "../../services/reports.service.js";
import {
  getDailyRange,
  getWeeklyRange,
  getMonthlyRange,
  getYearlyRange,
} from "../../utils/dateRange.js";

/* =====================================================
   BUSINESS REPORTS (PROFIT / DASHBOARD)
   ===================================================== */

type BusinessPeriodType = "weekly" | "monthly" | "yearly";

const businessRangeMap: Record<BusinessPeriodType, () => Period> = {
  weekly: getWeeklyRange,
  monthly: getMonthlyRange,
  yearly: getYearlyRange,
};

async function handleBusinessReport(
  req: Request,
  res: Response,
  type: BusinessPeriodType,
  isDashboard: boolean
) {
  try {
    const period = businessRangeMap[type]();

    const report = await generateBusinessReport(period, {
      includeTopEmployees: isDashboard,
      includeLowStock: isDashboard,
    });

    return res.status(200).json(report);
  } catch (error) {
    console.error("Business report error:", error);
    return res.status(500).json({
      message: "Failed to generate business report",
    });
  }
}

/* -------- Financial Reports -------- */

export const weeklyFinancialReport = (req: Request, res: Response) =>
  handleBusinessReport(req, res, "weekly", false);

export const monthlyFinancialReport = (req: Request, res: Response) =>
  handleBusinessReport(req, res, "monthly", false);

export const yearlyFinancialReport = (req: Request, res: Response) =>
  handleBusinessReport(req, res, "yearly", false);

/* -------- Owner Dashboard -------- */

export const weeklyOwnerDashboard = (req: Request, res: Response) =>
  handleBusinessReport(req, res, "weekly", true);

export const monthlyOwnerDashboard = (req: Request, res: Response) =>
  handleBusinessReport(req, res, "monthly", true);

export const yearlyOwnerDashboard = (req: Request, res: Response) =>
  handleBusinessReport(req, res, "yearly", true);

/* =====================================================
   SALES REPORTS (OPERATIONAL / TESTING)
   ===================================================== */

type SalesPeriodType = "daily" | "weekly" | "monthly";

const salesRangeMap: Record<SalesPeriodType, () => { start: Date; end: Date }> =
  {
    daily: getDailyRange,
    weekly: getWeeklyRange,
    monthly: getMonthlyRange,
  };

async function handleSalesReport(
  req: Request,
  res: Response,
  type: SalesPeriodType
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found on request" });
    }
    
    const { start, end } = salesRangeMap[type]();

    const report = await generateSalesReport({
      start,
      end,
      userId: req.user.id,
      role: req.user.role,
    });

    return res.status(200).json(report);
  } catch (error) {
    console.error("Sales report error:", error);
    return res.status(500).json({
      message: "Failed to generate sales report",
    });
  }
}

/* -------- Sales Reports -------- */

export const dailySalesReport = (req: Request, res: Response) =>
  handleSalesReport(req, res, "daily");

export const weeklySalesReport = (req: Request, res: Response) =>
  handleSalesReport(req, res, "weekly");

export const monthlySalesReport = (req: Request, res: Response) =>
  handleSalesReport(req, res, "monthly");
