function Navbar() {
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
                <div className="container">

                    {/* Logo */}
                    <a className="navbar-brand d-flex align-items-center gap-2 fw-semibold" href="#">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/727/727245.png"
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

                            <button className="btn btn-outline-secondary btn-sm px-3">
                                Iniciar sesión
                            </button>

                            <button className="btn btn-dark btn-sm px-3">
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
