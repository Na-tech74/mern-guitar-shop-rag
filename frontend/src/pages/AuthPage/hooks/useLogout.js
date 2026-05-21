import { useNavigate } from "react-router-dom";
import { logoutAPI } from "../api/authAPI";

export default function useLogout() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const handleLogout = async () => {
        try {
            await logoutAPI();
        } catch {
            // ignore lỗi, vẫn logout local
        }
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("token");
        navigate("/");
    }
    return ({
        userInfo,
        handleLogout
    });
}