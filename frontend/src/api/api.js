import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080", 
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

// adjuntar token
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {

    const status = error.response?.status;

    if ((status === 401 || status === 403) && !isRedirecting) {

      isRedirecting = true;

      localStorage.clear();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);