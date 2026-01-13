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


// Employee Performance

export async function employeePerformance(period: {
  start: Date;
  end: Date;
}) {
  // 1️⃣ Group sales by employee
  const grouped = await prisma.sale.groupBy({
    by: ['employeeId'],
    where: {
      createdAt: {
        gte: period.start,
        lte: period.end,
      },
    },
    _sum: {
      quantity: true,
      bonus: true,
    },
  });

  // 2️⃣ Enrich with user info & revenue
  const enriched = await Promise.all(
    grouped.map(async (g) => {
      const user = await prisma.user.findUnique({
        where: { id: g.employeeId },
        select: {
          name: true,
          role: true,
        },
      });

      // ⛔ FILTER OUT NON-EMPLOYEES
      if (user?.role !== 'EMPLOYEE') {
        return null;
      }

      const sales = await prisma.sale.findMany({
        where: {
          employeeId: g.employeeId,
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

      const totalQuantity = g._sum.quantity ?? 0;

      return {
        employeeId: g.employeeId,
        name: user.name,
        role: user.role,
        totalQuantity,
        totalRevenue,
        totalBonus: g._sum.bonus ?? 0,
        averagePrice:
          totalQuantity > 0
            ? Math.round(totalRevenue / totalQuantity)
            : 0,
      };
    })
  );

  // ✅ REMOVE NULL ENTRIES + SORT + ADD RANK
 return enriched
  .filter((emp): emp is NonNullable<typeof emp> => Boolean(emp))
  .sort((a, b) => b.totalRevenue - a.totalRevenue)
  .map((emp, index) => ({
    rank: index + 1,
    ...emp,
  }));
}



