import { useState } from "react";
import { registerAPI } from "../api/authAPI";
import { useNavigate } from "react-router-dom";

export default function useRegister() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) {
            newErrors.name = "Vui lòng nhập họ tên";
        } else if (form.name.trim().length < 2) {
            newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await registerAPI(form);
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/login");
        } catch (err) {
            setErrors({ general: err.response?.data?.message || "Đăng ký thất bại" });
        } finally {
            setLoading(false);
        }
    };

    return { form, errors, loading, handleChange, handleSubmit };
}