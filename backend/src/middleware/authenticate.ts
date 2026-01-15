import { Request, Response, NextFunction } from "express";

export interface AuthUser {
  id: number;
  role: "OWNER" | "EMPLOYEE";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!userId || !role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = {
    id: Number(userId),
    role: role as AuthUser["role"],
  };

  next();
}
