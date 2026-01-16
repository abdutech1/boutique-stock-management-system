import express from "express";
import { createSaleController, confirmSaleController } from "./sale.controller.js";
import { authorize } from "../../middleware/authorize.js";
import { updateSaleController } from "./sale.controller.js";






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
router.patch(
  "/:id",
  authorize("OWNER", "EMPLOYEE"),
  updateSaleController
);


export default router;
