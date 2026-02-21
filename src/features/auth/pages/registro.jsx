import { useState } from "react";
import { Link } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/registro.css";

function Registro() {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario enviado");
    };

    const [nombre, setNombre] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [nombreBanda, setNombreBanda] = useState("");

    return (
        <div className="registro-page">
            <AuthHeader />
            <div className="registro-card">
                <h2 className="fw-bold text-center mb-2">Registro</h2>
                <p className="text-muted text-center mb-4">
                    Crea tu cuenta de Noisync
                </p>
                <form onSubmit={handleSubmit}>

                    <FormInput
                        label="Nombre Completo"
                        type="text"

                        placeholder="Ingresa tu nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Nombre de usuario"
                        type="text"

                        placeholder="Elige de usuario"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Correo Electrónico"
                        type="email"

                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Contraseña"
                        type="password"

                        placeholder="Ingresa tu contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Confirmar Contraseña"
                        type="password"

                        placeholder="Confirma tu contraseña"
                        value={confirmarContraseña}
                        onChange={(e) => setConfirmarContraseña(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Nombre de la banda"
                        type="text"

                        placeholder="Ingresa el nombre de tu banda"
                        value={nombreBanda}
                        onChange={(e) => setNombreBanda(e.target.value)}
                        required
                    />
                    <p className="text-muted text-center mb-4">
                        Se creará la banda automáticamente y quedarás como Líder
                    </p>

                    <button type="submit" className="btn btn-dark w-100 custom-btn">
                        Crear Cuenta
                    </button>
                </form>
                <div className="text-center mt-4 small">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="link-text">
                        Iniciar sesión
                    </Link>

                </div>

            </div>
        </div>
    );
}
export default Registro;