import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileInvoice, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../api/axiosClient.js";

export default function AccountPage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [profile, setProfile] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const info = JSON.parse(sessionStorage.getItem("userInfo") || "null");
        if (!info) {
            navigate("/login", { replace: true });
            return;
        }
        setUserInfo(info);
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/users/me");
            setProfile(res.data?.data);
        } catch {
            //
        }
    };
    
    if (!userInfo) return null;

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

                {/* <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                            {(profile?.name || userInfo.name)?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{profile?.name || userInfo.name}</h1>
                            <p className="text-gray-500">{profile?.email || userInfo.email}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {profile?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                            </p>
                        </div>
                    </div>
                </div> */}

                <div className="grid md:grid-cols-3 gap-6">
                    <button type="button" onClick={() => setShowInfo(!showInfo)} className="text-left bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                        <div className="size-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faUser} className="text-xl text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Thông tin tài khoản</h3>
                        <p className="text-sm text-gray-500">Xem thông tin cá nhân</p>
                    </button>
                    <Link to="/orders" className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                        <div className="size-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faFileInvoice} className="text-xl text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Đơn hàng của tôi</h3>
                        <p className="text-sm text-gray-500">Theo dõi lịch sử đơn hàng</p>
                    </Link>
                </div>

                {showInfo && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex gap-2">
                                <span className="font-medium w-20">Họ tên:</span>
                                <span>{profile?.name || userInfo.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium w-20">Email:</span>
                                <span>{profile?.email || userInfo.email}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium w-20">Vai trò:</span>
                                <span>{profile?.role === "admin" ? "Quản trị viên" : "Người dùng"}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}