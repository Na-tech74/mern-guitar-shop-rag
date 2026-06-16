import { useState, useEffect, useCallback } from "react";
import { termsContentAPI } from "../../../api";

const defaultContent = {
    header: {
        title: "Điều khoản và Bảo mật",
        lastUpdated: "",
    },
    sections: [
        { title: "", content: "" },
    ],
};

export const useTermsContent = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(defaultContent);
    const [message, setMessage] = useState(null);

    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);
            const res = await termsContentAPI.get();
            const data = res.data?.data?.content;
            if (data) {
                setFormData({
                    header: {
                        title: data.header?.title || defaultContent.header.title,
                        lastUpdated: data.header?.lastUpdated || "",
                    },
                    sections: data.sections?.length > 0 ? data.sections : defaultContent.sections,
                });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Không thể tải nội dung!" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const updateHeader = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            header: { ...prev.header, [field]: value },
        }));
    };

    const updateSection = (index, field, value) => {
        setFormData((prev) => {
            const sections = [...prev.sections];
            sections[index] = { ...sections[index], [field]: value };
            return { ...prev, sections };
        });
    };

    const addSection = () => {
        setFormData((prev) => ({
            ...prev,
            sections: [...prev.sections, { title: "", content: "" }],
        }));
    };

    const removeSection = (index) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index),
        }));
    };

    const moveSection = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= formData.sections.length) return;
        setFormData((prev) => {
            const sections = [...prev.sections];
            [sections[index], sections[target]] = [sections[target], sections[index]];
            return { ...prev, sections };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await termsContentAPI.update(formData);
            setMessage({ type: "success", text: "Cập nhật thành công!" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Có lỗi xảy ra!",
            });
        } finally {
            setSaving(false);
        }
    };

    return {
        loading, saving, formData, message, setMessage,
        updateHeader, updateSection, addSection, removeSection, moveSection,
        handleSubmit, fetchContent,
    };
};
