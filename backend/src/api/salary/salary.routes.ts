import { Router } from "express";
import { paySalary } from "./salary.controller.js";

const router = Router();

router.post("/", paySalary);

export default router;
