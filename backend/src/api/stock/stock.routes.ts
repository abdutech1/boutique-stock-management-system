import express from "express";
import { registerStock } from "./stock.controller.js";

const router = express.Router();

/**
 * POST /api/stocks
 * (OWNER only – later with auth middleware)
 */
router.post("/", registerStock);

export default router;
