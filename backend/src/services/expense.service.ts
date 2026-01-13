import prisma from "../prismaClient.js";

type CreateExpenseInput = {
  description: string;
  amount: number;
  weekStart: Date;
  weekEnd: Date;
};

export async function createExpense(data: CreateExpenseInput) {
  if (data.amount <= 0) {
    throw new Error("Expense amount must be greater than zero");
  }

  return prisma.expense.create({
    data,
  });
}
