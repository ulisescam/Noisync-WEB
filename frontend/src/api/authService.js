import { api } from "./api.js";

export async function loginRequest(identifier, password) {
  const res = await api.post("/api/auth/login", { identifier, password });
  return res.data; 
}
export async function registerRequest(data) {
  const res = await api.post("/api/auth/register-leader", data);
  return res.data;
}

export function saveSession(data) {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  localStorage.setItem("userId", String(data.userId));
  localStorage.setItem("bandId", String(data.bandId));
  localStorage.setItem("role", data.role);

  // opcional pero útil para tu flujo
  localStorage.setItem("mustChangePassword", String(data.mustChangePassword));
}

export function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  localStorage.removeItem("userId");
  localStorage.removeItem("bandId");
  localStorage.removeItem("role");

  localStorage.removeItem("mustChangePassword");
}

export function getSession() {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),

    userId: localStorage.getItem("userId"),
    bandId: localStorage.getItem("bandId"),
    role: localStorage.getItem("role"),

    mustChangePassword: localStorage.getItem("mustChangePassword") === "true",
  };
}