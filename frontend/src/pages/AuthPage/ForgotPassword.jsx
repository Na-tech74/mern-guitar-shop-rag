import useForgotPassword from "../../hooks/auth/useForgotPassword.js";

export default function ForgotPassword() {
    const { step, loading, form, handleChange, handleSendOTP, handleReset } = useForgotPassword();

    return (
        <div className="min-h-screen flex items-center border border-[#e8dcc8] justify-center bg-white">
            <div className="w-full max-w-sm border p-6 rounded-xl">

                {/* Header - luôn hiển thị */}
                <div className="text-center mb-8">
                    <span className="text-3xl">🎸</span>
                    <h1 className="text-[#2c1a06] text-xl font-medium mt-1">
                        {step === 1 ? "Quên mật khẩu" : "Nhập OTP để đặt lại mật khẩu"}
                    </h1>
                    <p className="text-[#a07840] text-xs tracking-widest mt-1">Nam Acoustic Shop</p>
                </div>

                {/* Chỉ hiển thị đúng 1 form dựa vào step */}
                {step === 1 && (
                    <>
                        <h2 className="text-xl mb-4 text-center">Quên mật khẩu</h2>
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
                                className="w-full mt-2 py-3 bg-[#2c1a06] text-[#f0d49a] text-xs uppercase tracking-widest rounded-lg hover:opacity-85 transition"
                            >
                                {loading ? "Đang gửi..." : "Gửi OTP"}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <form onSubmit={handleReset} className="space-y-3">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full border p-2 bg-gray-100"
                                disabled
                            />
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
                                className="w-full mt-2 py-3 bg-[#2c1a06] text-[#f0d49a] text-xs uppercase tracking-widest rounded-lg hover:opacity-85 transition"
                            >
                                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}