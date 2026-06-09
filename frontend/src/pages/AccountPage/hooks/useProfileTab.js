import { useState, useEffect } from "react";
import { API } from "../../../api";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function useProfileTab(profile, userInfo, onSaved, showToast) {
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

    const updateField = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

    return {
        form,
        errors,
        editing,
        saving,
        setEditing,
        updateField,
        handleSave,
        handleCancel,
    };
}
