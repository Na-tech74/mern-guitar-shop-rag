import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequired }) {
    const token = sessionStorage.getItem("token");
   
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const role = userInfo?.role; 

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