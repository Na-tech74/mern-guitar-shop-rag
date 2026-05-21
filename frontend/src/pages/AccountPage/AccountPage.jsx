import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileInvoice, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function AccountPage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const info = JSON.parse(localStorage.getItem("userInfo") || "null");
        if (!info) {
            navigate("/login", { replace: true });
            return;
        }
        setUserInfo(info);
    }, [navigate]);

    if (!userInfo) return null;

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Tài khoản</li>
                    </ol>
                </nav>

                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                            {userInfo.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{userInfo.name}</h1>
                            <p className="text-gray-500">{userInfo.email}</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: faUser, title: "Thông tin tài khoản", desc: "Xem và chỉnh sửa thông tin cá nhân", link: "/account" },
                        { icon: faFileInvoice, title: "Đơn hàng của tôi", desc: "Theo dõi lịch sử đơn hàng", link: "/orders" },
                        { icon: faSignOutAlt, title: "Đăng xuất", desc: "Đăng xuất khỏi tài khoản", link: "#", onClick: handleLogout, danger: true },
                    ].map((item, i) => (
                        <div key={i} onClick={item.onClick} className="cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                            <div className={`w-12 h-12 rounded-lg ${item.danger ? "bg-red-100" : "bg-amber-100"} flex items-center justify-center mb-4`}>
                                <FontAwesomeIcon icon={item.icon} className={`text-xl ${item.danger ? "text-red-600" : "text-amber-600"}`} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
