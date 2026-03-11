import { useState } from "react";
import { api } from "../../../api/api";

function InviteMusicianCard({ onBack }) {

    const [form, setForm] = useState({
        name: "",
        email: "",
        username: "",
        telefono: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const generateUsername = (name) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9]/g, "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const usernameFinal =
                form.username.trim() !== ""
                    ? form.username
                    : generateUsername(form.name);

            const response = await api.post("/api/band/invite", {
                nombreCompleto: form.name,
                correo: form.email,
                username: usernameFinal,
                telefono: form.telefono
            });

            console.log("Invitación enviada:", response.data);

            alert("Invitación enviada correctamente");

            onBack();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 403) {
                alert("No tienes permisos para invitar músicos");
            } else if (error.response?.status === 409) {
                alert("Ese correo o username ya está registrado");
            } else {
                alert("No se pudo enviar la invitación");
            }

        }

        setLoading(false);
    };

    return (

        <div className="card shadow-sm">

            <div className="card-body p-4">

                <button
                    className="btn btn-sm btn-light mb-3"
                    onClick={onBack}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver
                </button>

                <div className="d-flex align-items-center mb-3">

                    <div
                        className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                        style={{ width: "40px", height: "40px" }}
                    >
                        <i className="bi bi-person-plus"></i>
                    </div>

                    <div>
                        <h5 className="mb-0 fw-bold">
                            Invitar nuevo músico
                        </h5>

                        <small className="text-muted">
                            Envía una invitación a un nuevo integrante
                        </small>
                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    {/* NOMBRE */}
                    <div className="mb-3">
                        <label className="form-label">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Ej: Juan Pérez"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* CORREO */}
                    <div className="mb-3">
                        <label className="form-label">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="ejemplo@correo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* USERNAME OPCIONAL */}
                    <div className="mb-3">
                        <label className="form-label">
                            Username
                            <span className="text-muted"> (opcional)</span>
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            placeholder="Se generará automáticamente si se deja vacío"
                            value={form.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* TELEFONO */}
                    <div className="mb-3">
                        <label className="form-label">
                            Teléfono
                            <span className="text-muted"> (opcional)</span>
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="telefono"
                            placeholder="Ej: 7771234567"
                            value={form.telefono}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="alert alert-light border small">

                        <i className="bi bi-info-circle me-2"></i>

                        Se enviará una invitación por correo al músico con su acceso temporal.

                    </div>

                    <div className="d-flex gap-2">

                        <button
                            type="submit"
                            className="btn btn-dark"
                            disabled={loading}
                        >
                            {loading
                                ? "Enviando..."
                                : <><i className="bi bi-envelope me-2"></i>Enviar invitación</>
                            }
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onBack}
                        >
                            Cancelar
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default InviteMusicianCard;