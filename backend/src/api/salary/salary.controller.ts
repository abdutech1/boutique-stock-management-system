import { Request, Response } from "express";
import { createSalaryPayment } from "../../services/salary.service.js";

export async function paySalary(req: Request, res: Response) {
  try {
    const { userId, amount, weekStart, weekEnd } = req.body;

    const salary = await createSalaryPayment({
      userId,
      amount,
      weekStart: new Date(weekStart),
      weekEnd: new Date(weekEnd),
    });

    res.status(201).json(salary);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
