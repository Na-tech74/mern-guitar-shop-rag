import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequired }) {
    const token = sessionStorage.getItem("token");

    let userInfo = null;
    try {
        userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    } catch {
        userInfo = null;
    }
    const role = userInfo?.role;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const allowedRoles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];

    if (roleRequired && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}