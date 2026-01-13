import { Request, Response } from "express";
import { createExpense } from "../../services/expense.service.js";

export async function addExpense(req: Request, res: Response) {
  try {
    const { description, amount, weekStart, weekEnd } = req.body;

    const expense = await createExpense({
      description,
      amount,
      weekStart: new Date(weekStart),
      weekEnd: new Date(weekEnd),
    });

    res.status(201).json(expense);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
