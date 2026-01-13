import prisma from "../prismaClient.js";

type Period = {
  start: Date;
  end: Date;
};

export async function generateReport(period: Period) {
  // 1️ Revenue
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: period.start,
        lte: period.end,
      },
    },
    select: {
      soldPrice: true,
      quantity: true,
    },
  });

  const totalRevenue = sales.reduce(
    (sum, s) => sum + s.soldPrice * s.quantity,
    0
  );

  // 2️ Bonus
  const totalBonus = await prisma.sale.aggregate({
    where: {
      createdAt: {
        gte: period.start,
        lte: period.end,
      },
    },
    _sum: {
      bonus: true,
    },
  });

  // 3️ Salaries
  const totalSalaryPaid = await prisma.salarypayment.aggregate({
    where: {
      createdAt: {
        gte: period.start,
        lte: period.end,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // 4️ Expenses
  const totalExpenses = await prisma.expense.aggregate({
    where: {
      createdAt: {
        gte: period.start,
        lte: period.end,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // 5️ Cost of goods
  const salesWithCost = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: period.start,
        lte: period.end,
      },
    },
    include: {
      pricecategory: {
        include: {
          stock: true,
        },
      },
    },
  });

  const totalCost = salesWithCost.reduce((sum, sale) => {
    const purchasePrice =
      sale.pricecategory.stock?.purchasePrice ?? 0;
    return sum + purchasePrice * sale.quantity;
  }, 0);

  // 6️ Profit
  const profit =
  totalRevenue -
  totalCost -
  (totalSalaryPaid._sum.amount ?? 0) -
  (totalExpenses._sum.amount ?? 0) +
  (totalBonus._sum.bonus ?? 0);

  return {
    period,
    totalRevenue,
    totalCost,
    totalBonus: totalBonus._sum.bonus ?? 0,
    totalSalaryPaid: totalSalaryPaid._sum.amount ?? 0,
    totalExpenses: totalExpenses._sum.amount ?? 0,
    profit,
  };
}
