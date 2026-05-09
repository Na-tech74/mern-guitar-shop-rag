import { useState } from "react";
import { loginAPI } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loginAPI(form);
            console.log("API response:", res.data);
            //  lưu token
            localStorage.setItem("token", res.data.accessToken);
            // lưu toàn bộ thông tin người dùng vào localStorage dưới dạng JSON string
            localStorage.setItem("userInfo", JSON.stringify({
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                accessToken: res.data.accessToken
            })); 

            //role để phân quyền (admin/user)

            if (res.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
            console.log(res.data);
            alert("Đăng nhập thành công !");

            // reset
            setForm({
                email: "",
                password: ""
            });
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi server");
        } finally {
            setLoading(false);
        }
    };
    return ({
        form,
        loading,
        handleChange,
        handleLogin
    });
};