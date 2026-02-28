import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // LEADER / MUSICIAN

    // 1) No token => login
    if (!token) return <Navigate to="/login" replace />;

    // 2) Si pides roles y no coincide => home
    if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
        return <Navigate to="/" replace />;
    }

    // 3) OK => renderiza ruta hija
    return <Outlet />;
}