import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/login.css";



function Login() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // vuelve a la página anterior
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login:", { email, password });

        // Aquí después irá la conexión al backend
    };

    return (
        <div className="login-page">

            <AuthHeader />


            {/* Card Login */}
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

                    <button type="submit" className="btn btn-dark w-100 custom-btn">
                        Entrar
                    </button>

                </form>

                <div className="text-center mt-4 small">
                    <Link to="/forgot-password" className="link-text">
                        ¿olvidaste tu contraseña?
                    </Link>
                    <br></br>
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
