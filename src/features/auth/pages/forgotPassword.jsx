import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";
import "../components/styles/changePassword.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [correoElectronico, setCorreoElectronico] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Forgot Password:", { correoElectronico });

        // Aquí después irá la conexión al backend
        navigate("/login");
    };

    return (
        <>
            <div className="change-password-page">

                <AuthHeader />


                <div className="change-card">

                    <h2 className="fw-bold text-center mb-2">
                        Recuperar Contraseña
                    </h2>

                    <p className="text-muted text-center mb-4">
                        Ingresa tu correo electrónico para recuperar tu contraseña
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <FormInput
                                label="Correo electrónico"
                                type="email"

                                placeholder="Ingresa tu correo electrónico"
                                value={correoElectronico}
                                onChange={(e) => setCorreoElectronico(e.target.value)}
                                required
                            />
                        </div>



                        <button
                            type="submit"
                            className="btn btn-dark w-100"
                            disabled={
                                !correoElectronico.trim()
                            }
                        >
                            Enviar nstrucciones de recuperación
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
        </>
    );
}

export default ForgotPassword;
