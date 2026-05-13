import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1]!;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

