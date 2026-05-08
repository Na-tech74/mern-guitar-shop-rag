import { Link } from "react-router-dom";
import useLogin from "../../hooks/auth/useLogin";
export default function Login() {
    const { form, loading, handleChange, handleLogin } = useLogin();
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white border border-[#e8dcc8] rounded-2xl p-8 relative overflow-hidden">

                {/* Header */}
                <div className="text-center mb-8">
                    <span className="text-3xl">🎸</span>
                    <h1 className="text-[#2c1a06] text-xl font-medium mt-1">Đăng nhập</h1>
                    <p className="text-[#a07840] text-xs tracking-widest mt-1">Nam Acoustic Shop</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-4">

                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Email"
                        className="w-full border px-4 py-2"
                    />

                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        className="w-full border px-4 py-2"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-[#2c1a06] text-[#f0d49a] text-xs uppercase tracking-widest rounded-lg hover:opacity-85 transition"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                {/* Link đúng */}
                <p className="text-center text-xs mt-4">
                    Chưa có tài khoản? {" "}
                    <Link to="/register" className="text-blue-500">
                        Đăng ký
                    </Link>
                </p><p className="text-center text-xs mt-2">
                    Quên mật khẩu? {" "}
                    <Link to="/forgot-password" className="text-blue-500">
                        Lấy lại mật khẩu
                    </Link>
                </p>
            </div>
        </div>
    );
}