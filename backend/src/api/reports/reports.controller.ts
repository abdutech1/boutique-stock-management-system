import { Request, Response } from 'express';
import { getWeeklyRange, getMonthlyRange,
  getYearlyRange } from "../../utils/dateRange.js";
import { generateReport,employeePerformance } from "../../services/reports.service.js";

// Weekly Report
export async function weeklyReport(req:Request, res:Response) {
  const period = getWeeklyRange();

  const report = await generateReport(period);

  res.json(report);
}

// Monthly Report
export async function monthlyReport(req:Request, res:Response) {
  const report = await generateReport(getMonthlyRange());
  res.json(report);
}

// Yearly Report
export async function yearlyReport(req:Request, res:Response) {
  const year = Number(req.query.year);
  const report = await generateReport(
    year ? getYearlyRange(year) : getYearlyRange()
  );
  res.json(report);
}

// Weekly Employee Performance

export async function weeklyEmployeePerformance(req: Request, res: Response) {
  try {
    const period = getWeeklyRange();
    const report = await employeePerformance(period);
    res.json(report);
  } catch (err) {
    const message = err instanceof Error 
      ? err.message 
      : 'An unexpected error occurred';

    res.status(500).json({ message });
  }
}
