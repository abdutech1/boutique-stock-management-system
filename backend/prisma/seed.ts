/// <reference types="node" />


import prisma from '../src/prismaClient.js';


async function main() {
  console.log("🌱 Seeding database...");

  // 1️ Categories
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

  // 2️⃣ Price Categories (linked to Category)
  const shoe3000 = await prisma.pricecategory.create({
    data: {
      fixedPrice: 3000,
      categoryId: shoe.id,
    },
  });

  const jacket5000 = await prisma.pricecategory.create({
    data: {
      fixedPrice: 5000,
      categoryId: jacket.id,
    },
  });

  const tshirt2000 = await prisma.pricecategory.create({
    data: {
      fixedPrice: 2000,
      categoryId: tshirt.id,
    },
  });

  // 3️⃣ Users
  await prisma.user.upsert({
    where: { name: "Owner" },
    update: {},
    create: {
      name: "Owner",
      role: "OWNER",
    },
  });

  const employee = await prisma.user.upsert({
    where: { name: "Employee 1" },
    update: {},
    create: {
      name: "Employee 1",
      role: "EMPLOYEE",
    },
  });

  // 4️⃣ Stock (1–1 with pricecategory)
  await prisma.stock.createMany({
    data: [
      {
        priceCategoryId: shoe3000.id,
        purchasePrice: 2500,
        quantity: 10,
      },
      {
        priceCategoryId: jacket5000.id,
        purchasePrice: 4200,
        quantity: 5,
      },
      {
        priceCategoryId: tshirt2000.id,
        purchasePrice: 1500,
        quantity: 20,
      },
    ],
    skipDuplicates: true,
  });

   // 5️⃣ Sales
  await prisma.sale.createMany({
    data: [
      {
        employeeId: employee.id, // Employee 1
        priceCategoryId: shoe3000.id,
        soldPrice: 3500,
        quantity: 2,
        bonus: 3500 - 3000 * 2, // or let your logic calculate it
      },
      {
        employeeId: employee.id,
        priceCategoryId: jacket5000.id,
        soldPrice: 4800,
        quantity: 1,
        bonus: 4800 - 5000, // negative bonus example
      },
    ],
    skipDuplicates: true,
  });


  console.log("✅ Seeding completed successfully");
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
