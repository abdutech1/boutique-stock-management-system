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
    throw new Error("Quantity must be greater than zero");
  }

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Get price category with stock
    const priceCategory = await tx.pricecategory.findUnique({
      where: { id: priceCategoryId },
      include: { stock: true },
    });

    if (!priceCategory) {
      throw new Error("Price category not found");
    }

    if (!priceCategory.stock) {
      throw new Error("Stock not initialized for this price category");
    }

    // 2️⃣ Check stock availability
    if (priceCategory.stock.quantity < quantity) {
      throw new Error("Insufficient stock");
    }

    // 3️⃣ Create sale (NO BONUS YET)
    const sale = await tx.sale.create({
      data: {
        employeeId,
        priceCategoryId,
        soldPrice,
        quantity,
        bonus: 0,                 // ✅ bonus assigned later
        status: "DRAFT",          // ✅ owner confirms later
      },
    });

    // 4️⃣ Deduct stock
    const updatedStock = await tx.stock.update({
      where: { priceCategoryId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    // 5️⃣ Low-stock warning
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


export async function confirmSale(saleId: number) {
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
  });

  if (!sale) {
    throw new Error("Sale not found");
  }

  if (sale.status !== "DRAFT") {
    throw new Error("Only DRAFT sales can be confirmed");
  }

  return await prisma.sale.update({
    where: { id: saleId },
    data: {
      status: "CONFIRMED",
    },
  });
}
