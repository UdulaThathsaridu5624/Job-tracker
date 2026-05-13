import type { Status } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";


export async function getApplications(userId: string) {
    return prisma.application.findMany({
        where: { userId },
        orderBy: { appliedDate: "desc" },
    });

}
export async function getApplicationById(id: string, userId: string) {
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) throw new Error("Application not found");
  if (application.userId !== userId) throw new Error("Forbidden");
  return application;
}

export async function createApplication(userId: string, data: {
  jobTitle: string;
  company: string;
  location?: string;
  status?: Status;
  notes?: string;
  appliedDate: Date;
  followUpDate?: Date;
}) {
  return prisma.application.create({
    data: { userId, ...data },
  });
}
export async function updateApplication(id: string, userId: string, data: Partial<{
  jobTitle: string;
  company: string;
  location: string;
  status: Status;
  notes: string;
  appliedDate: Date;
  followUpDate: Date;
}>) {
  await getApplicationById(id, userId);
  return prisma.application.update({ where: { id }, data });
}

export async function deleteApplication(id: string, userId: string) {
  await getApplicationById(id, userId);
  return prisma.application.delete({ where: { id } });
}

export async function getStats(userId: string) {
  const applications = await prisma.application.findMany({ where: { userId } });

  const stats = {
    total: applications.length,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };

  for (const app of applications) {
    stats[app.status.toLowerCase() as keyof typeof stats]++;
  }

  return stats;
}