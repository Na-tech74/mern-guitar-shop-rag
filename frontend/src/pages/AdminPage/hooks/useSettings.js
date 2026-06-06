import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../../api";

const getInitialFormData = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    return {
        name: userInfo.name || "",
        email: userInfo.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        notifications: {
            email: true,
            order: true,
            promotion: false,
        },
    };
};

export const useSettings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState(getInitialFormData);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (activeTab === "profile") {
                const res = await userAPI.updateMyProfile({
                    name: formData.name,
                    email: formData.email,
                });
                const updated = res.data.data;
                const current = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
                sessionStorage.setItem("userInfo", JSON.stringify({
                    ...current,
                    name: updated.name,
                    email: updated.email,
                }));
                window.dispatchEvent(new Event("user-info-updated"));
                setFormData((prev) => ({ ...prev, name: updated.name, email: updated.email }));
                setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
            } else if (activeTab === "security") {
                if (!formData.currentPassword || !formData.newPassword) {
                    throw new Error("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới!");
                }
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error("Mật khẩu xác nhận không khớp!");
                }
                await userAPI.changePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                });
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("userInfo");
                navigate("/login", { replace: true });
            } else if (activeTab === "notifications") {
                localStorage.setItem(
                    "notificationSettings",
                    JSON.stringify(formData.notifications)
                );
                setMessage({ type: "success", text: "Đã lưu cài đặt thông báo!" });
            }
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || err.message || "Có lỗi xảy ra, vui lòng thử lại!",
            });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Hồ sơ", icon: "user" },
        { id: "security", label: "Bảo mật", icon: "lock" },
        { id: "notifications", label: "Thông báo", icon: "bell" },
    ];

    return {
        activeTab,
        setActiveTab,
        formData,
        setFormData,
        loading,
        message,
        setMessage,
        handleSubmit,
        tabs,
    };
};
