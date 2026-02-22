import "../../shared/styles/navbar.css";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

function NavbarLeader() {
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
                <div className="container">

                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        className="navbar-brand d-flex align-items-center gap-2 fw-semibold"
                    >
                        <img
                            className="logoNav"
                            src={logo}
                            alt="Noisync Logo"
                            width="28"
                            height="28"
                        />
                        MiBanda
                    </Link>

                    {/* Botón hamburguesa */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarLeaderContent"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Parte derecha */}
                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="navbarLeaderContent"
                    >
                        <div className="d-flex align-items-center gap-3">

                            {/* Selector de banda */}
                            <div className="dropdown">
                                <button
                                    className="btn btn-light btn-sm dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                >
                                    Los Nocturnos
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <button className="dropdown-item">
                                            Los Nocturnos
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item">
                                            Nueva Banda
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            {/* Avatar */}
                            <div className="dropdown">
                                <button
                                    className="btn p-0 border-0 bg-transparent"
                                    data-bs-toggle="dropdown"
                                >
                                    <div
                                        className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                        style={{ width: "34px", height: "34px" }}
                                    >
                                        <i className="bi bi-person"></i>
                                    </div>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/perfil">
                                            Mi perfil
                                        </Link>
                                    </li>
                                    <li>
                                        <button className="dropdown-item text-danger">
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </nav>
        </header>
    );
}

export default NavbarLeader;
