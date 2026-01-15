import express from "express";
import { createSaleController, confirmSaleController } from "./sale.controller.js";
import { authorize } from "../../middleware/authorize.js";



const router = express.Router();

/**
 * POST /api/sales
 * EMPLOYEE
 */
router.post("/", createSaleController);
router.patch(
  "/:id/confirm",
  authorize("OWNER"),
  confirmSaleController
);


export default router;
