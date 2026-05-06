import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequired }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    //  chưa login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    //  sai quyền
    if (roleRequired && role !== roleRequired) {
        return <Navigate to="/" replace />;
    }

    return children;
}