import { Router } from "express";

import {
  getAllApplications,
  getApplication,
  createNewApplication,
  updateExistingApplication,
  deleteExistingApplication,
  getApplicationStats,
} from "../controllers/application.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken);

router.get("/stats", getApplicationStats);
router.get("/", getAllApplications);
router.get("/:id", getApplication);
router.post("/", createNewApplication);
router.put("/:id", updateExistingApplication);
router.delete("/:id", deleteExistingApplication);

export default router;