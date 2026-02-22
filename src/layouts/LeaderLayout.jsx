import NavbarLeader from "../features/admin/components/navbarLeade";
import SidebarLeader from "../features/admin/components/sidebarLeader";

function LeaderLayout({ children }) {
    return (
        <div className="vh-100 d-flex flex-column overflow-hidden">

            {/* Navbar fija arriba */}
            <NavbarLeader />

            {/* Contenedor principal */}
            <div className="d-flex flex-grow-1 overflow-hidden">

                {/* Sidebar fija */}
                <div style={{ width: "240px" }} className="border-end bg-white">
                    <SidebarLeader />
                </div>

                {/* Solo esta parte tendrá scroll */}
                <div className="flex-fill overflow-auto p-4 bg-light">
                    {children}
                </div>

            </div>
        </div>
    );
}

export default LeaderLayout;