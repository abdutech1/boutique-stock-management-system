import prisma from "../prismaClient.js";

export interface CreateBonusRuleInput {
  type: "WEEKLY_TOTAL" | "SINGLE_CUSTOMER";
  minAmount: number;
  bonusAmount: number;
}

export async function createBonusRule(data: CreateBonusRuleInput) {
  return prisma.bonusRule.create({
    data,
  });
}

export async function getActiveBonusRules() {
  return prisma.bonusRule.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function deactivateBonusRule(id: number) {
  return prisma.bonusRule.update({
    where: { id },
    data: { isActive: false },
  });
}
