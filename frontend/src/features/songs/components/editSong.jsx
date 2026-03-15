import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SongForm from "../components/songForm.jsx";
import SongStructure from "../components/SongStructure.jsx";
import { getSong, getSections, updateSong, updateSection, createSection, deleteSection } from "../../../api/songService.js";
import { toastSuccess, toastError } from "../../../api/alerts.js";
import { api } from "../../../api/api.js";

function EditSong() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [initialBlocks, setInitialBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [song, sections] = await Promise.all([
                    getSong(id),
                    getSections(id)
                ]);
                setInitialData({
                    title: song.titulo,
                    artist: song.artistaAutor,
                    bpm: song.bpm,
                    key: song.tonoOriginal,
                    escalaBase: song.escalaBase,
                    coverUrl: song.coverUrl || "",
                    visibility: song.visibilidad === "PUBLIC"
                });
                setInitialBlocks(sections.map(s => ({
                    id: s.sectionId,
                    name: s.etiqueta,
                    content: s.contenido
                })));
            } catch (err) {
                console.error(err);
                toastError("No se pudo cargar la canción.");
            } finally {
                setLoadingData(false);
            }
        };
        load();
    }, [id]);

    const handleSave = async (blocks) => {
        if (!formData) {
            toastError("Completa la información básica.");
            return;
        }
        if (blocks.length === 0) {
            toastError("Agrega al menos un bloque.");
            return;
        }
        const invalidBlock = blocks.find(b => !b.name || !b.content);
        if (invalidBlock) {
            toastError("Todos los bloques deben tener nombre y contenido.");
            return;
        }

        setLoading(true);
        try {
            // 1. Actualizar info básica
            await updateSong(id, {
                titulo: formData.title,
                artistaAutor: formData.artist,
                bpm: parseInt(formData.bpm),
                tonoOriginal: formData.key,
                escalaBase: formData.escalaBase,
                visibilidad: formData.visibility ? "PUBLIC" : "PRIVATE",
                coverUrl: formData.coverUrl || null
            });

            // 2. Sincronizar secciones
            const existentes = initialBlocks.map(b => b.id);
            const nuevos = blocks.filter(b => !existentes.includes(b.id));
            const editados = blocks.filter(b => existentes.includes(b.id));
            const eliminados = initialBlocks.filter(b => !blocks.find(nb => nb.id === b.id));

            for (const b of eliminados) {
                await deleteSection(b.id);
            }
            for (const b of editados) {
                await updateSection(b.id, { etiqueta: b.name, contenido: b.content });
            }
            for (const b of nuevos) {
                await api.post(`/api/songs/${id}/sections`, { etiqueta: b.name, contenido: b.content });
            }

            toastSuccess("Canción actualizada correctamente");
            navigate(-1);
        } catch (err) {
            console.error(err);
            toastError("No se pudo actualizar la canción.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) return <div className="p-4 text-muted">Cargando canción...</div>;

    return (
        <>
            <div className="mb-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>

            <SongForm
                initialData={initialData}
                onFormChange={setFormData}
            />

            <SongStructure
                initialBlocks={initialBlocks}
                onSave={handleSave}
                onCancel={() => navigate(-1)}
                loading={loading}
                buttonText={loading ? "Guardando..." : "Guardar cambios"}
            />
        </>
    );
}

export default EditSong;