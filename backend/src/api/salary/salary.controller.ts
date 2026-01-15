import { Request, Response } from "express";
import { createSalaryPayment, generateSalaryReport, getAllSalaries } from "../../services/salary.service.js";

/**
 * Pay salary endpoint (manual, with UPSERT & validation)
 */
export async function paySalary(req: Request, res: Response) {
  try {
    const { userId, amount, weekStart, weekEnd } = req.body;

    const salary = await createSalaryPayment({
      userId: Number(userId),
      amount: Number(amount),
      weekStart: new Date(weekStart),
      weekEnd: new Date(weekEnd),
    });

    res.status(201).json(salary);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * OWNER only: Generate salary report including bonuses
 */
export async function getSalaryReport(req: Request, res: Response) {
  try {
    const { weekStart, weekEnd } = req.query;

    const report = await generateSalaryReport({
      weekStart: weekStart ? new Date(String(weekStart)) : undefined,
      weekEnd: weekEnd ? new Date(String(weekEnd)) : undefined,
    });

    res.json(report);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Optional: OWNER only, fetch all salary payments
 */
export async function getSalaries(req: Request, res: Response) {
  try {
    const salaries = await getAllSalaries();
    res.json(salaries);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
