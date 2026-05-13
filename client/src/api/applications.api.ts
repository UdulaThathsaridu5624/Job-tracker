import api from "./axios";

export async function getApplications() {
  const res = await api.get("/applications");
  return res.data.applications;
}

export async function getApplication(id: string) {
  const res = await api.get(`/applications/${id}`);
  return res.data.application;
}

export async function createApplication(data: unknown) {
  const res = await api.post("/applications", data);
  return res.data.application;
}

export async function updateApplication(id: string, data: unknown) {
  const res = await api.put(`/applications/${id}`, data);
  return res.data.application;
}

export async function deleteApplication(id: string) {
  const res = await api.delete(`/applications/${id}`);
  return res.data;
}

export async function getStats() {
  const res = await api.get("/applications/stats");
  return res.data.stats;
}
