import { Request, Response } from "express";
import { createSale } from "../../services/sale.service.js";

export async function createSaleController(req: Request, res: Response) {
  try {
    const { employeeId, priceCategoryId, soldPrice, quantity } = req.body;

    if (!employeeId || !priceCategoryId || !soldPrice || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await createSale({
      employeeId: Number(employeeId),
      priceCategoryId: Number(priceCategoryId),
      soldPrice: Number(soldPrice),
      quantity: Number(quantity),
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to create sale",
    });
  }
}
