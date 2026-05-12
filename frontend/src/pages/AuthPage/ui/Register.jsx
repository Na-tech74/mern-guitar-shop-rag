import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useRegister from "../hooks/useRegister";
import Logo from "../../../components/Logo";
import AuthLink from "../components/AuthLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
    const { form, errors, loading, handleChange, handleSubmit } = useRegister();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-amber-50 to-gray-100">
            <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl shadow-amber-100/50">

                <div className="flex justify-center mb-6">
                    <Logo />
                </div>
                
                {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                        <FontAwesomeIcon icon={faExclamationCircle} />
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Họ tên"
                        disabled={loading}
                        error={errors.name}
                        required
                    />

                    <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        disabled={loading}
                        error={errors.email}
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mật khẩu"
                        disabled={loading}
                        error={errors.password}
                        required
                    />

                    <Button type="submit" loading={loading} className="w-full">
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                    
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Đã có tài khoản? <AuthLink to="/login">Đăng nhập</AuthLink>
                    </p>
                </div>
            </div>
        </div>
    );
}