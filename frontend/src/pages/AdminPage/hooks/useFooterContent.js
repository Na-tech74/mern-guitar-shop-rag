import { useState, useEffect, useCallback } from "react";
import { footerContentAPI } from "../../../api";

const defaultContent = {
    description: "",
    socialLinks: { facebook: "", instagram: "", youtube: "", tiktok: "" },
    contactInfo: { address: "", phone: "", email: "", hours: "" },
    categories: [
        { label: "", path: "" },
        { label: "", path: "" },
        { label: "", path: "" },
        { label: "", path: "" },
        { label: "", path: "" },
    ],
    supportLinks: [
        { label: "", path: "" },
        { label: "", path: "" },
        { label: "", path: "" },
        { label: "", path: "" },
        { label: "", path: "" },
    ],
    bottomBar: {
        copyrightText: "",
        showTerms: true,
        showPrivacy: true,
    },
};

export function useFooterContent() {
    const [content, setContent] = useState(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        footerContentAPI.get()
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

    const updateArrayItem = useCallback((path, index, key, value) => {
        setContent(prev => {
            const newContent = { ...prev };
            const arr = [...newContent[path]];
            arr[index] = { ...arr[index], [key]: value };
            newContent[path] = arr;
            return newContent;
        });
        setMessage(null);
    }, []);

    const addArrayItem = useCallback((path, template) => {
        setContent(prev => {
            const newContent = { ...prev };
            newContent[path] = [...newContent[path], { ...template }];
            return newContent;
        });
    }, []);

    const removeArrayItem = useCallback((path, index) => {
        setContent(prev => {
            const newContent = { ...prev };
            newContent[path] = newContent[path].filter((_, i) => i !== index);
            return newContent;
        });
    }, []);

    const save = useCallback(async () => {
        setSaving(true);
        setMessage(null);
        try {
            await footerContentAPI.update(content);
            setMessage({ type: "success", text: "Cập nhật footer thành công!" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Cập nhật thất bại!" });
        } finally {
            setSaving(false);
        }
    }, [content]);

    return { content, loading, saving, message, update, updateArrayItem, addArrayItem, removeArrayItem, save };
}
