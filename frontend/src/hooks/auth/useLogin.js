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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loginAPI(form);

            //  lưu token
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("role", res.data.role);
            console.log("ROLE:", res.data.role);

            //role để phân quyền (admin/user)

            if (res.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
            // console.log(res.data);
            alert("Đăng nhập thành công");

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
        handleSubmit
    });
};