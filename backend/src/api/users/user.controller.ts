import { Request, Response } from "express";
import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployees,
  getEmployeeById,
} from "../../services/user.service.js";

// Create new employee
export async function createEmployeeController(req: Request, res: Response) {
  try {
    const { name, phoneNumber, baseSalary, role } = req.body;
    const employee = await createEmployee({ name, phoneNumber, baseSalary, role });
    res.status(201).json(employee);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

// Update employee
export async function updateEmployeeController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    const employee = await updateEmployee(id, updates);
    res.json(employee);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

// Deactivate employee
export async function deactivateEmployeeController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const employee = await deactivateEmployee(id);
    res.json({ message: "Employee deactivated", employee });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

// Get all employees
export async function getEmployeesController(req: Request, res: Response) {
  try {
    const employees = await getEmployees();
    res.json(employees);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

// Get single employee
export async function getEmployeeController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const employee = await getEmployeeById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
