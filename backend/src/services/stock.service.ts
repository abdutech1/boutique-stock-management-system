import prisma from "../prismaClient.js";

export interface CreateStockInput {
  categoryId: number;      // main category
  priceCategoryId: number; // subcategory
  purchasePrice: number;
  quantity: number;
}

// Create new stock or update existing
export async function createOrUpdateStock({
  categoryId,
  priceCategoryId,
  purchasePrice,
  quantity,
}: CreateStockInput) {
  if (quantity <= 0) throw new Error("Quantity must be greater than zero");

  // Validate price category belongs to category
  const priceCategory = await prisma.pricecategory.findUnique({
    where: { id: priceCategoryId },
  });

  if (!priceCategory) throw new Error("Price category not found");
  if (priceCategory.categoryId !== categoryId)
    throw new Error("Price category does not belong to this main category");

  // Check if stock exists
  const existingStock = await prisma.stock.findUnique({
    where: { priceCategoryId },
  });

  if (existingStock) {
    return await prisma.stock.update({
      where: { priceCategoryId },
      data: {
        quantity: { increment: quantity },
        purchasePrice,
      },
    });
  }

  return await prisma.stock.create({
    data: { priceCategoryId, purchasePrice, quantity },
  });
}
