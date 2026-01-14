import { Request, Response } from "express";
import { createStock } from "../../services/stock.service.js";

export async function registerStock(req: Request, res: Response) {
  try {
    const { priceCategoryId, purchasePrice, quantity } = req.body;

    const stock = await createStock({
      priceCategoryId: Number(priceCategoryId),
      purchasePrice: Number(purchasePrice),
      quantity: Number(quantity),
    });

    res.status(201).json({
      message: "Stock registered successfully",
      stock,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to register stock",
    });
  }
}
