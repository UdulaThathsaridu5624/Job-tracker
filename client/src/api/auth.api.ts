import api from "./axios";

export async function registerUser(data: { name: string; email: string; password: string }) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await api.post("/auth/login", data);
  return res.data;
}
