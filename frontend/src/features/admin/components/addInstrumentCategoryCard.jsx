import { useState } from "react";
import { createInstrument } from "../../../api/instrumentService";

import { toastSuccess, toastError, toastInfo, confirmDelete, confirmAction } from "../../../api/alerts.js";


function AddInstrumentCategoryCard({ onBack }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createInstrument(name);
            toastSuccess("Categoría creada correctamente");
            onBack();
        } catch (error) {
            const msg = error.response?.data?.message;
            if (msg === "Ese instrumento ya existe") {
                toastError("Ya existe una categoría con ese nombre.");
            } else if (msg === "Límite de 30 categorías alcanzado") {
                toastError("Has alcanzado el límite de 30 categorías.");
            } else {
                toastError("No se pudo crear la categoría.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <button className="btn btn-sm btn-light mb-3" onClick={onBack}>
                    <i className="bi bi-arrow-left me-2"></i> Volver
                </button>
                <h5 className="fw-bold mb-3">Nueva categoría</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre de la categoría *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Guitarra rítmica"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-dark" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={onBack}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddInstrumentCategoryCard;