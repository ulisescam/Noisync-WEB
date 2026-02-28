import { api } from "./api.js";

export async function loginRequest(identifier, password) {
    const res = await api.post("/api/auth/login", { identifier, password });
    return res.data; // { token, userId, bandId, role }
}

export function saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", String(data.userId));
    localStorage.setItem("bandId", String(data.bandId));
    localStorage.setItem("role", data.role);
}

export function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("bandId");
    localStorage.removeItem("role");
}

export function getSession() {
    return {
        token: localStorage.getItem("token"),
        userId: localStorage.getItem("userId"),
        bandId: localStorage.getItem("bandId"),
        role: localStorage.getItem("role"),
    };
}