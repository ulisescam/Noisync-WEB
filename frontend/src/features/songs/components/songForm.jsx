import { useEffect, useState } from "react";

function SongForm({ initialData = {}, onFormChange }) {

    const [formData, setFormData] = useState({
        title: initialData.title || "",
        artist: initialData.artist || "",
        bpm: initialData.bpm || "",
        key: initialData.key || "C",
        escalaBase: initialData.escalaBase || "Mayor",
        coverUrl: initialData.coverUrl || "",
        visibility: initialData.visibility ?? true
    });

    useEffect(() => {
        if (onFormChange) onFormChange(formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-body p-4">
                <h5 className="mb-4 fw-bold">Información básica</h5>

                <div className="row g-4">

                    {/* TITULO */}
                    <div className="col-md-6">
                        <label className="form-label">Título de la canción *</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-music-note"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ej: Noche estrellada"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* ARTISTA */}
                    <div className="col-md-6">
                        <label className="form-label">Artista / Autor *</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ej: Luna Gris"
                                name="artist"
                                value={formData.artist}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* BPM */}
                    <div className="col-md-6">
                        <label className="form-label">BPM (Tempo) *</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-speedometer2"></i></span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Ej: 120"
                                name="bpm"
                                value={formData.bpm}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* TONO */}
                    <div className="col-md-3">
                        <label className="form-label">Tono original *</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-music-note-beamed"></i></span>
                            <select className="form-select" name="key" value={formData.key} onChange={handleChange}>
                                {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ESCALA BASE */}
                    <div className="col-md-3">
                        <label className="form-label">Escala *</label>
                        <select className="form-select" name="escalaBase" value={formData.escalaBase} onChange={handleChange}>
                            <option value="Mayor">Mayor</option>
                            <option value="Menor">Menor</option>
                            <option value="Pentatónica Mayor">Pentatónica Mayor</option>
                            <option value="Pentatónica Menor">Pentatónica Menor</option>
                            <option value="Blues">Blues</option>
                            <option value="Dórica">Dórica</option>
                            <option value="Frigia">Frigia</option>
                            <option value="Lidia">Lidia</option>
                            <option value="Mixolidia">Mixolidia</option>
                        </select>
                    </div>

                    {/* COVER URL */}
                    <div className="col-12">
                        <label className="form-label">Imagen de portada (URL)</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-image"></i></span>
                            <input
                                type="url"
                                className="form-control"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                name="coverUrl"
                                value={formData.coverUrl}
                                onChange={handleChange}
                            />
                        </div>
                        <small className="text-muted">Opcional. Si no se ingresa, se asignará una imagen por defecto.</small>
                    </div>

                    {/* VISIBILIDAD */}
                    <div className="col-12">
                        <label className="form-label">Visibilidad</label>
                        <div className="form-check form-switch d-flex align-items-center gap-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="visibility"
                                checked={formData.visibility}
                                onChange={handleChange}
                            />
                            <label className={`form-check-label fw-semibold ${formData.visibility ? "text-success" : "text-danger"}`}>
                                {formData.visibility ? "Pública" : "Privada"}
                            </label>
                        </div>
                        <small className="text-muted">
                            {formData.visibility
                                ? "La canción será visible para todos en el buscador público"
                                : "La canción solo será visible para tu banda"}
                        </small>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SongForm;