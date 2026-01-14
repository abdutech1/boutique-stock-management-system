import { Request, Response } from "express";
import prisma from "../../prismaClient.js";
import { createOrUpdateStock } from "../../services/stock.service.js";

export async function registerStock(req: Request, res: Response) {
  try {
    const { categoryId, priceCategoryId, purchasePrice, quantity } = req.body;

    const stock = await createOrUpdateStock({
      categoryId: Number(categoryId),
      priceCategoryId: Number(priceCategoryId),
      purchasePrice: Number(purchasePrice),
      quantity: Number(quantity),
    });

    res.status(201).json({
      message: "Stock registered/updated successfully",
      stock,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}



export async function getStockBySubcategory(req: Request, res: Response) {
  try {
    const priceCategoryId = Number(req.params.priceCategoryId);

    const stock = await prisma.stock.findUnique({
      where: { priceCategoryId },
      include: { pricecategory: true }, // include subcategory info
    });

    if (!stock) return res.status(404).json({ message: "Stock not found" });

    res.json(stock);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}