import "../styles/footer.css";
import logo from "../../../assets/logo.png";
function Footer() {
    return (
        <footer className="footer-container">

            <div className="container py-4">

                <div className="row align-items-center">

                    {/* Logo + Marca */}
                    <div className="col-md-4 mb-3 mb-md-0 d-flex align-items-center gap-2">
                        <img src={logo} alt="Noisync Logo" width="24" height="24" />
                        <span className="fw-semibold">Noisync</span>
                    </div>


                    {/* Copyright */}
                    <div className="col-md-4 text-md-end text-center">
                        <small className="text-muted">
                            © {new Date().getFullYear()} Noisync. Todos los derechos reservados.
                        </small>
                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;
