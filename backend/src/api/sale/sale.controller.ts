import { Request, Response } from "express";
import { createSale,confirmSale } from "../../services/sale.service.js";

export async function createSaleController(req: Request, res: Response) {
  try {
    const { priceCategoryId, soldPrice, quantity } = req.body;

    if (!priceCategoryId || !soldPrice || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔐 employeeId comes from authenticated user
    const employeeId = req.user!.id;

    const result = await createSale({
      employeeId,
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


export async function confirmSaleController(req: Request, res: Response) {
  try {
    const saleId = Number(req.params.id);

    const sale = await confirmSale(saleId);

    res.json({
      message: "Sale confirmed successfully",
      sale,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

