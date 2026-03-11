import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/login.css";
import { loginRequest, saveSession } from "../../../api/authService.js";

// BACKEND (se usará después)
// import { loginRequest, saveSession } from "../../../api/authService";

import useForm from "../../hooks/useForm";

function Login() {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const initialValues = {
        identifier: "",
        password: "",
    };

    const validar = (values) => {
        const e = {};
        const { identifier, password } = values;

        const value = identifier.trim();

        if (!value) {
            e.identifier = "El usuario o correo es obligatorio";
        } else if (value.includes("@")) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) e.identifier = "Correo inválido";
        }

        if (!password.trim()) {
            e.password = "La contraseña es obligatoria";
        }

        return e;
    };

    const { values, errors, submitIntentado, handleChange, handleSubmit } =
        useForm(initialValues, validar);

    const onValidSubmit = async (vals) => {
        console.log("LOGIN EJECUTADO");
        setErrorMsg("");

        try {

            const data = await loginRequest(vals.identifier, vals.password);
            console.log("ROL:", data.role);
            saveSession(data);

            if (data.mustChangePassword) {
                navigate("/change-password");
            } else if (data.role === "LEADER") {
                navigate("/home-leader");
            } else if (data.role === "MUSICIAN") {
                navigate("/home-user");
            }

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

                <h2 className="fw-bold text-center mb-2">
                    Iniciar sesión
                </h2>

                <p className="text-muted text-center mb-4">
                    Accede a tu cuenta de Noisync
                </p>

                <form onSubmit={handleSubmit(onValidSubmit)} noValidate>

                    <FormInput
                        name="identifier"
                        type="text"
                        label="Correo o usuario"
                        placeholder="usuario o tu@email.com"
                        value={values.identifier}
                        onChange={handleChange}
                        required
                        error={errors.identifier}
                        forceValidate={submitIntentado}
                    />

                    <FormInput
                        name="password"
                        label="Contraseña"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={values.password}
                        onChange={handleChange}
                        required
                        error={errors.password}
                        forceValidate={submitIntentado}
                    />

                    {errorMsg && (
                        <div className="alert alert-danger py-2 mt-2 mb-0">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-dark w-100 custom-btn mt-3"
                    >
                        Entrar
                    </button>

                </form>

                <div className="text-center mt-4 small">

                    <Link to="/forgot-password" className="link-text">
                        ¿Olvidaste tu contraseña?
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