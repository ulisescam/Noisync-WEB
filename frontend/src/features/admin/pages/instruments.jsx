import { useState, useEffect } from "react";
import IntrumentsTable from "../components/InstrumentsTable";
import AddInstrumentCategoryCard from "../components/addInstrumentCategoryCard";
import { getInstruments, deleteInstrument } from "../../../api/instrumentService";

import { toastSuccess, toastError, toastInfo, confirmDelete, confirmAction } from "../../../api/alerts.js";

function Instruments() {
    const [showAdd, setShowAdd] = useState(false);
    const [instruments, setInstruments] = useState([]);
    const [search, setSearch] = useState("");

    const isLeader = localStorage.getItem("role") === "LEADER";

    const loadInstruments = async () => {
        const data = await getInstruments();
        setInstruments(data);
    };

    useEffect(() => { loadInstruments(); }, []);

    const handleDelete = async (id) => {
        const result = await confirmDelete("Esta categoría será eliminada.");
        if (!result.isConfirmed) return;
        try {
            await deleteInstrument(id);
            toastSuccess("Categoría eliminada correctamente");
            loadInstruments();
        } catch (error) {
            if (error.response?.data?.message === "EN_USO") {
                const result2 = await confirmAction(
                    "Categoría en uso",
                    "Hay músicos usando este rol, ¿deseas eliminarlo de sus perfiles?",
                    "Sí, eliminar"
                );
                if (result2.isConfirmed) {
                    toastInfo("Funcionalidad de reasignación pendiente.");
                }
            } else {
                toastError("No se pudo eliminar el instrumento.");
            }
        }
    };

    const filtered = instruments.filter(i =>
        i.nombre.toLowerCase().includes(search.toLowerCase())
    );

    if (showAdd) {
        return <AddInstrumentCategoryCard onBack={() => { setShowAdd(false); loadInstruments(); }} />;
    }

    return (
        <>
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="mb-0">Categorías de Instrumentos</h5>
                    <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
                        <div className="my-3 flex-grow-1" style={{ minWidth: "220px" }}>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Nombre de la categoría..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        {isLeader && (
                            <button
                                className="btn btn-dark px-4 py-2 align-self-start align-self-lg-auto"
                                style={{ whiteSpace: "nowrap" }}
                                onClick={() => setShowAdd(true)}
                            >
                                + Agregar
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <IntrumentsTable
                        instruments={filtered}
                        isLeader={isLeader}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </>
    );
}

export default Instruments;