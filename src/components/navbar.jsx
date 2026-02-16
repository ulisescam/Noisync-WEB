import './styles/navbar.css'; 
import logo from "../assets/logo.png";

function Navbar() {
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
                <div className="container">

                    {/* Logo */}
                    <a className="navbar-brand d-flex align-items-center gap-2 fw-semibold" href="#">
                        <img
                            className='logoNav'
                            src={logo}
                            alt="Noisync Logo"
                            width="28"
                            height="28"
                        />
                        Noisync
                    </a>

                    {/* Botón hamburguesa (responsive) */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/* Botones derecha */}
                    <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
                        <div className="d-flex gap-2">

                            <button className="btn btn-outline-secondary btn-sm px-3" id='btnSesion'>
                                Iniciar sesión
                            </button>

                            <button className="btn btn-dark btn-sm px-3" id='btnRegistro'>
                                Registrar banda
                            </button>

                        </div>
                    </div>

                </div>
            </nav>
        </header>
    );
}

export default Navbar;
