import { Request, Response } from "express";
import prisma from "../../prismaClient.js";
import { UserRole } from "../../generated/prisma/enums.js"; // ← your enums file

// ...

import {
  getWeeklyPerformanceSummary,
  applyWeeklyBonus,
  getWeeklyBonuses,
} from "../../services/bonus.service.js";

export async function getWeeklySummaryController(req: Request, res: Response) {
  try {
    const { weekStart, weekEnd } = req.query;

    if (!weekStart || !weekEnd) {
      return res.status(400).json({
        message: "weekStart and weekEnd are required",
      });
    }

    const summary = await getWeeklyPerformanceSummary(
      new Date(String(weekStart)),
      new Date(String(weekEnd))
    );

    res.json(summary);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function applyWeeklyBonusController(req: Request, res: Response) {
  try {
    const { weekStart, weekEnd } = req.body;

    if (!weekStart || !weekEnd) {
      return res
        .status(400)
        .json({ message: "weekStart and weekEnd required" });
    }

    const bonuses = await applyWeeklyBonus(
      new Date(String(weekStart)),
      new Date(String(weekEnd))
    );

    res.json({ message: "Weekly bonus applied", bonuses });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getWeeklyBonusesController(req: Request, res: Response) {
  try {
    const { weekStart, weekEnd } = req.query;

    const where: any = {};
    if (weekStart) where.weekStart = { gte: new Date(String(weekStart)) };
    if (weekEnd) where.weekEnd = { lte: new Date(String(weekEnd)) };

    // Fetch bonuses with user info
    const bonuses = await prisma.weeklyBonus.findMany({
      where,
      include: { user: true },
      orderBy: { weekStart: "desc" },
    });

    // Filter out OWNER and ADMIN roles
    const filtered = bonuses.filter((b) => b.user.role === UserRole.EMPLOYEE);

    res.json(filtered);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
