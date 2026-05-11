import { useNavigate } from "react-router-dom";
export default function useLogout() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("refreshToken");
        navigate("/");
    }
    return ({
        userInfo,
        handleLogout
    });
}