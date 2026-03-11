import { api } from "./api";

// GET /api/musicians
export async function getMusicians() {
  const res = await api.get("/api/musicians");
  return res.data; // List<MusicianResponse>
}

// DELETE /api/musicians/{musicianId}?removeInstruments=false
export async function removeMusician(musicianId, removeInstruments = false) {
  const res = await api.delete(`/api/musicians/${musicianId}`, {
    params: { removeInstruments },
  });
  return res.data; // { ok, message }
}

// PUT /api/musicians/{musicianId}/activate?forcePasswordChange=false
export async function activateMusician(musicianId, forcePasswordChange = false) {
  const res = await api.put(`/api/musicians/${musicianId}/activate`, null, {
    params: { forcePasswordChange },
  });
  return res.data;
}