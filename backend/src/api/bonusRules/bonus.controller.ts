import { Request, Response } from "express";
import {
  createBonusRule,
  getActiveBonusRules,
  deactivateBonusRule,
} from "../../services/bonusRule.service.js";

export async function createBonusRuleController(req: Request, res: Response) {
  try {
    const { type, minAmount, bonusAmount } = req.body;

    if (!type || !minAmount || !bonusAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const rule = await createBonusRule({
      type,
      minAmount: Number(minAmount),
      bonusAmount: Number(bonusAmount),
    });

    res.status(201).json(rule);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getActiveBonusRulesController(_: Request, res: Response) {
  const rules = await getActiveBonusRules();
  res.json(rules);
}

export async function deactivateBonusRuleController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const rule = await deactivateBonusRule(id);
    res.json(rule);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
