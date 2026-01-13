import { Router } from "express";
import { weeklyReport } from "./reports.controller.js";

const router = Router();

router.get("/weekly", weeklyReport);

export default router;
