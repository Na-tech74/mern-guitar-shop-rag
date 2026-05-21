import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useLogin from "../hooks/useLogin";
import Logo from "../../../components/Logo";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
    const { form, errors, loading, handleChange, handleLogin } = useLogin();
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white to-gray-100">
            <div className="w-full max-w-sm  rounded-2xl p-8 shadow-2xl">

                <Link to="/" className="flex justify-center mb-6">
                    <Logo />
                </Link>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                        <FontAwesomeIcon icon={faExclamationCircle} />
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        disabled={loading}
                        error={errors.email}
                    />

                    <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mật khẩu"
                        disabled={loading}
                        error={errors.password}
                    />

                    <div className="text-right text-sm ">
                        <Link to ="/forgot-password" className="text-gray-500 hover:text-blue-600" >
                            Quên mật khẩu?
                        </Link>
                    </div>
                     
                    <Button type="submit" loading={loading} className="w-full">
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Chưa có tài khoản? 
                     <Link to="/register" className=" hover:text-blue-600" >
                           Đăng ký ngay
                     </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}