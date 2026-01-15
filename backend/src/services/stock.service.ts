import prisma from "../prismaClient.js";

export interface CreateStockInput {
  priceCategoryId: number;
  purchasePrice: number;
  quantity: number;
}

export async function createOrUpdateStock({
  priceCategoryId,
  purchasePrice,
  quantity,
}: CreateStockInput) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  // 1. Check price category exists
  const priceCategory = await prisma.pricecategory.findUnique({
    where: { id: priceCategoryId },
  });

  if (!priceCategory) {
    throw new Error("Price category not found");
  }

  // 2. Check if stock already exists
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

  // 3. Create new stock
  return await prisma.stock.create({
    data: {
      priceCategoryId,
      purchasePrice,
      quantity,
    },
  });
}
