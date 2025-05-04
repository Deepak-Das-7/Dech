// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "No token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};
