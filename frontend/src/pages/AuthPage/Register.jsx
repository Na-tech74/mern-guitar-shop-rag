import { useState } from "react";
import { Link } from "react-router-dom";
import { registerAPI } from "../../api/authAPI";
export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await registerAPI(form);
            alert("Đăng ký thành công");

            // reset form
            setForm({
                name: "",
                email: "",
                password: ""
            });

            console.log(res.data);

        } catch (err) {
            alert(err.response?.data?.message || "Lỗi server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white border border-[#e8dcc8] rounded-2xl p-8 relative overflow-hidden">
                {/* Header */}
                <div className="text-center mb-8">
                    <span className="text-3xl">🎸</span>
                    <h1 className="text-[#2c1a06] text-xl font-medium mt-1">Tạo tài khoản</h1>
                    <p className="text-[#a07840] text-xs tracking-widest mt-1">Nam Acoustic Shop</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#a07840] mb-1.5">Họ tên</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Nguyễn Văn A"
                            className="w-full bg-[#faf8f4] border border-[#ddd0b8] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#c8922a]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#a07840] mb-1.5">Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="ban@email.com"
                            className="w-full bg-[#faf8f4] border border-[#ddd0b8] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#c8922a]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#a07840] mb-1.5">Mật khẩu</label>
                        <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#faf8f4] border border-[#ddd0b8] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#c8922a]"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-[#2c1a06] text-[#f0d49a] text-xs uppercase tracking-widest rounded-lg hover:opacity-85 transition"
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>

                {/* Link */}
                <p className="text-center text-xs text-[#b0987a] mt-4">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-[#c8922a] hover:underline">
                        Đăng nhập
                    </Link>
                </p>

                {/* Viền dưới */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-25"
                    style={{ background: "repeating-linear-gradient(90deg, #c8922a 0px, #c8922a 1px, transparent 1px, transparent 32px)" }}
                />
            </div>
        </div>
    );
}