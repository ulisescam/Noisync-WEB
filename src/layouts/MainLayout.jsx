import { Outlet } from "react-router-dom";
import Footer from "../features/shared/components/Footer";

function MainLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">

            {/* Contenido dinámico */}
            <div className="flex-grow-1">
                <Outlet />
            </div>

            {/* Footer */}
            <Footer />

        </div>
    );
}

export default MainLayout;
