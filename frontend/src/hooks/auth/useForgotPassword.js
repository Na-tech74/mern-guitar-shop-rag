import { useState } from "react";
import { forgotPasswordAPI, resetPasswordAPI } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
export default function useForgotPassword() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        otp: "",
        newPassword: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // STEP 1: gửi OTP
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
            console.log(err.response?.data);
            alert(err.response?.data?.message || "Lỗi");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: reset password
    const handleReset = async (e) => {
        e.preventDefault();

        if (!form.otp || !form.newPassword) {
            return alert("Nhập đầy đủ OTP và mật khẩu");
        }

        if (form.newPassword.length < 8) {
            return alert("Mật khẩu ít nhất 8 ký tự");
        }

        setLoading(true);

        try {
            await resetPasswordAPI({
                email: form.email.trim().toLowerCase(),
                otp: Number(form.otp),
                password: form.newPassword
            });

            alert("Đổi mật khẩu thành công");

            // redirect về login
            navigate("/login");

        } catch (err) {
            console.log(err.response?.data);
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
