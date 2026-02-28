import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/login.css";

import { loginRequest, saveSession } from "../../../api/authService";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");      // aquí guardamos "correo o usuario"
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState(""); // para mostrar error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            // backend espera: { identifier, password }
            const data = await loginRequest(email, password);

            saveSession(data);

            // redirección por rol
            if (data.role === "LEADER") navigate("/home-leader");
            else navigate("/"); // o crea /home-musician si quieres
        } catch (err) {
            const backendMsg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Credenciales incorrectas";
            setErrorMsg(backendMsg);
        }
    };

    return (
        <div className="login-page">
            <AuthHeader />

            <div className="login-card">
                <h2 className="fw-bold text-center mb-2">Iniciar sesión</h2>
                <p className="text-muted text-center mb-4">
                    Accede a tu cuenta de Noisync
                </p>

                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="Correo o usuario"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <FormInput
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* error visible */}
                    {errorMsg && (
                        <div className="alert alert-danger py-2 mt-2 mb-0">
                            {errorMsg}
                        </div>
                    )}

                    <button type="submit" className="btn btn-dark w-100 custom-btn mt-3">
                        Entrar
                    </button>
                </form>

                <div className="text-center mt-4 small">
                    <Link to="/forgot-password" className="link-text">
                        ¿olvidaste tu contraseña?
                    </Link>
                    <br />
                    ¿No tienes cuenta?{" "}
                    <Link to="/registro" className="link-text">
                        Registrarse
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;