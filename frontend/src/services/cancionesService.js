const API_URL = "http://localhost:3000/api/canciones";

export const getCanciones = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener canciones");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getCanciones:", error);
    return [];
  }
};
