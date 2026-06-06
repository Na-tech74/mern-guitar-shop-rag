import { useState } from "react";
import { forgotPasswordAPI, resetPasswordAPI } from "../../../api";
import { useNavigate } from "react-router-dom";
export default function useForgotPassword() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        otp: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!form.email) {
            return alert("Nhập email");
        }

        setLoading(true);

        try {
            await forgotPasswordAPI({
                email: form.email.trim().toLowerCase()
            });

            alert("OTP đã được gửi về email");
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (!form.otp || !form.password) {
            return alert("Nhập đầy đủ OTP và mật khẩu");
        }

        if (form.password.length < 8) {
            return alert("Mật khẩu ít nhất 8 ký tự");
        }

        setLoading(true);

        try {
            await resetPasswordAPI({
                email: form.email.trim().toLowerCase(),
                otp: form.otp,
                password: form.password
            });

            alert("Đổi mật khẩu thành công");
            navigate("/login");

        } catch (err) {
            alert(err.response?.data?.message || "Lỗi");
        } finally {
            setLoading(false);
        }
    };
    return ({
        form,
        step,
        loading,
        handleChange,
        handleSendOTP,
        handleReset
    });
};