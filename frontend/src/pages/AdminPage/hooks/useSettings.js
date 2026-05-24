import { useState } from "react";

export const useSettings = () => {
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
        { id: "profile", label: "Hồ sơ", icon: "user" },
        { id: "security", label: "Bảo mật", icon: "lock" },
        { id: "notifications", label: "Thông báo", icon: "bell" },
    ];

    return {
        activeTab,
        setActiveTab,
        formData,
        setFormData,
        userInfo,
        name,
        email,
        handleSubmit,
        tabs,
    };
};
