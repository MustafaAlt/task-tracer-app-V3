// src/api/auth.ts
import api from "./client";

export async function register(username: string, password: string) {
  const { data } = await api.post("/api/auth/register", { username, password });
  // { accessToken, refreshToken } bekleniyor
  return data as { accessToken: string; refreshToken: string };
}

export async function login(username: string, password: string) {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data as { accessToken: string; refreshToken: string };
}
