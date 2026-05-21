import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faBell } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        notifications: {
            email: true,
            order: true,
            promotion: false,
        }
    });

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const name = userInfo?.name || "";
    const email = userInfo?.email || "";

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Cập nhật thành công!");
    };

    const tabs = [
        { id: "profile", label: "Hồ sơ", icon: faUser },
        { id: "security", label: "Bảo mật", icon: faLock },
        { id: "notifications", label: "Thông báo", icon: faBell },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
                <p className="text-gray-500">Quản lý cài đặt tài khoản</p>
            </div>

            <div className="flex gap-6">
                <div className="w-48 shrink-0">
                    <div className="rounded-xl bg-white p-2 shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? "bg-amber-50 text-amber-700"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <FontAwesomeIcon icon={tab.icon} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 rounded-xl bg-white p-6 shadow-sm">
                    {activeTab === "profile" && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800">Thông tin hồ sơ</h2>
                            <Input
                                label="Tên"
                                defaultValue={name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <Input
                                label="Email"
                                type="email"
                                defaultValue={email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Button type="submit" variant="primary">
                                Lưu thay đổi
                            </Button>
                        </form>
                    )}

                    {activeTab === "security" && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800">Đổi mật khẩu</h2>
                            <Input
                                label="Mật khẩu hiện tại"
                                type="password"
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            />
                            <Input
                                label="Mật khẩu mới"
                                type="password"
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            />
                            <Input
                                label="Xác nhận mật khẩu mới"
                                type="password"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            <Button type="submit" variant="primary">
                                Cập nhật mật khẩu
                            </Button>
                        </form>
                    )}

                    {activeTab === "notifications" && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800">Cài đặt thông báo</h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            notifications: { ...formData.notifications, email: e.target.checked }
                                        })}
                                        className="h-4 w-4 rounded border-gray-300 text-amber-600"
                                    />
                                    <span className="text-sm text-gray-700">Thông báo qua email</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications.order}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            notifications: { ...formData.notifications, order: e.target.checked }
                                        })}
                                        className="h-4 w-4 rounded border-gray-300 text-amber-600"
                                    />
                                    <span className="text-sm text-gray-700">Thông báo đơn hàng mới</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications.promotion}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            notifications: { ...formData.notifications, promotion: e.target.checked }
                                        })}
                                        className="h-4 w-4 rounded border-gray-300 text-amber-600"
                                    />
                                    <span className="text-sm text-gray-700">Khuyến mãi</span>
                                </label>
                            </div>
                            <Button type="submit" variant="primary">
                                Lưu cài đặt
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}