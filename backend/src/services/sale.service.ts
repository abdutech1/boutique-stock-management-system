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



interface UpdateSaleInput {
  saleId: number;
  userId: number;
  role: "OWNER" | "EMPLOYEE";
  soldPrice?: number;
  quantity?: number;
}

export async function updateDraftSale({
  saleId,
  userId,
  role,
  soldPrice,
  quantity,
}: UpdateSaleInput) {
  return await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id: saleId },
      include: {
        pricecategory: {
          include: { stock: true },
        },
      },
    });

    if (!sale) {
      throw new Error("Sale not found");
    }

    if (sale.status !== "DRAFT") {
      throw new Error("Only DRAFT sales can be edited");
    }

    // Permission check
    if (role === "EMPLOYEE" && sale.employeeId !== userId) {
      throw new Error("You can only edit your own draft sales");
    }

    // ── Quantity change handling ────────────────────────────────
    if (quantity !== undefined) {
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
      }

      const diff = quantity - sale.quantity; // positive = need more, negative = returning stock

      // Safety check: make sure we have pricecategory & stock info
      if (!sale.pricecategory?.stock) {
        throw new Error("Cannot update quantity: stock information is missing");
      }

      if (diff > 0 && sale.pricecategory.stock.quantity < diff) {
        throw new Error("Insufficient stock");
      }

      // Only update stock if there's an actual change
      if (diff !== 0) {
        await tx.stock.update({
          where: { priceCategoryId: sale.priceCategoryId }, // ← fixed field name
          data: {
            quantity: {
              increment: -diff, // if diff > 0 → decrement stock, if diff < 0 → increment stock
            },
          },
        });
      }
    }

    // ── Final update ─────────────────────────────────────────────
    return await tx.sale.update({
      where: { id: saleId },
      data: {
        soldPrice: soldPrice ?? sale.soldPrice,
        quantity: quantity ?? sale.quantity,
        // Optional: update timestamp manually if you want
        // updatedAt: new Date(),
      },
    });
  });
}



interface DeleteDraftSaleInput {
  saleId: number;
  userId: number;
  role: "OWNER" | "EMPLOYEE";
}

export async function deleteDraftSale({
  saleId,
  userId,
  role,
}: DeleteDraftSaleInput) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id: saleId },
      include: {
        pricecategory: {
          include: { stock: true },
        },
      },
    });

    if (!sale) {
      throw new Error("Sale not found");
    }

    if (sale.status !== "DRAFT") {
      throw new Error("Only DRAFT sales can be deleted");
    }

    if (role === "EMPLOYEE" && sale.employeeId !== userId) {
      throw new Error("You can only delete your own draft sales");
    }

    if (!sale.pricecategory?.stock) {
      throw new Error("Stock information missing");
    }

    // 1️⃣ Return stock
    await tx.stock.update({
      where: { priceCategoryId: sale.priceCategoryId },
      data: {
        quantity: {
          increment: sale.quantity,
        },
      },
    });

    // 2️⃣ Delete sale
    await tx.sale.delete({
      where: { id: saleId },
    });

    return { message: "Draft sale deleted successfully" };
  });
}

