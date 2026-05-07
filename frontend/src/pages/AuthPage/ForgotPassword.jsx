import useForgotPassword from "../../hooks/auth/useForgotPassword.js";

export default function ForgotPassword() {

    const { step, loading, form, handleChange, handleSendOTP, handleReset } = useForgotPassword();
    
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