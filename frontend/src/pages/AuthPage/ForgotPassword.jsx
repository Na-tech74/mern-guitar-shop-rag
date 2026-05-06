import { useState } from "react";
import { forgotPasswordAPI, resetPasswordAPI } from "../../api/authAPI";

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: nhập email | 2: nhập OTP
    const [loading, setLoading] = useState(false);

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

    // BƯỚC 1: gửi OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await forgotPasswordAPI({ email: form.email });
            alert("OTP đã được gửi về email");
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi");
        } finally {
            setLoading(false);
        }
    };

    // BƯỚC 2: reset password
    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await resetPasswordAPI({
                email: form.email,
                otp: form.otp,
                newPassword: form.newPassword
            });

            alert("Đổi mật khẩu thành công");

            // reset về bước đầu
            setStep(1);
            setForm({
                email: "",
                otp: "",
                newPassword: ""
            });

        } catch (err) {
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
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            className="w-full border p-2"
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-black text-white p-2"
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
                        />

                        <input
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            type="password"
                            placeholder="Mật khẩu mới"
                            className="w-full border p-2"
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-black text-white p-2"
                        >
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}