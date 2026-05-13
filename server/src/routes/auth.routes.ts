import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

export default router;