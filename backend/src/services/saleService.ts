import prisma from "../prismaClient.js";

interface CreateSaleData {
  sellerId: number;
  priceCategoryId: number;
  soldPrice: number;
  quantity: number;
}

export async function createSale(data: CreateSaleData) {
  return prisma.$transaction(async (tx) => {
    // 1️ Get price category
    const priceCategory = await tx.priceCategory.findUnique({
      where: { id: data.priceCategoryId },
      include: { stock: true },
    });
    if (!priceCategory) throw new Error("Price category not found");

    const stock = priceCategory.stock;
    if (!stock) throw new Error("Stock not found for this price category");

    // 2️ Check stock
    if (stock.quantity < data.quantity) {
      throw new Error("Insufficient stock");
    }

    // 3️ Calculate bonus
    const bonus = Math.max(0, data.soldPrice - priceCategory.fixedPrice);

    // 4️ Create Sale
    const sale = await tx.sale.create({
      data: {
        soldPrice: data.soldPrice,
        quantity: data.quantity,
        bonus,
        employeeId: data.sellerId,
        priceCategoryId: data.priceCategoryId,
      },
    });

    // 5️ Deduct stock
    const updatedStock = await tx.stock.update({
      where: { id: stock.id },
      data: {
        quantity: { decrement: data.quantity },
      },
    });

    // 6️ Low stock alert
    if (updatedStock.quantity < 3) {
      console.log(`⚠️ Low stock alert for priceCategoryId ${priceCategory.id}`);
    }

    return sale;
  });
}
