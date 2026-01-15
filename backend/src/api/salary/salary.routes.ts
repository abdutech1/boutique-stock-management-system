import express from "express";
import { paySalary, getSalaryReport,getSalaries } from "./salary.controller.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

// OWNER only
router.post("/", authorize("OWNER"), paySalary);           // manual pay
router.get("/report", authorize("OWNER"), getSalaryReport); // report
router.get("/", authorize("OWNER"), getSalaries);         // all payments


export default router;

