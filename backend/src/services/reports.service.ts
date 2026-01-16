import prisma from "../prismaClient.js";


export type Period = {
  start: Date;
  end: Date;
};

export async function generateBusinessReport(
  period: Period,
  options?: {
    includeTopEmployees?: boolean;
    includeLowStock?: boolean;
    topEmployeesLimit?: number;
  }
) {
  const { includeTopEmployees = false, includeLowStock = false, topEmployeesLimit = 3 } = options || {};

  // 1️ Combined Data Fetching
  const [salesWithRelations, totalBonusAgg, totalSalaryAgg, totalExpensesAgg] = await Promise.all([
    prisma.sale.findMany({
      where: { createdAt: { gte: period.start, lte: period.end } },
      include: { pricecategory: { include: { stock: true } } },
    }),
    prisma.sale.aggregate({
      where: { createdAt: { gte: period.start, lte: period.end } },
      _sum: { bonus: true },
    }),
    prisma.salarypayment.aggregate({
      where: { createdAt: { gte: period.start, lte: period.end } },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { createdAt: { gte: period.start, lte: period.end } },
      _sum: { amount: true },
    }),
  ]);

  // 2️ Single-pass calculation for Revenue and Cost
  let totalRevenue = 0;
  let totalCost = 0;

  salesWithRelations.forEach((sale) => {
    totalRevenue += sale.soldPrice * sale.quantity;
    const purchasePrice = sale.pricecategory.stock?.purchasePrice ?? 0;
    totalCost += purchasePrice * sale.quantity;
  });

  const totalBonus = totalBonusAgg._sum.bonus ?? 0;
  const totalSalaryPaid = totalSalaryAgg._sum.amount ?? 0;
  const totalExpenses = totalExpensesAgg._sum.amount ?? 0;
  
  
  const profit = totalRevenue - totalCost - totalSalaryPaid - totalExpenses - totalBonus;

  // 3️ Top Employees (Optimized)
  let topEmployees: any[] = [];
  if (includeTopEmployees) {
    const employeeSalesGrouped = await prisma.sale.groupBy({
      by: ["employeeId"],
      _sum: { quantity: true, bonus: true },
      where: { createdAt: { gte: period.start, lte: period.end } },
    });

    const enrichedEmployees = await Promise.all(
      employeeSalesGrouped.map(async (g) => {
        const user = await prisma.user.findUnique({
          where: { id: g.employeeId },
          select: { name: true, role: true },
        });

        if (!user || user.role !== "EMPLOYEE") return null;

        const empRevenue = salesWithRelations
          .filter(s => s.employeeId === g.employeeId)
          .reduce((sum, s) => sum + s.soldPrice * s.quantity, 0);

        return {
          employeeId: g.employeeId,
          name: user.name,
          totalRevenue: empRevenue,
          totalQuantity: g._sum.quantity ?? 0,
          totalBonus: g._sum.bonus ?? 0,
        };
      })
    );

    topEmployees = enrichedEmployees
      .filter((emp): emp is NonNullable<typeof emp> => emp !== null)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, topEmployeesLimit);
  }

  // 4️ Low Stock Alerts (remains the same)
  let lowStock: any[] = [];
  if (includeLowStock) {
    const lowStockItems = await prisma.stock.findMany({
      where: { quantity: { lt: 3 } },
      include: { pricecategory: { include: { category: true } } },
    });
    lowStock = lowStockItems.map((s) => ({
      priceCategoryId: s.priceCategoryId,
      category: s.pricecategory.category.name,
      quantity: s.quantity,
    }));
  }

  return {
    period,
    totalRevenue,
    totalCost,
    totalBonus,
    totalSalaryPaid,
    totalExpenses,
    profit,
    ...(includeTopEmployees ? { topEmployees } : {}),
    ...(includeLowStock ? { lowStock } : {}),
  };
}




export interface SalesReportOptions {
  start: Date;
  end: Date;
  userId: number;
  role: "OWNER" | "EMPLOYEE";
}

export async function generateSalesReport({
  start,
  end,
  userId,
  role,
}: SalesReportOptions) {
  const whereClause: any = {
    status: "CONFIRMED",
    createdAt: {
      gte: start,
      lte: end,
    },
  };

  if (role === "EMPLOYEE") {
    whereClause.employeeId = userId;
  }

  const sales = await prisma.sale.findMany({
    where: whereClause,
    include: {
      user: { 
        select: { id: true, name: true },
      },
      pricecategory: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let totalRevenue = 0;
  let totalQuantity = 0;

  const formattedSales = sales.map((sale) => {
    // 1. Calculate revenue safely
    const revenue = (sale.soldPrice || 0) * (sale.quantity || 0);
    
    // 2. Accumulate totals
    totalRevenue += revenue;
    totalQuantity += sale.quantity || 0;


    // 3. Return object with fallbacks for relations
    return {
      saleId: sale.id,
      date: sale.createdAt,
      // Use optional chaining (?.) and Nullish Coalescing (??)
      employeeName: sale.user?.name ?? "Unknown Employee",
      category: sale.pricecategory?.category?.name ?? "Uncategorized",
      soldPrice: sale.soldPrice,
      quantity: sale.quantity,
      revenue,
    };
  });

  return {
    period: { start, end },
    totalSales: sales.length,
    totalQuantity,
    totalRevenue,
    sales: formattedSales,
  };
}


