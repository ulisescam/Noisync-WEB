import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/changePassword.css";
import useForm from "../../hooks/useForm";


function ChangePassword() {
    const navigate = useNavigate();

    const initialValues = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const validar = (values) => {
        const e = {};
        const { currentPassword, newPassword, confirmPassword } = values;

        if (!currentPassword.trim()) e.currentPassword = "La contraseña actual es obligatoria";

        if (!newPassword.trim()) {
            e.newPassword = "La nueva contraseña es obligatoria";
        } else {
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passRegex.test(newPassword)) {
                e.newPassword = "Mín 8 caracteres, 1 mayúscula, 1 minúscula y 1 número";
            }
        }

        if (!confirmPassword.trim()) {
            e.confirmPassword = "Confirma tu nueva contraseña";
        } else if (confirmPassword !== newPassword) {
            e.confirmPassword = "Las contraseñas no coinciden";
        }

        return e;
    };

    const { values, errors, submitIntentado, handleChange, handleSubmit } =
        useForm(initialValues, validar);

    const onValidSubmit = async (vals) => {
        console.log("Formulario válido:", vals);

        // llamar api
        navigate("/login", { replace: true });
    };

    return (
        <div className="change-password-page">
            <AuthHeader />

            <div className="change-card">
                <h2 className="fw-bold text-center mb-2">Cambio de contraseña obligatorio</h2>

                <p className="text-muted text-center mb-4">
                    Este paso es requerido para activar tu cuenta
                </p>

                <form onSubmit={handleSubmit(onValidSubmit)} noValidate>
                    <FormInput
                        name="currentPassword"
                        label="Contraseña actual"
                        type="password"
                        placeholder="Ingresa tu contraseña actual"
                        value={values.currentPassword}
                        onChange={handleChange}
                        required
                        error={errors.currentPassword}
                        forceValidate={submitIntentado}
                    />

                    <FormInput
                        name="newPassword"
                        label="Nueva contraseña"
                        type="password"
                        placeholder="Ingresa tu nueva contraseña"
                        value={values.newPassword}
                        onChange={handleChange}
                        required
                        error={errors.newPassword}
                        forceValidate={submitIntentado}
                    />

                    <FormInput
                        name="confirmPassword"
                        label="Confirmar Nueva Contraseña"
                        type="password"
                        placeholder="Confirma tu nueva contraseña"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        required
                        error={errors.confirmPassword}
                        forceValidate={submitIntentado}
                    />

                    <button type="submit" className="btn btn-dark w-100">
                        Actualizar
                    </button>
                </form>

                <hr className="my-4" />

                <p className="text-muted text-center small">
                    Una vez actualizada tu contraseña, podrás acceder a todas las funcionalidades de tu cuenta
                </p>
            </div>
        </div>
    );
}

export default ChangePassword;