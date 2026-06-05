import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faBell, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useSettings } from "../hooks/useSettings";

const iconMap = {
    user: faUser,
    lock: faLock,
    bell: faBell,
};

const MessageBanner = ({ message }) => {
    if (!message) return null;
    const isError = message.type === "error";
    return (
        <div
            role="alert"
            className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
                isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700"
            }`}
        >
            <FontAwesomeIcon
                icon={isError ? faExclamationCircle : faCheckCircle}
                className="mt-0.5 shrink-0"
            />
            <span>{message.text}</span>
        </div>
    );
};

export default function Settings() {
    const {
        activeTab,
        setActiveTab,
        formData,
        setFormData,
        loading,
        message,
        setMessage,
        handleSubmit,
        tabs,
    } = useSettings();

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
                                type="button"
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMessage(null);
                                }}
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? "bg-amber-50 text-amber-700"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <FontAwesomeIcon icon={iconMap[tab.icon]} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <MessageBanner message={message} />

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        {activeTab === "profile" && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-800">Thông tin hồ sơ</h2>
                                <Input
                                    label="Tên"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <Button type="submit" variant="primary" loading={loading}>
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
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                />
                                <Input
                                    label="Mật khẩu mới"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                                <Input
                                    label="Xác nhận mật khẩu mới"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <Button type="submit" variant="primary" loading={loading}>
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
                                            className="size-4 rounded border-gray-300 text-amber-600"
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
                                            className="size-4 rounded border-gray-300 text-amber-600"
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
                                            className="size-4 rounded border-gray-300 text-amber-600"
                                        />
                                        <span className="text-sm text-gray-700">Khuyến mãi</span>
                                    </label>
                                </div>
                                <Button type="submit" variant="primary" loading={loading}>
                                    Lưu cài đặt
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
