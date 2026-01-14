import express from "express";
import { createSaleController } from "./sale.controller.js";

const router = express.Router();

/**
 * POST /api/sales
 * EMPLOYEE
 */
router.post("/", createSaleController);

export default router;
