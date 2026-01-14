import express from "express";
import { registerStock,getStockBySubcategory } from "./stock.controller.js";

const router = express.Router();

router.post("/", registerStock);
router.get("/subcategory/:priceCategoryId", getStockBySubcategory);

export default router;
