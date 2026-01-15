import { Request, Response, NextFunction } from "express";

export function authorize(...allowedRoles: Array<"OWNER" | "EMPLOYEE">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
