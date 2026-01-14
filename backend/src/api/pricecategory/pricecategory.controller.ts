import { Request, Response } from "express";
import prisma from "../../prismaClient.js";

// ============================
// Get all subcategories for a main category
// ============================
export async function getPriceCategories(req: Request, res: Response) {
  try {
    const categoryId = Number(req.params.categoryId);
    if (!categoryId) throw new Error("Category ID is required");

    const priceCategories = await prisma.pricecategory.findMany({
      where: { categoryId },
      include: { stock: true }, // include stock info
    });

    res.json(priceCategories);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

// ============================
// Create or get existing subcategory (price category)
// ============================
export async function createPriceCategory(req: Request, res: Response) {
  try {
    const { categoryId, fixedPrice } = req.body;
    if (!categoryId || !fixedPrice) throw new Error("Missing fields");

    // First, check if subcategory already exists for this category
    const existing = await prisma.pricecategory.findFirst({
      where: { categoryId, fixedPrice },
    });

    if (existing) return res.status(200).json(existing);

    // Create new subcategory
    const newPriceCategory = await prisma.pricecategory.create({
      data: { categoryId, fixedPrice },
    });

    res.status(201).json(newPriceCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
