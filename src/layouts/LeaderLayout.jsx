import NavbarLeader from "../features/admin/components/navbarLeade";
import SidebarLeader from "../features/admin/components/sidebarLeader";

function LeaderLayout({ children }) {
    return (
        <div className="d-flex flex-column vh-100">

            {/* Navbar arriba */}
            <NavbarLeader />

            {/* Contenido debajo */}
            <div className="d-flex flex-grow-1">

                {/* Sidebar izquierda */}
                <SidebarLeader />

                {/* Área principal */}
                <main className="flex-fill p-4 bg-light">
                    {children}
                </main>

            </div>
        </div>
    );
}

export default LeaderLayout;