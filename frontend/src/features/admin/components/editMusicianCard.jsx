import { useEffect, useState } from "react";
import { updateMusicianInstruments } from "../../../api/musicianService.js";
import { getInstruments } from "../../../api/instrumentService.js";

import { toastSuccess, toastError, toastInfo, confirmDelete, confirmAction } from "../../../api/alerts.js";



function EditMusicianCard({ musician, onBack, onSave }) {
    const [availableInstruments, setAvailableInstruments] = useState([]);

    useEffect(() => {
        getInstruments().then(data => setAvailableInstruments(data.map(i => i.nombre)));
    }, []);
    const [form, setForm] = useState({
        ...musician,
        instrumentos: musician.instrumentos || []
    });

    const handleInstrumentChange = (inst) => {
        setForm(prev => {
            const current = prev.instrumentos;
            if (current.includes(inst)) {
                return { ...prev, instrumentos: current.filter(i => i !== inst) };
            }
            if (current.length < 5) {
                return { ...prev, instrumentos: [...current, inst] };
            }
            return prev;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.instrumentos.length === 0) return alert("Asigna al menos un instrumento.");
        try {
            await updateMusicianInstruments(musician.userId, form.instrumentos);
            toastSuccess("Músico actualizado correctamente");
            onSave(form);
        } catch (error) {
            console.error(error);
            toastError("No se pudo actualizar el músico.");
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Editar Músico: {musician.nombreCompleto}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">CORREO (No editable)</label>
                        <input type="text" className="form-control bg-light" value={form.correo} readOnly />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Nuevo Instrumento/Rol *</label>
                        <div className="row g-2">
                            {availableInstruments.map(inst => (
                                <div key={inst} className="col-6 col-md-4">
                                    <div className={`border rounded p-2 d-flex align-items-center ${form.instrumentos.includes(inst) ? 'border-primary bg-primary-subtle' : ''}`}>
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            checked={form.instrumentos.includes(inst)}
                                            onChange={() => handleInstrumentChange(inst)}
                                            id={`edit-${inst}`}
                                        />
                                        <label className="form-check-label small" htmlFor={`edit-${inst}`}>{inst}</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-dark px-4">Guardar cambios</button>
                        <button type="button" className="btn btn-light" onClick={onBack}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMusicianCard;