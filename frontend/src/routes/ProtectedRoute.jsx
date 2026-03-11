import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role"); // LEADER / USER / MUSICIAN

    if (!token) return <Navigate to="/login" replace />;

    if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}