import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import AuthHeader from "../components/AuthHeader";
import AuthLink from "../components/AuthLink";
import useLogin from "../hooks/useLogin";
export default function Login() {
    const { form, loading, handleChange, handleLogin} = useLogin();
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white border border-[#e8dcc8] rounded-2xl p-8 relative overflow-hidden">
            
                <AuthHeader/>

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        disabled={loading}
                    />

                    <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        disabled={loading}
                    />

                    <Button type="submit" loading={loading} className="w-full uppercase tracking-widest">
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                </form>

                <p className="text-center text-xs mt-4">
                    Chưa có tài khoản? <AuthLink to="/register">Đăng ký</AuthLink>
                </p>
                <p className="text-center text-xs mt-2">
                    Quên mật khẩu? <AuthLink to="/forgot-password">Lấy lại mật khẩu</AuthLink>
                </p>
            </div>
        </div>
    );
}