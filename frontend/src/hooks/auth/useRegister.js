import { useState } from "react";
import { registerAPI } from "../../api/authAPI";

export default function useRegister() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            password: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await registerAPI(form);
            alert("Đăng ký thành công!");
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi server");
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        handleChange,
        handleSubmit
    };
}