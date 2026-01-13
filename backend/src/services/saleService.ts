import prisma from "../prismaClient.js";

interface CreateSaleInput {
  employeeId: number;
  priceCategoryId: number;
  soldPrice: number;
  quantity: number;
}


export async function createSale({
  employeeId,
  priceCategoryId,
  soldPrice,
  quantity,
}: CreateSaleInput) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }

  return await prisma.$transaction(async (tx) => {
    // 1️ Get price category with stock
    const priceCategory = await tx.pricecategory.findUnique({
      where: { id: priceCategoryId },
      include: { stock: true },
    });

    if (!priceCategory) {
      throw new Error('Price category not found');
    }

    if (!priceCategory.stock) {
      throw new Error('Stock not initialized for this price category');
    }

    // 2️ Check stock availability
    if (priceCategory.stock.quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    // 3️ Calculate bonus
    const bonusPerItem = soldPrice - priceCategory.fixedPrice;
    const totalBonus = bonusPerItem * quantity;

    // 4️ Create sale
    const sale = await tx.sale.create({
      data: {
        employeeId,
        priceCategoryId,
        soldPrice,
        quantity,
        bonus: totalBonus,
      },
    });

    // 5️ Deduct stock
    const updatedStock = await tx.stock.update({
      where: { priceCategoryId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    // 6️ Low-stock warning
    const lowStockWarning =
      updatedStock.quantity < 3
        ? `⚠️ Low stock alert: only ${updatedStock.quantity} left`
        : null;

    return {
      sale,
      remainingStock: updatedStock.quantity,
      lowStockWarning,
    };
  });
}
