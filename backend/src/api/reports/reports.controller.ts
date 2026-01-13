import { Request, Response } from 'express';
import { getWeeklyRange } from "../../utils/dateRange.js";
import { generateReport } from "../../services/reports.service.js";

export async function weeklyReport(req:Request, res:Response) {
  const period = getWeeklyRange();

  const report = await generateReport(period);

  res.json(report);
}
