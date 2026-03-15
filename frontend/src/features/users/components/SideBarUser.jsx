import { NavLink, useNavigate } from "react-router-dom";
import "../../admin/components/styles/sidebarLeader.css";
import { clearSession } from "../../../api/authService.js";
import { confirmAction } from "../../../api/alerts.js";


function SidebarUser() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await confirmAction(
            "¿Cerrar sesión?",
            "Tu sesión actual será terminada",
            "Sí, salir"
        );
        if (result.isConfirmed) {
            clearSession();
            navigate("/login");
        }
    };

    return (
        <aside className="d-flex flex-column h-100 p-3"
            style={{ width: "240px" }}>
            <ul className="nav nav-pills flex-column gap-2">

                <li className="nav-item">
                    <NavLink to="/mis-canciones-user" className="nav-link d-flex align-items-center gap-3">
                        <i className="bi bi-collection-play fs-5"></i>
                        <span>Mis Canciones</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/musician-user"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-person fs-5"></i>
                        <span>Músicos</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/instruments-user"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-tag fs-5"></i>
                        <span>Instrumentos</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/profile-user"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-person-circle fs-5"></i>
                        <span>Perfil</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/band-profile-user"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-people fs-5"></i>
                        <span>Perfil Banda</span>
                    </NavLink>
                </li>
            </ul>

            <div className="mt-auto pt-3 border-top">
                <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                >
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}

export default SidebarUser;