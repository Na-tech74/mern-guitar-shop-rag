import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import AuthHeader from "../components/AuthHeader";
import AuthLink from "../components/AuthLink";
import useRegister from "../hooks/useRegister";

export default function Register() {
    const { form, loading, handleChange, handleSubmit } = useRegister();

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white border border-[#e8dcc8] rounded-2xl p-8 relative overflow-hidden">
                <AuthHeader title="Tạo tài khoản" />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Họ tên"
                        disabled={loading}
                        required
                    />

                    <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        disabled={loading}
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        disabled={loading}
                        required
                    />

                    <Button type="submit" loading={loading} className="w-full uppercase tracking-widest">
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                </form>

                <p className="text-center text-xs mt-4">
                    Đã có tài khoản? <AuthLink to="/login">Đăng nhập</AuthLink>
                </p>
            </div>
        </div>
    );
}