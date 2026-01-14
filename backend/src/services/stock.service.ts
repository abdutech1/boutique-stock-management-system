import prisma from "../prismaClient.js";

interface CreateStockInput {
  priceCategoryId: number;
  purchasePrice: number;
  quantity: number;
}

export async function createStock({
  priceCategoryId,
  purchasePrice,
  quantity,
}: CreateStockInput) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  const priceCategory = await prisma.pricecategory.findUnique({
    where: { id: priceCategoryId },
  });

  if (!priceCategory) {
    throw new Error("Price category not found");
  }

  const existingStock = await prisma.stock.findUnique({
    where: { priceCategoryId },
  });

  if (existingStock) {
    throw new Error("Stock already exists for this price category");
  }

  return prisma.stock.create({
    data: {
      priceCategoryId,
      purchasePrice,
      quantity,
    },
  });
}
