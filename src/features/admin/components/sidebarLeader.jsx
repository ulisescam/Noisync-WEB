import { NavLink } from "react-router-dom";
import "./styles/sidebarLeader.css";

function SidebarLeader() {

    return (
        <aside
            className="bg-white border-end vh-100 p-3"
            style={{ width: "240px" }}
        >
            <ul className="nav nav-pills flex-column gap-2">

                <li className="nav-item">
                    <NavLink
                        to="/canciones"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-bar-chart-line fs-5"></i>
                        <span>Canciones</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/musicos"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-person fs-5"></i>
                        <span>Músicos</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/instrumentos"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-tag fs-5"></i>
                        <span>Instrumentos</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/perfil"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-person-circle fs-5"></i>
                        <span>Perfil</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/perfil-banda"
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-people fs-5"></i>
                        <span>Perfil Banda</span>
                    </NavLink>
                </li>
            </ul>

            <div className="pt-3 border-top">

            </div>
        </aside>
    );
}

export default SidebarLeader;
