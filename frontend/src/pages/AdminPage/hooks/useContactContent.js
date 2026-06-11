import { useState, useEffect, useCallback } from "react";
import { contactContentAPI } from "../../../api";

const defaultContent = {
    header: {
        title: "Liên hệ với chúng tôi",
        subtitle: "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn",
    },
    contactInfo: [
        { icon: "map", label: "Địa chỉ", value: "" },
        { icon: "phone", label: "Điện thoại", value: "" },
        { icon: "email", label: "Email", value: "" },
        { icon: "clock", label: "Giờ làm việc", value: "" },
    ],
    socialLinks: { facebook: "", instagram: "", youtube: "" },
    mapEmbedUrl: "",
};

export function useContactContent() {
    const [content, setContent] = useState(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        contactContentAPI.get()
            .then(res => {
                const data = res.data?.data?.content;
                if (data) setContent(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const update = useCallback((path, value) => {
        setContent(prev => {
            const keys = path.split(".");
            const newContent = { ...prev };
            let obj = newContent;
            for (let i = 0; i < keys.length - 1; i++) {
                obj = { ...obj, [keys[i]]: { ...obj[keys[i]] } };
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return newContent;
        });
        setMessage(null);
    }, []);

    const updateContactInfo = useCallback((index, key, value) => {
        setContent(prev => {
            const newContent = { ...prev };
            const arr = [...newContent.contactInfo];
            arr[index] = { ...arr[index], [key]: value };
            newContent.contactInfo = arr;
            return newContent;
        });
        setMessage(null);
    }, []);

    const save = useCallback(async () => {
        setSaving(true);
        setMessage(null);
        try {
            await contactContentAPI.update(content);
            setMessage({ type: "success", text: "Cập nhật trang liên hệ thành công!" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Cập nhật thất bại!" });
        } finally {
            setSaving(false);
        }
    }, [content]);

    return { content, loading, saving, message, update, updateContactInfo, save };
}
