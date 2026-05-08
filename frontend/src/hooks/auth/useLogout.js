import { useNavigate } from "react-router-dom";
export default function useLogout() {
    const navigate = useNavigate();
    // lấy thông tin người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const handleLogout = () => {
        // xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem("userInfo");
        // nếu có refresh token, xóa nó khỏi localStorage
        localStorage.removeItem("refreshToken");

        // chuyển hướng về trang đăng nhập
        navigate("/");
    }
    return ({
        userInfo,
        handleLogout
    });
};