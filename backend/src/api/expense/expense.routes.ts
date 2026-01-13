import { Router } from "express";
import { addExpense } from "./expense.controller.js";

const router = Router();

router.post("/", addExpense);

export default router;
