import { useEffect, useState } from "react";
import InviteMusicianCard from "../components/inviteMusicianCard";
import MusiciansTable from "../components/MusiciansTable";
import EditMusicianCard from "../components/editMusicianCard";
import { getMusicians, removeMusician } from "../../../api/musicianService";

function MusicianManagement() {
    const [editingMusician, setEditingMusician] = useState(null);
    const [showInvite, setShowInvite] = useState(false);

    const role = localStorage.getItem("role");
    const isLeader = role === "LEADER";

    const [musicians, setMusicians] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getMusicians();

            // data debe venir como: [{ userId, bandId, nombreCompleto, correo, username, estatus }, ...]
            setMusicians(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            alert(e?.response?.data?.message || "No se pudo cargar la lista de músicos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm("¿Seguro que deseas eliminar este músico?")) return;

        try {
            await removeMusician(userId, false);
            setMusicians((prev) => prev.filter((m) => m.userId !== userId));
        } catch (e) {
            console.error(e);
            alert(e?.response?.data?.message || "No se pudo eliminar el músico");
        }
    };

    const handleEdit = (musician) => setEditingMusician(musician);

    const handleSave = (updated) => {
        setMusicians((prev) =>
            prev.map((m) => (m.userId === updated.userId ? updated : m))
        );
        setEditingMusician(null);
    };

    if (editingMusician) {
        return (
            <EditMusicianCard
                musician={editingMusician}
                onBack={() => setEditingMusician(null)}
                onSave={handleSave}
            />
        );
    }

    if (showInvite) {
        return <InviteMusicianCard onBack={() => setShowInvite(false)} />;
    }

    return (
        <>
            {isLeader && (
                <div className="mb-3">
                    <button className="btn btn-dark" onClick={() => setShowInvite(true)}>
                        + Invitar músico
                    </button>
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    {loading ? (
                        <div className="text-muted">Cargando músicos...</div>
                    ) : (
                        <MusiciansTable
                            musicians={musicians}
                            isLeader={isLeader}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default MusicianManagement;