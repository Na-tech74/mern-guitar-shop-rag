import { useState } from "react";
import { forgotPasswordAPI, resetPasswordAPI } from "../../../api";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../components/MessageDialog";

export default function useForgotPassword() {
    const { alert } = useDialog();
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
            await alert({ title: "Lỗi", message: "Nhập email", variant: "warning" }); return;
        }

        setLoading(true);

        try {
            await forgotPasswordAPI({
                email: form.email.trim().toLowerCase()
            });

            await alert({ title: "Thành công", message: "OTP đã được gửi về email", variant: "success" });
            setStep(2);
        } catch (err) {
            await alert({ title: "Lỗi", message: err.response?.data?.message || "Lỗi", variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (!form.otp || !form.password) {
            await alert({ title: "Lỗi", message: "Nhập đầy đủ OTP và mật khẩu", variant: "warning" }); return;
        }

        if (form.password.length < 8) {
            await alert({ title: "Lỗi", message: "Mật khẩu ít nhất 8 ký tự", variant: "warning" }); return;
        }

        setLoading(true);

        try {
            await resetPasswordAPI({
                email: form.email.trim().toLowerCase(),
                otp: form.otp,
                password: form.password
            });

            await alert({ title: "Thành công", message: "Đổi mật khẩu thành công", variant: "success" });
            navigate("/login");

        } catch (err) {
            await alert({ title: "Lỗi", message: err.response?.data?.message || "Lỗi", variant: "error" });
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