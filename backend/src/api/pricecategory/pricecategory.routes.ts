import express from "express";
import { getPriceCategories, createPriceCategory } from "./pricecategory.controller.js";

const router = express.Router();

// Get all subcategories for a category
router.get("/:categoryId", getPriceCategories);

// Create new subcategory
router.post("/", createPriceCategory);

export default router;

