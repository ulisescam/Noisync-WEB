import { useNavigate, Link } from "react-router-dom";
import "./styles/authHeader.css";

function AuthHeader({ title = "Noisync", showBack = true }) {

    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return (
        <>
            <div className="auth-header">

                {showBack && (
                    <button className="back-link-btn" onClick={handleBack}>
                        ← Volver
                    </button>
                )}

                <h5 className="brand-title">{title}</h5>

                <Link to="/" className="home-link-btn">
                    Inicio
                </Link>
            </div>

        </>

    );
}

export default AuthHeader;
