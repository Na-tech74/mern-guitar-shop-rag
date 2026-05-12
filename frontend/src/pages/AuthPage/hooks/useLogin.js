import { useState } from "react";
import { loginAPI } from "../api/authAPI";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!form.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (!form.password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        } else if (form.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await loginAPI(form);
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("userInfo", JSON.stringify({
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                accessToken: res.data.accessToken
            }));

            if (res.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

            setForm({ email: "", password: "" });
        } catch (err) {
            setErrors({ general: err.response?.data?.message || "Đăng nhập thất bại" });
        } finally {
            setLoading(false);
        }
    };

    return { form, errors, loading, handleChange, handleLogin };
}