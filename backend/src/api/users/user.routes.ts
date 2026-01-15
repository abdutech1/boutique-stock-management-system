import { Router } from "express";
import {
  createEmployeeController,
  updateEmployeeController,
  deactivateEmployeeController,
  getEmployeesController,
  getEmployeeController,
} from "./user.controller.js";

import { authorize } from "../../middleware/authorize.js";

const router = Router();

// OWNER only
router.use(authorize("OWNER"));

router.post("/", createEmployeeController);            // Create
router.get("/", getEmployeesController);              // Get all
router.get("/:id", getEmployeeController);            // Get one
router.patch("/:id", updateEmployeeController);       // Update
router.delete("/:id", deactivateEmployeeController);  // Deactivate

export default router;
