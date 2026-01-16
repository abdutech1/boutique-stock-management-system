import { Request, Response } from "express";
import { createSale,confirmSale,updateDraftSale } from "../../services/sale.service.js";

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



export async function updateSaleController(req: Request, res: Response) {
  try {
    const saleId = Number(req.params.id);
    if (!Number.isInteger(saleId) || saleId <= 0) {
      return res.status(400).json({ error: 'Invalid sale ID' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { soldPrice, quantity } = req.body;

    // Optional: basic type checking
    if (soldPrice !== undefined && (typeof soldPrice !== 'number' || soldPrice <= 0)) {
      return res.status(400).json({ error: 'Invalid sold price' });
    }
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity <= 0)) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const updatedSale = await updateDraftSale({
      saleId,
      userId: req.user.id,
      role: req.user.role,
      soldPrice,
      quantity,
    });

    res.status(200).json({
      message: 'Sale updated successfully',
      data: updatedSale,
    });
  } catch (error: any) {
    console.error(error);
    const status = error.message?.includes('not found') ? 404 : 400;
    res.status(status).json({ error: error.message || 'Failed to update sale' });
  }
}