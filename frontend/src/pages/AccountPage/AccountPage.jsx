import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faEnvelope, faShieldHalved, faCalendarDays,
    faFileInvoice, faHeart, faKey, faRightFromBracket,
    faPenToSquare, faCheck, faXmark, faBagShopping,
    faArrowRight, faCircleCheck, faCircleExclamation,
    faEye, faEyeSlash, faCamera, faTrash, faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { API, logoutAPI, orderAPI, userAPI } from "../../api";
import { formatDate } from "../../helpers/format";
import UserAvatar from "../../components/UserAvatar.jsx";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);

const TABS = [
    { id: "profile", label: "Thông tin cá nhân", icon: faUser },
    { id: "password", label: "Đổi mật khẩu", icon: faKey },
];

export default function AccountPage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("profile");
    const [toast, setToast] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const info = JSON.parse(sessionStorage.getItem("userInfo") || "null");
        if (!info) {
            navigate("/login", { replace: true });
            return;
        }
        setUserInfo(info);
        fetchProfile();
        fetchOrders();
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/users/me");
            const data = res.data?.data;
            setProfile(data);
            if (data?.avatar !== undefined) {
                const current = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
                const updated = { ...current, avatar: data.avatar || "" };
                sessionStorage.setItem("userInfo", JSON.stringify(updated));
                window.dispatchEvent(new Event("user-info-updated"));
            }
        } catch {
            //
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await orderAPI.getMyOrders();
            setOrders(res.data?.data?.orders || []);
        } catch {
            setOrders([]);
        }
    };

    const showToast = (type, text) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3000);
    };

    const handleLogout = async () => {
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

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image")) {
            showToast("error", "Chỉ chấp nhận file ảnh");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast("error", "Ảnh tối đa 10MB");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const { data } = await userAPI.uploadAvatar(formData);

            const current = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
            const updated = { ...current, avatar: data.data.avatar };
            sessionStorage.setItem("userInfo", JSON.stringify(updated));
            window.dispatchEvent(new Event("user-info-updated"));

            await fetchProfile();
            showToast("success", "Cập nhật ảnh đại diện thành công!");
        } catch (err) {
            showToast("error", err.response?.data?.message || "Tải ảnh thất bại");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDeleteAvatar = async () => {
        setUploading(true);
        try {
            await userAPI.deleteAvatar();
            const current = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
            const updated = { ...current, avatar: "" };
            sessionStorage.setItem("userInfo", JSON.stringify(updated));
            window.dispatchEvent(new Event("user-info-updated"));
            await fetchProfile();
            showToast("success", "Đã xóa ảnh đại diện");
        } catch (err) {
            showToast("error", err.response?.data?.message || "Xóa ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    if (!userInfo) return null;

    const displayName = profile?.name || userInfo.name;
    const displayEmail = profile?.email || userInfo.email;
    const displayRole = profile?.role || userInfo.role;
    const displayAvatar = profile?.avatar || userInfo.avatar || "";
    const isAdmin = displayRole === "admin";
    const initials = displayName?.charAt(0).toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600 transition">Trang chủ</Link></li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-800 font-medium">Tài khoản</li>
                    </ol>
                </nav>

                {/* Hero / Profile Header */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-4 sm:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5">
                        <div className="relative shrink-0 group">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <div className="size-16 sm:size-24">
                                {displayAvatar ? (
                                    <img
                                        src={displayAvatar}
                                        alt={displayName}
                                        className="size-full rounded-full object-cover bg-gray-100"
                                    />
                                ) : (
                                    <div className="size-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                disabled={uploading}
                                className="
                                    absolute inset-0 flex items-center justify-center gap-1
                                    rounded-full bg-black/55 text-white text-xs font-medium
                                    opacity-0 group-hover:opacity-100
                                    transition-opacity cursor-pointer
                                    disabled:cursor-not-allowed
                                "
                                title="Đổi ảnh đại diện"
                            >
                                {uploading ? (
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-base" />
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faCamera} />
                                        <span className="hidden sm:inline">Đổi ảnh</span>
                                    </>
                                )}
                            </button>
                            {isAdmin && (
                                <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-white border border-gray-200 shadow-flat flex items-center justify-center pointer-events-none">
                                    <FontAwesomeIcon icon={faShieldHalved} className="text-amber-600 text-sm" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{displayName}</h1>
                                {isAdmin && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold w-fit mx-auto sm:mx-0">
                                        <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                                        Quản trị viên
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                                {displayEmail}
                            </p>
                            {profile?.createdAt && (
                                <p className="text-gray-400 text-xs mt-1 hidden sm:flex items-center justify-center sm:justify-start gap-2">
                                    <FontAwesomeIcon icon={faCalendarDays} className="text-[10px]" />
                                    Thành viên từ {formatDate(profile.createdAt)}
                                </p>
                            )}
                            {displayAvatar && (
                                <button
                                    type="button"
                                    onClick={handleDeleteAvatar}
                                    disabled={uploading}
                                    className="mt-2 hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                                    Xóa ảnh đại diện
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition"
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <StatCard
                        icon={faBagShopping}
                        label="Đơn hàng"
                        value={orders.length}
                        accent="amber"
                    />
                    <StatCard
                        icon={faFileInvoice}
                        label="Đang xử lý"
                        value={orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status)).length}
                        accent="blue"
                    />
                    <StatCard
                        icon={faCircleCheck}
                        label="Hoàn thành"
                        value={orders.filter((o) => o.status === "delivered" || o.status === "completed").length}
                        accent="green"
                    />
                    <StatCard
                        icon={faHeart}
                        label="Yêu thích"
                        value={JSON.parse(localStorage.getItem("wishlist") || "[]").length}
                        accent="rose"
                    />
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-4 gap-6">

                    {/* Sidebar Nav */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-1.5 lg:sticky lg:top-4">
                            <nav className="flex flex-wrap lg:flex-col gap-1">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                                            activeTab === tab.id
                                                ? "bg-amber-50 text-amber-700"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={tab.icon} className="text-[10px] sm:text-xs" />
                                        {tab.label}
                                    </button>
                                ))}
                                <Link
                                    to="/orders"
                                    className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                                >
                                    <FontAwesomeIcon icon={faFileInvoice} className="text-[10px] sm:text-xs" />
                                    <span className="hidden sm:inline">Đơn hàng của tôi</span>
                                    <span className="sm:hidden">Đơn hàng</span>
                                </Link>
                                <Link
                                    to="/wishlist"
                                    className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                                >
                                    <FontAwesomeIcon icon={faHeart} className="text-[10px] sm:text-xs" />
                                    <span className="hidden sm:inline">Yêu thích</span>
                                    <span className="sm:hidden">Thích</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition"
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} className="text-[10px]" />
                                    <span>Thoát</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {activeTab === "profile" && (
                            <ProfileTab
                                profile={profile}
                                userInfo={userInfo}
                                onSaved={fetchProfile}
                                showToast={showToast}
                            />
                        )}
                        {activeTab === "password" && (
                            <PasswordTab showToast={showToast} onChanged={handleLogout} />
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 hidden sm:grid sm:grid-cols-2 gap-4">
                    <QuickLink
                        to="/orders"
                        icon={faFileInvoice}
                        title="Lịch sử đơn hàng"
                        desc="Theo dõi tình trạng đơn hàng của bạn"
                    />
                    <QuickLink
                        to="/wishlist"
                        icon={faHeart}
                        title="Sản phẩm yêu thích"
                        desc="Danh sách đàn bạn đã lưu"
                    />
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lift ${
                        toast.type === "success"
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                    }`}>
                        <FontAwesomeIcon
                            icon={toast.type === "success" ? faCircleCheck : faCircleExclamation}
                            className="text-lg"
                        />
                        <span className="text-sm font-medium">{toast.text}</span>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

function StatCard({ icon, label, value, accent = "amber" }) {
    const accents = {
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        rose: "bg-rose-50 text-rose-600",
    };
    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-3 sm:p-4 hover:shadow-lift transition group">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className={`size-8 sm:size-10 rounded-lg ${accents[accent]} flex items-center justify-center group-hover:scale-110 transition`}>
                    <FontAwesomeIcon icon={icon} className="text-xs sm:text-sm" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-gray-500 truncate">{label}</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

function QuickLink({ to, icon, title, desc }) {
    return (
        <Link
            to={to}
            className="group flex items-center gap-3 sm:gap-4 bg-white rounded-xl shadow-soft border border-gray-100 p-3 sm:p-4 hover:shadow-lift hover:border-amber-200 transition"
        >
            <div className="size-10 sm:size-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition">
                <FontAwesomeIcon icon={icon} className="text-base sm:text-lg" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 truncate">{desc}</p>
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition" />
        </Link>
    );
}

function ProfileTab({ profile, userInfo, onSaved, showToast }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: profile?.name || userInfo?.name || "",
        email: profile?.email || userInfo?.email || "",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm({
            name: profile?.name || userInfo?.name || "",
            email: profile?.email || userInfo?.email || "",
        });
    }, [profile, userInfo]);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Vui lòng nhập họ tên";
        else if (form.name.trim().length < 2) errs.name = "Họ tên phải có ít nhất 2 ký tự";
        if (!form.email.trim()) errs.email = "Vui lòng nhập email";
        else if (!isValidEmail(form.email)) errs.email = "Email không hợp lệ";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const res = await API.put("/users/me", {
                name: form.name.trim(),
                email: form.email.trim(),
            });
            const updated = res.data?.data;
            if (updated) {
                const newInfo = {
                    name: updated.name,
                    email: updated.email,
                    role: updated.role || userInfo.role,
                    avatar: updated.avatar !== undefined ? updated.avatar : (userInfo.avatar || ""),
                };
                sessionStorage.setItem("userInfo", JSON.stringify(newInfo));
                window.dispatchEvent(new Event("user-info-updated"));
            }
            setEditing(false);
            onSaved?.();
            showToast("success", "Cập nhật thông tin thành công!");
        } catch (err) {
            showToast("error", err.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            name: profile?.name || userInfo?.name || "",
            email: profile?.email || userInfo?.email || "",
        });
        setErrors({});
        setEditing(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Cập nhật thông tin của bạn</p>
                </div>
                {!editing && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-medium transition"
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                        Chỉnh sửa
                    </button>
                )}
            </div>

            <div className="p-4 sm:p-5 space-y-4">
                <Field
                    label="Họ và tên"
                    icon={faUser}
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    error={errors.name}
                    disabled={!editing}
                />
                <Field
                    label="Email"
                    icon={faEnvelope}
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    error={errors.email}
                    disabled={!editing}
                />
                <Field
                    label="Vai trò"
                    icon={faShieldHalved}
                    value={profile?.role === "admin" || userInfo?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    disabled
                />
                {profile?.createdAt && (
                    <Field
                        label="Ngày tham gia"
                        icon={faCalendarDays}
                        value={formatDate(profile.createdAt)}
                        disabled
                    />
                )}
            </div>

            {editing && (
                <div className="flex items-center justify-end gap-2 p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-medium transition disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-xs" />
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition disabled:opacity-50"
                    >
                        {saving ? (
                            <span className="size-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        ) : (
                            <FontAwesomeIcon icon={faCheck} className="text-xs" />
                        )}
                        Lưu thay đổi
                    </button>
                </div>
            )}
        </div>
    );
}

function PasswordTab({ showToast, onChanged }) {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.currentPassword) errs.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
        if (!form.newPassword) errs.newPassword = "Vui lòng nhập mật khẩu mới";
        else if (!isValidPassword(form.newPassword))
            errs.newPassword = "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường và số";
        if (!form.confirmPassword) errs.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
        else if (form.newPassword !== form.confirmPassword)
            errs.confirmPassword = "Mật khẩu xác nhận không khớp";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            await API.put("/users/password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            showToast("success", "Đổi mật khẩu thành công! Đang đăng xuất...");
            setTimeout(() => onChanged?.(), 1500);
        } catch (err) {
            showToast("error", err.response?.data?.message || "Đổi mật khẩu thất bại");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h2>
                <p className="text-sm text-gray-500 mt-0.5">Sau khi đổi, bạn sẽ được đăng xuất và cần đăng nhập lại</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
                <PasswordField
                    label="Mật khẩu hiện tại"
                    value={form.currentPassword}
                    onChange={(v) => setForm({ ...form, currentPassword: v })}
                    error={errors.currentPassword}
                    show={showCurrent}
                    onToggle={() => setShowCurrent(!showCurrent)}
                />
                <PasswordField
                    label="Mật khẩu mới"
                    value={form.newPassword}
                    onChange={(v) => setForm({ ...form, newPassword: v })}
                    error={errors.newPassword}
                    show={showNew}
                    onToggle={() => setShowNew(!showNew)}
                    hint="Ít nhất 8 ký tự, có chữ hoa, chữ thường và số"
                />
                <PasswordField
                    label="Xác nhận mật khẩu mới"
                    value={form.confirmPassword}
                    onChange={(v) => setForm({ ...form, confirmPassword: v })}
                    error={errors.confirmPassword}
                    show={showNew}
                    onToggle={() => setShowNew(!showNew)}
                />

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition disabled:opacity-50 shadow-soft"
                    >
                        {saving ? (
                            <span className="size-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        ) : (
                            <FontAwesomeIcon icon={faKey} className="text-xs" />
                        )}
                        Đổi mật khẩu
                    </button>
                </div>
            </form>
        </div>
    );
}

function Field({ label, icon, value, onChange, error, disabled, type = "text" }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FontAwesomeIcon icon={icon} className="text-sm" />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-lg border text-sm transition ${
                        error
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : disabled
                                ? "bg-gray-50 border-gray-200 text-gray-500"
                                : "bg-white border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    } outline-none disabled:cursor-not-allowed`}
                />
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

function PasswordField({ label, value, onChange, error, show, onToggle, hint }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faKey} className="text-sm" />
                </div>
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm transition outline-none ${
                        error
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "bg-white border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    }`}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                >
                    <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="text-sm" />
                </button>
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
    );
}
