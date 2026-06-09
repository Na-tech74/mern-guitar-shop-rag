import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API, logoutAPI, orderAPI, userAPI } from "../../../api";

export default function useAccount() {
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

    const displayName = profile?.name || userInfo?.name;
    const displayEmail = profile?.email || userInfo?.email;
    const displayRole = profile?.role || userInfo?.role;
    const displayAvatar = profile?.avatar || userInfo?.avatar || "";
    const isAdmin = displayRole === "admin";
    const initials = displayName?.charAt(0).toUpperCase() || "U";

    return {
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
        displayRole,
        displayAvatar,
        isAdmin,
        initials,
    };
}
