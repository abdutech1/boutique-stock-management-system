/// <reference types="node" />

import prisma from "../src/prismaClient.js";

async function main() {
  console.log("🌱 Seeding database...");

  /* =========================
     1️⃣ Categories
     ========================= */
  const shoe = await prisma.category.upsert({
    where: { name: "Shoe" },
    update: {},
    create: { name: "Shoe" },
  });

  const jacket = await prisma.category.upsert({
    where: { name: "Jacket" },
    update: {},
    create: { name: "Jacket" },
  });

  const tshirt = await prisma.category.upsert({
    where: { name: "T-Shirt" },
    update: {},
    create: { name: "T-Shirt" },
  });

  /* =========================
     2️⃣ Price Categories
     ========================= */
  const shoe3000 = await prisma.pricecategory.create({
    data: { fixedPrice: 3000, categoryId: shoe.id },
  });

  const jacket5000 = await prisma.pricecategory.create({
    data: { fixedPrice: 5000, categoryId: jacket.id },
  });

  const tshirt2000 = await prisma.pricecategory.create({
    data: { fixedPrice: 2000, categoryId: tshirt.id },
  });

  /* =========================
     3️⃣ Users
     ========================= */
  await prisma.user.upsert({
    where: { name: "Owner" },
    update: {},
    create: { name: "Owner", role: "OWNER" },
  });

  const employee1 = await prisma.user.upsert({
    where: { name: "Employee 1" },
    update: {},
    create: { name: "Employee 1", role: "EMPLOYEE" },
  });

  const employee2 = await prisma.user.upsert({
    where: { name: "Employee 2" },
    update: {},
    create: { name: "Employee 2", role: "EMPLOYEE" },
  });

  const employee3 = await prisma.user.upsert({
    where: { name: "Employee 3" },
    update: {},
    create: { name: "Employee 3", role: "EMPLOYEE" },
  });

  /* =========================
     4️⃣ Stock
     ========================= */
  await prisma.stock.createMany({
    data: [
      { priceCategoryId: shoe3000.id, purchasePrice: 2500, quantity: 10 },
      { priceCategoryId: jacket5000.id, purchasePrice: 4200, quantity: 5 },
      { priceCategoryId: tshirt2000.id, purchasePrice: 1500, quantity: 20 },
    ],
    skipDuplicates: true,
  });

  /* =========================
     5️⃣ Sales (MULTI EMPLOYEE)
     ========================= */
  await prisma.sale.createMany({
    data: [
      // Employee 1
      {
        employeeId: employee1.id,
        priceCategoryId: shoe3000.id,
        soldPrice: 3500,
        quantity: 2,
        bonus: 3500 * 2 - 3000 * 2,
      },

      // Employee 2
      {
        employeeId: employee2.id,
        priceCategoryId: jacket5000.id,
        soldPrice: 5200,
        quantity: 1,
        bonus: 5200 - 5000,
      },
      {
        employeeId: employee2.id,
        priceCategoryId: tshirt2000.id,
        soldPrice: 2300,
        quantity: 3,
        bonus: 2300 * 3 - 2000 * 3,
      },

      // Employee 3
      {
        employeeId: employee3.id,
        priceCategoryId: shoe3000.id,
        soldPrice: 3300,
        quantity: 1,
        bonus: 3300 - 3000,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeding completed successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
