import { api } from "./api";

export const getCanciones = async () => {
  const response = await api.get("/canciones");
  return response.data;
};