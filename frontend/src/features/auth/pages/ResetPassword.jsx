import { useNavigate, useSearchParams } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/changePassword.css";
import useForm from "../../hooks/useForm";
import { api } from "../../../api/api";

function ResetPassword() {

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get("token");

    const initialValues = {
        newPassword: "",
        confirmPassword: ""
    };

    const validar = (values) => {

        const e = {};
        const { newPassword, confirmPassword } = values;

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

        try {

            await api.post("/api/auth/reset-password", {
                token: token,
                newPassword: vals.newPassword,
                confirmPassword: vals.confirmPassword
            });

            alert("Contraseña actualizada correctamente");

            navigate("/login", { replace: true });

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {
                alert("El token es inválido o expiró");
            } else {
                alert("No se pudo actualizar la contraseña");
            }

        }
    };

    return (
        <div className="change-password-page">
            <AuthHeader />

            <div className="change-card">
                <h2 className="fw-bold text-center mb-2">Recuperar contraseña</h2>

                <p className="text-muted text-center mb-4">
                    Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta
                </p>

                <form onSubmit={handleSubmit(onValidSubmit)} noValidate>

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
                        label="Confirmar nueva contraseña"
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
                    Una vez actualizada tu contraseña podrás iniciar sesión nuevamente
                </p>
            </div>
        </div>
    );
}

export default ResetPassword;