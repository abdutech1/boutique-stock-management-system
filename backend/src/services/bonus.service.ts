import prisma from "../prismaClient.js";

export async function getWeeklyPerformanceSummary(
  weekStart: Date,
  weekEnd: Date
) {
  // Only CONFIRMED sales count
  const sales = await prisma.sale.findMany({
    where: {
      status: "CONFIRMED",
      createdAt: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    include: {
      user: true,
    },
  });

  const summaryMap = new Map<number, any>();

  for (const sale of sales) {
    const employeeId = sale.employeeId;

    if (!summaryMap.has(employeeId)) {
      summaryMap.set(employeeId, {
        employeeId,
        employeeName: sale.user.name,
        weeklyTotal: 0,
        maxSingleSale: 0,
        totalQuantity: 0,
      });
    }

    const summary = summaryMap.get(employeeId);
    summary.employeeRole = sale.user.role;

    const saleTotal = sale.soldPrice * sale.quantity;

    summary.weeklyTotal += saleTotal;
    summary.totalQuantity += sale.quantity;

    if (saleTotal > summary.maxSingleSale) {
      summary.maxSingleSale = saleTotal;
    }
  }

  return Array.from(summaryMap.values());
}







/**
 * Apply weekly bonuses to employees (exclude OWNER)
 */
export async function applyWeeklyBonus(weekStart: Date, weekEnd: Date) {
  // include full last day
  weekEnd.setHours(23, 59, 59, 999);

  const summary = await getWeeklyPerformanceSummary(weekStart, weekEnd);

  const rules = await prisma.bonusRule.findMany({
    where: { isActive: true },
  });

  const bonusesToCreate = [];

  for (const employee of summary) {
    // 🔹 Skip Owner
    if (employee.employeeRole === "OWNER" || employee.employeeRole === "ADMIN") continue;

    let bonus = 0;

    // SINGLE_CUSTOMER rules
    const singleSaleRules = rules.filter(r => r.type === "SINGLE_CUSTOMER");
    for (const r of singleSaleRules) {
      if (employee.maxSingleSale >= r.minAmount) {
        bonus = Math.max(bonus, r.bonusAmount);
      }
    }

    // WEEKLY_TOTAL rules
    const weeklyRules = rules.filter(r => r.type === "WEEKLY_TOTAL");
    for (const r of weeklyRules) {
      if (employee.weeklyTotal >= r.minAmount) {
        bonus = Math.max(bonus, r.bonusAmount);
      }
    }

    if (bonus > 0) {
      bonusesToCreate.push({
        userId: employee.employeeId,
        weekStart,
        weekEnd,
        amount: bonus,
      });
    }
  }

  const results = [];
  for (const b of bonusesToCreate) {
    const weeklyBonus = await prisma.weeklyBonus.upsert({
      where: {
        userId_weekStart_weekEnd: {
          userId: b.userId,
          weekStart: b.weekStart,
          weekEnd: b.weekEnd,
        },
      },
      update: { amount: b.amount },
      create: b,
    });
    results.push(weeklyBonus);
  }

  return results;
}







export async function getWeeklyBonuses(weekStart?: Date, weekEnd?: Date) {
  const where: any = {};

  if (weekStart) where.weekStart = { gte: weekStart };
  if (weekEnd) where.weekEnd = { lte: weekEnd };

  return prisma.weeklyBonus.findMany({
    where,
    include: { user: true },
    orderBy: { weekStart: "desc" },
  });
}


