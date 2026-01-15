import prisma from "../prismaClient.js";

type CreateSalaryPaymentInput = {
  userId: number;
  amount: number;
  weekStart: Date;
  weekEnd: Date;
};

// export async function createSalaryPayment(data: CreateSalaryPaymentInput) {
//   if (data.amount <= 0) {
//     throw new Error("Salary amount must be greater than zero");
//   }

//   return prisma.salarypayment.create({
//     data,
//   });
// }

// =============================
// NEW: Generate salary report with bonuses
// =============================



/**
 * Pay salary for a user for a given week
 * - Prevents paying OWNER
 * - Prevents duplicates using UPSERT
 * - Validates user existence
 */
export async function createSalaryPayment(data: CreateSalaryPaymentInput) {
  // 1️⃣ Validate amount
  if (data.amount <= 0) {
    throw new Error("Salary amount must be greater than zero");
  }

  // 2️⃣ Validate user exists
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) throw new Error("User not found");

  // 3️⃣ Prevent paying salary to OWNER
  if (user.role === "OWNER") {
    throw new Error("Cannot pay salary to owner");
  }

  // 4️⃣ UPSERT: create or update existing salary for the week
  const weeklySalary = await prisma.salarypayment.upsert({
    where: {
      userId_weekStart_weekEnd: {
        userId: data.userId,
        weekStart: data.weekStart,
        weekEnd: data.weekEnd,
      },
    },
    update: { amount: data.amount },
    create: data,
  });

  return weeklySalary;
}

/**
 * Optional: Fetch all salary payments (OWNER only)
 */
export async function getAllSalaries() {
  return prisma.salarypayment.findMany({
    include: { user: true },
    orderBy: { weekStart: "desc" },
  });
}




export interface SalaryReportInput {
  weekStart?: Date;
  weekEnd?: Date;
}

// export async function generateSalaryReport({
//   weekStart,
//   weekEnd,
// }: SalaryReportInput) {
//   // 1️⃣ Fetch all active EMPLOYEES
//   const employees = await prisma.user.findMany({
//     where: { isActive: true, role: "EMPLOYEE" },
//   });

//   // 2️⃣ Fetch weekly bonuses in the period
//   const bonusWhere: any = {};
//   if (weekStart) bonusWhere.weekStart = { gte: weekStart };
//   if (weekEnd) bonusWhere.weekEnd = { lte: weekEnd };

//   const bonuses = await prisma.weeklyBonus.findMany({
//     where: bonusWhere,
//     include: { user: true },
//   });

//   // 3️⃣ Build salary report per employee
//   const report = employees.map((emp) => {
//     const baseSalary = emp.baseSalary || 0;

//     const empBonuses = bonuses
//       .filter((b) => b.userId === emp.id)
//       .reduce((sum, b) => sum + b.amount, 0);

//     return {
//       employeeId: emp.id,
//       employeeName: emp.name,
//       baseSalary,
//       totalBonus: empBonuses,
//       totalSalary: baseSalary + empBonuses,
//       bonuses: bonuses
//         .filter((b) => b.userId === emp.id)
//         .map((b) => ({
//           weekStart: b.weekStart,
//           weekEnd: b.weekEnd,
//           amount: b.amount,
//         })),
//     };
//   });

//   return report;
// }


export async function generateSalaryReport({ weekStart, weekEnd }: SalaryReportInput) {
  const employees = await prisma.user.findMany({
    where: { isActive: true, role: "EMPLOYEE" },
  });

  const bonusWhere: any = {};
  if (weekStart) bonusWhere.weekEnd = { gte: weekStart };
  if (weekEnd) bonusWhere.weekStart = { lte: weekEnd };

  const bonuses = await prisma.weeklyBonus.findMany({
    where: bonusWhere,
    include: { user: true },
  });

  const report = employees.map((emp) => {
    const baseSalary = emp.baseSalary || 0;

    const empBonuses = bonuses
      .filter((b) => b.userId === emp.id)
      .reduce((sum, b) => sum + b.amount, 0);

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      baseSalary,
      totalBonus: empBonuses,
      totalSalary: baseSalary + empBonuses,
      bonuses: bonuses
        .filter((b) => b.userId === emp.id)
        .map((b) => ({
          weekStart: b.weekStart,
          weekEnd: b.weekEnd,
          amount: b.amount,
        })),
    };
  });

  return report;
}

