import api from "./client";

export async function register(username: string, password: string) {
  const { data } = await api.post("/api/auth/register", { username, password });
  return data as { token: string };
}

export async function login(username: string, password: string) {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data as { token: string };
}
