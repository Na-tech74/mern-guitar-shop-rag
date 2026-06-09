import { useState } from "react";
import { API } from "../../../api";

const isValidPassword = (p) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(p);

export default function usePasswordTab(showToast, onChanged) {
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

    const updateField = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

    return {
        form,
        errors,
        saving,
        showCurrent,
        showNew,
        setShowCurrent,
        setShowNew,
        updateField,
        handleSubmit,
    };
}
