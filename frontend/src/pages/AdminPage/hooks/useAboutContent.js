import { useState, useEffect, useCallback } from "react";
import { aboutContentAPI } from "../../../api";

const defaultStoryImages = [
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1555638138-cf515f3f0d6b?w=800&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
];

const defaultContent = {
    header: { breadcrumbLabel: "Giới thiệu" },
    intro: { tagline: "" },
    story: {
        title: "",
        content: "",
        images: [...defaultStoryImages],
    },
    stats: {
        items: [
            { value: "", label: "" },
            { value: "", label: "" },
            { value: "", label: "" },
            { value: "", label: "" },
        ]
    },
    team: {
        title: "",
        subtitle: "",
        members: [
            { name: "", role: "", avatar: "", bio: "" },
            { name: "", role: "", avatar: "", bio: "" },
            { name: "", role: "", avatar: "", bio: "" },
            { name: "", role: "", avatar: "", bio: "" },
        ]
    },
    commitments: {
        title: "",
        subtitle: "",
        items: [
            { icon: "music", title: "", description: "" },
            { icon: "music", title: "", description: "" },
            { icon: "music", title: "", description: "" },
        ]
    }
};

const iconOptions = [
    { value: "music", label: "Âm nhạc" },
    { value: "award", label: "Chất lượng" },
    { value: "users", label: "Đội ngũ" },
    { value: "guitar", label: "Guitar" },
    { value: "headset", label: "Hỗ trợ" },
    { value: "gift", label: "Quà tặng" },
    { value: "shield", label: "Bảo hành" },
    { value: "star", label: "Sao" },
    { value: "heart", label: "Yêu thích" },
    { value: "tag", label: "Tag" },
    { value: "leaf", label: "Lá" },
];

export function useAboutContent() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(defaultContent);
    const [message, setMessage] = useState(null);

    const fetchContent = useCallback(async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await aboutContentAPI.get();
            const data = res.data?.data?.content;
            if (data) {
                setFormData({
                    header: {
                        breadcrumbLabel: data.header?.breadcrumbLabel ?? "Giới thiệu",
                    },
                    intro: {
                        tagline: data.intro?.tagline ?? "",
                    },
                    story: {
                        title: data.story?.title ?? "",
                        content: data.story?.content ?? "",
                        images: data.story?.images?.length
                            ? data.story.images
                            : defaultContent.story.images,
                    },
                    stats: {
                        items: data.stats?.items?.length
                            ? data.stats.items
                            : defaultContent.stats.items,
                    },
                    team: {
                        title: data.team?.title ?? "",
                        subtitle: data.team?.subtitle ?? "",
                        members: data.team?.members?.length
                            ? data.team.members
                            : defaultContent.team.members,
                    },
                    commitments: {
                        title: data.commitments?.title ?? "",
                        subtitle: data.commitments?.subtitle ?? "",
                        items: data.commitments?.items?.length
                            ? data.commitments.items
                            : defaultContent.commitments.items,
                    },
                });
            }
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || err.message || "Không thể tải nội dung trang giới thiệu!",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const updateHeader = (field, value) => {
        setFormData((prev) => ({ ...prev, header: { ...prev.header, [field]: value } }));
    };

    const updateIntro = (field, value) => {
        setFormData((prev) => ({ ...prev, intro: { ...prev.intro, [field]: value } }));
    };

    const updateStory = (field, value) => {
        setFormData((prev) => ({ ...prev, story: { ...prev.story, [field]: value } }));
    };

    const updateStoryImage = (index, value) => {
        setFormData((prev) => {
            const images = [...prev.story.images];
            images[index] = value;
            return { ...prev, story: { ...prev.story, images } };
        });
    };

    const updateStat = (index, field, value) => {
        setFormData((prev) => {
            const items = [...prev.stats.items];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, stats: { items } };
        });
    };

    const updateTeamMeta = (field, value) => {
        setFormData((prev) => ({ ...prev, team: { ...prev.team, [field]: value } }));
    };

    const updateMember = (index, field, value) => {
        setFormData((prev) => {
            const members = [...prev.team.members];
            members[index] = { ...members[index], [field]: value };
            return { ...prev, team: { ...prev.team, members } };
        });
    };

    const updateCommitmentsMeta = (field, value) => {
        setFormData((prev) => ({ ...prev, commitments: { ...prev.commitments, [field]: value } }));
    };

    const updateCommitment = (index, field, value) => {
        setFormData((prev) => {
            const items = [...prev.commitments.items];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, commitments: { items } };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await aboutContentAPI.update(formData);
            setMessage({ type: "success", text: "Lưu nội dung trang giới thiệu thành công!" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || err.message || "Có lỗi xảy ra, vui lòng thử lại!",
            });
        } finally {
            setSaving(false);
        }
    };

    return {
        loading,
        saving,
        formData,
        message,
        setMessage,
        iconOptions,
        handlers: {
            updateHeader,
            updateIntro,
            updateStory,
            updateStoryImage,
            updateStat,
            updateTeamMeta,
            updateMember,
            updateCommitmentsMeta,
            updateCommitment,
        },
        handleSubmit,
    };
}
