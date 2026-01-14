import { Request, Response } from "express";
import prisma from "../../prismaClient.js";

// Get all main categories
export async function getCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany();
  res.json(categories);
}

// Create or get existing main category
export async function createCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Category name is required");

    const category = await prisma.category.upsert({
      where: { name },
      update: {}, // do nothing if it exists
      create: { name },
    });

    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


