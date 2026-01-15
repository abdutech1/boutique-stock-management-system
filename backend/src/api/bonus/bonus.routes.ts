import express from "express";
import { getWeeklySummaryController,applyWeeklyBonusController,getWeeklyBonusesController } from "./bonus.controller.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

// OWNER only
router.get("/weekly-summary", authorize("OWNER"), getWeeklySummaryController);
router.post("/apply-weekly", authorize("OWNER"), applyWeeklyBonusController);
// OWNER only
router.get("/", authorize("OWNER"), getWeeklyBonusesController);



export default router;
