import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api.js";

function VerifyEmail() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [message, setMessage] = useState("Verificando tu cuenta...");

    useEffect(() => {

        const verify = async () => {

            try {

                await api.get(`/api/auth/verify-email?token=${token}`);

                setMessage("Cuenta verificada correctamente ");

                setTimeout(() => {
                    navigate("/login");
                }, 3000);

            } catch (error) {

                console.error(error);
                setMessage("El enlace es inválido o expiró ");

            }
        };

        if (token) {
            verify();
        }

    }, [token]);

    return (
        <div style={{ textAlign: "center", marginTop: "120px" }}>
            <h3>{message}</h3>
        </div>
    );
}

export default VerifyEmail;