import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/changePassword.css";
import useForm from "../../hooks/useForm";


function ForgotPassword() {
    const navigate = useNavigate();

    const initialValues = {
        email: "",
    };

    const validar = (values) => {
        const e = {};
        const { email } = values;

        const emailValue = email.trim();

        if (!emailValue) {
            e.email = "El correo es obligatorio";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) e.email = "Correo inválido";
        }

        return e;
    };

    const { values, errors, submitIntentado, handleChange, handleSubmit } =
        useForm(initialValues, validar);

    const onValidSubmit = async (vals) => {
        console.log("Forgot Password:", vals);

        // llamar api

        navigate("/login", { replace: true });
    };

    return (
        <div className="change-password-page">
            <AuthHeader />

            <div className="change-card">
                <h2 className="fw-bold text-center mb-2">Recuperar Contraseña</h2>

                <p className="text-muted text-center mb-4">
                    Ingresa tu correo electrónico para recuperar tu contraseña
                </p>

                <form onSubmit={handleSubmit(onValidSubmit)} noValidate>
                    <FormInput
                        name="email"
                        label="Correo electrónico"
                        type="text"
                        placeholder="Ingresa tu correo electrónico"
                        value={values.email}
                        onChange={handleChange}
                        required
                        error={errors.email}
                        forceValidate={submitIntentado}
                    />

                    <button type="submit" className="btn btn-dark w-100">
                        Enviar instrucciones de recuperación
                    </button>
                </form>

                <hr className="my-4" />

                <p className="text-muted text-center small">
                    ¿Recuerdas tu contraseña?{" "}
                    <Link to="/login" className="link-text">
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;