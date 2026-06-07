import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faRightFromBracket,
    faChevronDown,
    faCamera,
    faTrash,
    faGear,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useUserInfo } from "../../../hooks/useUserInfo.js";
import { logoutAPI, userAPI } from "../../../api";
import UserAvatar from "../../../components/UserAvatar.jsx";

const PAGE_TITLES = {
    admin: "Bảng điều khiển",
    "home-content": "Trang chủ",
    "about-content": "Giới thiệu",
    products: "Sản phẩm",
    orders: "Đơn hàng",
    users: "Người dùng",
    categories: "Danh mục",
    courses: "Khóa học",
    blog: "Blog",
    settings: "Cài đặt",
};

function usePageTitle() {
    const { pathname } = useLocation();
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] || "admin";
    return PAGE_TITLES[last] || last;
}

export default function AdminHeader({ toggleMobileSidebar }) {
    const navigate = useNavigate();
    const userInfo = useUserInfo();
    const title = usePageTitle();
    const [menuOpen, setMenuOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);

    const handleLogout = async () => {
        setMenuOpen(false);
        try {
            await logoutAPI();
        } catch {
            // ignore
        }
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("token");
        window.dispatchEvent(new Event("user-info-updated"));
        navigate("/");
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image")) {
            setError("Chỉ chấp nhận file ảnh");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("Ảnh tối đa 10MB");
            return;
        }

        setError("");
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const { data } = await userAPI.uploadAvatar(formData);

            const current = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
            const updated = { ...current, avatar: data.data.avatar };
            sessionStorage.setItem("userInfo", JSON.stringify(updated));
            window.dispatchEvent(new Event("user-info-updated"));
        } catch (err) {
            setError(err.response?.data?.message || "Tải ảnh thất bại");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDeleteAvatar = async () => {
        setUploading(true);
        setError("");
        try {
            await userAPI.deleteAvatar();
            const current = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
            const updated = { ...current, avatar: "" };
            sessionStorage.setItem("userInfo", JSON.stringify(updated));
            window.dispatchEvent(new Event("user-info-updated"));
        } catch (err) {
            setError(err.response?.data?.message || "Xóa ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    const userName = userInfo?.name || "Admin";
    const userRole = userInfo?.role === "admin" ? "Quản trị viên" : "Người dùng";

    return (
        <header className="sticky top-0 z-30 h-[60px] bg-white border-b border-gray-200">
            <div className="flex h-full items-center gap-3 px-4">
                <button
                    type="button"
                    onClick={toggleMobileSidebar}
                    className="flex size-9 items-center justify-center rounded text-gray-700 hover:bg-gray-100 lg:hidden"
                    aria-label="Mở menu"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>

                <h1 className="text-base font-semibold text-gray-800 truncate">{title}</h1>

                <div ref={menuRef} className="ml-auto relative">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        className={`
                            flex items-center gap-2 rounded-full py-1 pl-1 pr-2
                            transition-colors
                            ${menuOpen ? "bg-gray-100" : "hover:bg-gray-100"}
                        `}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                    >
                        <UserAvatar user={userInfo} size="sm" />
                        <span className="hidden text-sm font-medium text-gray-700 sm:inline max-w-[140px] truncate">
                            {userName}
                        </span>
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`hidden text-[10px] text-gray-400 transition-transform sm:inline ${
                                menuOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {menuOpen && (
                        <div
                            role="menu"
                            className="
                                absolute right-0 top-full mt-2 w-64
                                rounded-xl border border-gray-200 bg-white shadow-lg
                                overflow-hidden
                            "
                        >
                            {/* USER INFO + AVATAR UPLOAD */}
                            <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100">
                                <div className="relative shrink-0 group">
                                    <UserAvatar user={userInfo} size="lg" />
                                    <button
                                        type="button"
                                        onClick={handleAvatarClick}
                                        disabled={uploading}
                                        className="
                                            absolute inset-0 flex items-center justify-center
                                            rounded-full bg-black/50 text-white
                                            opacity-0 group-hover:opacity-100
                                            transition-opacity cursor-pointer
                                            disabled:cursor-not-allowed
                                        "
                                        title="Đổi ảnh đại diện"
                                    >
                                        {uploading ? (
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                        ) : (
                                            <FontAwesomeIcon icon={faCamera} />
                                        )}
                                    </button>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {userName}
                                    </p>
                                    <p className="truncate text-xs text-gray-500">{userRole}</p>
                                </div>
                            </div>

                            {error && (
                                <div className="px-3 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">
                                    {error}
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />

                            {/* AVATAR ACTIONS */}
                            <div className="py-1">
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    disabled={uploading}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    role="menuitem"
                                >
                                    <FontAwesomeIcon icon={faCamera} className="text-base text-gray-400" />
                                    <span>{userInfo?.avatar ? "Đổi ảnh đại diện" : "Tải ảnh lên"}</span>
                                </button>
                                {userInfo?.avatar && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteAvatar}
                                        disabled={uploading}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                        role="menuitem"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-base text-gray-400" />
                                        <span>Xóa ảnh hiện tại</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setMenuOpen(false); navigate("/admin/settings"); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    role="menuitem"
                                >
                                    <FontAwesomeIcon icon={faGear} className="text-base text-gray-400" />
                                    <span>Cài đặt</span>
                                </button>
                            </div>

                            <div className="border-t border-gray-100 py-1">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    role="menuitem"
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} className="text-base" />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
