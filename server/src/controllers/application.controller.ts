import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getStats,
} from "../services/application.service.js";

export async function getAllApplications(req: AuthRequest, res: Response) {
  try {
    const applications = await getApplications(req.userId!);
    res.json({ applications });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getApplication(req: AuthRequest, res: Response) {
  try {
    const application = await getApplicationById(req.params.id as string, req.userId!);
    res.json({ application });
  } catch (err: any) {
    const status = err.message === "Forbidden" ? 403 : 404;
    res.status(status).json({ error: err.message });
  }
}

export async function createNewApplication(req: AuthRequest, res: Response) {
  try {
    const application = await createApplication(req.userId!, {
      ...req.body,
      appliedDate: new Date(req.body.appliedDate),
      followUpDate: req.body.followUpDate ? new Date(req.body.followUpDate) : undefined,
    });
    res.status(201).json({ application });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateExistingApplication(req: AuthRequest, res: Response) {
  try {
    const application = await updateApplication(req.params.id as string, req.userId!, {
      ...req.body,
      appliedDate: req.body.appliedDate ? new Date(req.body.appliedDate) : undefined,
      followUpDate: req.body.followUpDate ? new Date(req.body.followUpDate) : undefined,
    });
    res.json({ application });
  } catch (err: any) {
    const status = err.message === "Forbidden" ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
}

export async function deleteExistingApplication(req: AuthRequest, res: Response) {
  try {
    await deleteApplication(req.params.id as string, req.userId!);
    res.json({ message: "Application deleted" });
  } catch (err: any) {
    const status = err.message === "Forbidden" ? 403 : 404;
    res.status(status).json({ error: err.message });
  }
}

export async function getApplicationStats(req: AuthRequest, res: Response) {
  try {
    const stats = await getStats(req.userId!);
    res.json({ stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
