import { useState } from "react";
import { forgotPasswordAPI, resetPasswordAPI } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-sm border p-6 rounded-xl">

                <h2 className="text-xl mb-4 text-center">
                    {step === 1 ? "Quên mật khẩu" : "Nhập OTP"}
                </h2>

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-3">
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            className="w-full border p-2"
                            disabled={loading}
                        />

                        <button
                            disabled={loading}
                            className="w-full mt-2 py-3 bg-[#2c1a06] text-[#f0d49a] text-xs 
                            uppercase tracking-widest rounded-lg hover:opacity-85 transition"
                        >
                            {loading ? "Đang gửi..." : "Gửi OTP"}
                        </button>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={handleReset} className="space-y-3">

                        <input
                            name="otp"
                            value={form.otp}
                            onChange={handleChange}
                            placeholder="Nhập OTP"
                            className="w-full border p-2"
                            disabled={loading}
                        />

                        <input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            placeholder="Mật khẩu mới"
                            className="w-full border p-2"
                            disabled={loading}
                        />

                        <button
                            disabled={loading}
                            className="w-full mt-2 py-3 bg-[#2c1a06] 
                            text-[#f0d49a] text-xs uppercase tracking-widest
                             rounded-lg hover:opacity-85 transition"
                        >
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}