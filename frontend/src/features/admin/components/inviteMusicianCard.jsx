import { useState } from "react";
import { api } from "../../../api/api";
import { getInstruments } from "../../../api/instrumentService";

import { toastSuccess, toastError, toastInfo, confirmDelete, confirmAction } from "../../../api/alerts.js";


function InviteMusicianCard({ onBack }) {
    const [availableInstruments, setAvailableInstruments] = useState([]);

    useEffect(() => {
        getInstruments().then(data => setAvailableInstruments(data.map(i => i.nombre)));
    }, []);
    const [form, setForm] = useState({
        name: "",
        email: "",
        instrumentos: []
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Manejador para el checkbox de instrumentos
    const handleInstrumentChange = (instrumento) => {
        setForm(prev => {
            const current = prev.instrumentos;
            if (current.includes(instrumento)) {
                return { ...prev, instrumentos: current.filter(i => i !== instrumento) };
            }
            if (current.length < 5) {
                return { ...prev, instrumentos: [...current, instrumento] };
            }
            return prev; // No permite más de 5
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Instrumentos seleccionados:", form.instrumentos);


        // Regla de negocio: Instrumento(s) es obligatorio
        if (form.instrumentos.length === 0) {
            toastInfo("Debes asignar al menos un instrumento.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/api/band/invite", {
                nombreCompleto: form.name,
                correo: form.email,
                instrumentos: form.instrumentos,
                // Nota: El backend se encargará de generar la contraseña genérica y enviar el correo
            });

            console.log("Invitación enviada:", response.data);
            toastSuccess("Invitación enviada correctamente");
            onBack();

        } catch (error) {
            console.error(error);
            const status = error.response?.status;
            console.error("Status:", error.response?.status);
            console.error("Error data:", error.response?.data);
            console.error("Error message:", error.response?.data?.message);

            // Criterios de aceptación específicos
            if (status === 409) {
                toastError("Este usuario ya pertenece a otra banda y no puede ser agregado.");
            } else if (status === 403) {
                toastError("No tienes permisos de Líder para realizar esta acción.");
            } else {
                toastError("No se pudo enviar la invitación. Intenta de nuevo.");
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

                <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                        <i className="bi bi-person-plus-fill"></i>
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold">Registrar Integrante</h5>
                        <small className="text-muted">El músico recibirá sus credenciales por correo.</small>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* NOMBRE */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Nombre completo *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Nombre del músico"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* CORREO */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Correo electrónico *</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="correo@ejemplo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* INSTRUMENTOS (Máximo 5) */}
                    <div className="mb-4">
                        <label className="form-label fw-bold d-block">
                            Instrumentos * <small className="text-muted fw-normal">(Máx. 5)</small>
                        </label>
                        <div className="row g-2 border rounded p-3 bg-light m-0">
                            {availableInstruments.map((inst) => (
                                <div key={inst} className="col-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`check-${inst}`}
                                            checked={form.instrumentos.includes(inst)}
                                            onChange={() => handleInstrumentChange(inst)}
                                            disabled={!form.instrumentos.includes(inst) && form.instrumentos.length >= 5}
                                        />
                                        <label className="form-check-label" htmlFor={`check-${inst}`}>
                                            {inst}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="alert alert-info border-0 small">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        El estatus inicial será <strong>Pendiente</strong> hasta que el músico inicie sesión.
                    </div>

                    <div className="d-grid gap-2 d-md-flex">
                        <button type="submit" className="btn btn-dark px-4" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar invitación"}
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

export default InviteMusicianCard;