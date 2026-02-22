import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/changePassword.css";


function ChangePassword() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();



        console.log({
            currentPassword,
            newPassword,
            confirmPassword
        });
    };

    return (
        <div className="change-password-page">

            <AuthHeader />


            <div className="change-card">

                <h2 className="fw-bold text-center mb-2">
                    Cambio de contraseña obligatorio
                </h2>

                <p className="text-muted text-center mb-4">
                    Este paso es requerido para activar tu cuenta
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <FormInput
                            label="Contraseña actual"
                            type="password"

                            placeholder="Ingresa tu contraseña actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <FormInput
                            label="Nueva contraseña"
                            type="password"

                            placeholder="Ingresa tu nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <FormInput
                            label="Confirmar Nueva Contraseña"
                            type="password"

                            placeholder="Confirma tu nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-dark w-100"
                        disabled={
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword
                        }
                    >
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
