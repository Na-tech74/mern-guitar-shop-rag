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

    if (roleRequired && role !== roleRequired) {
        return <Navigate to="/" replace />;
    }

    return children;
}