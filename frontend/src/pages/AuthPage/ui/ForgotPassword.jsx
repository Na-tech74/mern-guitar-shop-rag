import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useForgotPassword from "../hooks/useForgotPassword";
import Logo from "../../../components/Logo";

export default function ForgotPassword() {
    const { step, loading, form, handleChange, handleSendOTP, handleReset } = useForgotPassword();

    return (
        <div className="min-h-screen flex items-center border border-[#e8dcc8] justify-center bg-white">
            <div className="w-full max-w-sm border p-6 rounded-xl">
                <Logo
                    title={step === 1 ? "Quên mật khẩu" : "Nhập OTP để đặt lại mật khẩu"} 
                />

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-3">
                        <Input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            disabled={loading}
                        />
                        <Button type="submit" loading={loading} className="w-full uppercase tracking-widest">
                            {loading ? "Đang gửi..." : "Gửi OTP"}
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleReset} className="space-y-3">
                        <Input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            disabled
                        />
                        <Input
                            name="otp"
                            value={form.otp}
                            onChange={handleChange}
                            placeholder="Nhập OTP"
                            disabled={loading}
                        />
                        <Input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            placeholder="Mật khẩu mới"
                            disabled={loading}
                        />
                        <Button type="submit" loading={loading} className="w-full uppercase tracking-widest">
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}