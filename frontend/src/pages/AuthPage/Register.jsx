import { Link } from "react-router-dom";
import useRegister from "../../hooks/auth/useRegister.js";

export default function Register() {
    const {
        form,
        loading,
        handleChange,
        handleSubmit
    } = useRegister();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white border border-[#e8dcc8] rounded-2xl p-8 relative overflow-hidden">

                {/* Header */}
                <div className="text-center mb-8">
                    <span className="text-3xl">🎸</span>
                    <h1 className="text-[#2c1a06] text-xl font-medium mt-1">
                        Tạo tài khoản
                    </h1>
                    <p className="text-[#a07840] text-xs tracking-widest mt-1">
                        Nam Acoustic Shop
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Họ tên"
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <button type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-[#2c1a06] text-[#f0d49a] text-xs uppercase
                         tracking-widest rounded-lg hover:opacity-85 transition" >
                        {loading
                            ? "Đang đăng ký..."
                            : "Đăng ký"}
                    </button>
                </form>

                {/* Link */}
                <p className="text-center text-xs mt-4">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-500">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}