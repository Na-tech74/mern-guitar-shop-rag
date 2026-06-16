import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope, faCalendarDays,
    faFileInvoice, faHeart, faShieldHalved, faRightFromBracket, faBagShopping,
    faCircleCheck, faCircleExclamation,
    faTrash, faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../helpers/formatters";
import UserAvatar from "../../components/UserAvatar.jsx";
import Breadcrumb from "../../components/Breadcrumb.jsx";
import useAccount from "./hooks/useAccount";
import ProfileTab from "./ProfileTab";
import PasswordTab from "./PasswordTab";

export default function AccountPage() {
    const {
        userInfo,
        profile,
        orders,
        activeTab,
        toast,
        uploading,
        fileInputRef,
        setActiveTab,
        fetchProfile,
        showToast,
        handleLogout,
        handleAvatarClick,
        handleAvatarChange,
        handleDeleteAvatar,
        displayName,
        displayEmail,
        displayAvatar,
        isAdmin,
        initials,
    } = useAccount();

    if (!userInfo) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

                <Breadcrumb items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Tài khoản" },
                ]} />

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
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
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

                <div className="grid lg:grid-cols-4 gap-6">
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-1.5 lg:sticky lg:top-4">
                            <nav className="flex flex-wrap lg:flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("profile")}
                                    className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${activeTab === "profile"
                                        ? "bg-amber-50 text-amber-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    Thông tin cá nhân
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("password")}
                                    className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${activeTab === "password"
                                        ? "bg-amber-50 text-amber-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    Đổi mật khẩu
                                </button>
                                <Link
                                    to="/orders"
                                    className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                                >
                                    <span className="hidden sm:inline">Đơn hàng của tôi</span>
                                    <span className="sm:hidden">Đơn hàng</span>
                                </Link>
                                <Link
                                    to="/wishlist"
                                    className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                                >
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


            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lift ${toast.type === "success"
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


