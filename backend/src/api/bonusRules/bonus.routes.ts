import express from "express";
import {
  createBonusRuleController,
  getActiveBonusRulesController,
  deactivateBonusRuleController,
} from "./bonus.controller.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

// OWNER only
router.post("/", authorize("OWNER"), createBonusRuleController);
router.get("/", authorize("OWNER"), getActiveBonusRulesController);
router.patch("/:id/deactivate", authorize("OWNER"), deactivateBonusRuleController);

export default router;
