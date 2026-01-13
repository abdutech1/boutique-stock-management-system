import prisma from "../prismaClient.js";

type CreateSalaryPaymentInput = {
  userId: number;
  amount: number;
  weekStart: Date;
  weekEnd: Date;
};

export async function createSalaryPayment(data: CreateSalaryPaymentInput) {
  if (data.amount <= 0) {
    throw new Error("Salary amount must be greater than zero");
  }

  return prisma.salarypayment.create({
    data,
  });
}
