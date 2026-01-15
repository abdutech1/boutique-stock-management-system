import prisma from "../prismaClient.js";
import { UserRole } from "../generated/prisma/enums.js";

export interface CreateEmployeeInput {
  name: string;
  phoneNumber: string;
  baseSalary?: number;
  role?: UserRole; // optional, default EMPLOYEE
}

export interface UpdateEmployeeInput {
  name?: string;
  phoneNumber?: string;
  baseSalary?: number;
  role?: UserRole;
  isActive?: boolean;
}

// Create employee
export async function createEmployee(data: CreateEmployeeInput) {
  return await prisma.user.create({
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      baseSalary: data.baseSalary ?? 0,
      role: data.role ?? "EMPLOYEE",
    },
  });
}

// Update employee
export async function updateEmployee(id: number, data: UpdateEmployeeInput) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

// Soft-delete employee
export async function deactivateEmployee(id: number) {
  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}

// Get all employees (optionally filter active)
export async function getEmployees(activeOnly = true) {
  return await prisma.user.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { createdAt: "desc" },
  });
}

// Get single employee by ID
export async function getEmployeeById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}
