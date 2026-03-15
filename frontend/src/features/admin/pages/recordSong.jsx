import { useState } from "react";
import SongForm from "../../songs/components/songForm";
import SongStructure from "../../songs/components/SongStructure";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api.js";
import { toastSuccess, toastError } from "../../../api/alerts.js";

function RecordSong() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async (blocks) => {
        if (!formData) {
            toastError("Completa la información básica de la canción.");
            return;
        }
        if (blocks.length === 0) {
            toastError("Agrega al menos un bloque de estructura.");
            return;
        }
        const invalidBlock = blocks.find(b => !b.name || !b.content);
        if (invalidBlock) {
            toastError("Todos los bloques deben tener nombre y contenido.");
            return;
        }

        setLoading(true);
        try {
            // 1. Crear la canción
            const songRes = await api.post("/api/songs", {
                titulo: formData.title,
                artistaAutor: formData.artist,
                bpm: parseInt(formData.bpm),
                tonoOriginal: formData.key,
                escalaBase: formData.escalaBase,
                visibilidad: formData.visibility ? "PUBLIC" : "PRIVATE",
                coverUrl: formData.coverUrl || null
            });

            const songId = songRes.data.songId;

            // 2. Crear las secciones
            for (const block of blocks) {
                await api.post(`/api/songs/${songId}/sections`, {
                    etiqueta: block.name,
                    contenido: block.content
                });
            }

            toastSuccess("Canción registrada correctamente");
            navigate(-1);
        } catch (err) {
            console.error(err);
            toastError("No se pudo registrar la canción.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => navigate(-1);

    return (
        <>
            <div className="mb-3">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                >
                    ← Volver
                </button>
            </div>

            <SongForm onFormChange={setFormData} />

            <SongStructure
                onSave={handleSave}
                onCancel={handleCancel}
                loading={loading}
                buttonText={loading ? "Guardando..." : "Guardar canción"}
            />
        </>
    );
}

export default RecordSong;