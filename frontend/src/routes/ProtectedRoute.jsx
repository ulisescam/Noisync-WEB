import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function ProtectedRoute({ allowedRoles }) {

    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
        setLoading(false);
    }, []);

    if (loading) {
        return null; // o spinner
    }

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
