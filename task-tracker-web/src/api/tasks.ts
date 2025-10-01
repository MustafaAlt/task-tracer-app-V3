// src/api/tasks.ts
import api from "./client";

export type Task = {
  id?: number;
  title: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string | null; // "YYYY-MM-DD"
};

export async function listTasks() {
  const { data } = await api.get<Task[]>("/api/tasks");
  return data;
}

export async function createTask(t: Task) {
  const { data } = await api.post<Task>("/api/tasks", t);
  return data;
}

export async function updateTask(id: number, patch: Partial<Task>) {
  const { data } = await api.put<Task>(`/api/tasks/${id}`, patch);
  return data;
}

export async function deleteTask(id: number) {
  await api.delete(`/api/tasks/${id}`);
}
