import express from "express";
import { createSale } from "../services/saleService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { sellerId, priceCategoryId, soldPrice, quantity } = req.body;
    if (!sellerId || !priceCategoryId || !soldPrice || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sale = await createSale({ sellerId, priceCategoryId, soldPrice, quantity });
    res.status(201).json({ sale });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
