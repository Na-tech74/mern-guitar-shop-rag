import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInfoCircle,
    faCheckCircle,
    faExclamationCircle,
    faArrowUp,
    faArrowDown,
    faEye,
    faUpload,
    faTimes,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import { useAboutContent } from "./hooks/useAboutContent";
import { aboutContentAPI } from "../../api";

const MessageBanner = ({ message }) => {
    if (!message) return null;
    const isError = message.type === "error";
    return (
        <div
            role="alert"
            className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${isError
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

const SectionTitle = ({ children, hint }) => (
    <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{children}</h3>
        {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
);

const ImageUploader = ({ value, onChange, alt = "", height = "h-32" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chọn file ảnh!");
            return;
        }
        setError(null);
        setUploading(true);
        try {
            const res = await aboutContentAPI.uploadImage(file);
            const url = res.data?.data?.url;
            if (url) {
                onChange(url);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Upload thất bại!");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    if (uploading) {
        return (
            <div className={`flex ${height} w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 text-gray-800 text-sm`}>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Đang tải ảnh lên...
            </div>
        );
    }

    if (!value) {
        return (
            <div>
                <label className={`flex ${height} w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 text-sm hover:border-amber-500 hover:bg-gray-100 transition-colors`}>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="hidden"
                    />
                    <FontAwesomeIcon icon={faUpload} className="mr-2" /> Click để tải ảnh lên
                </label>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div>
            <div className="relative">
                <img
                    src={value}
                    alt={alt}
                    className={`${height} w-200 h-200 rounded-lg object-cover border border-gray-200`}
                    loading="lazy"
                />
                <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow"
                    title="Xóa ảnh"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                </button>
            </div>
            <label className="mt-2 inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-800 cursor-pointer">
                <FontAwesomeIcon icon={faUpload} />
                Thay ảnh khác
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                />
            </label>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default function AboutContent() {
    const {
        loading,
        saving,
        formData,
        message,
        iconOptions,
        handlers,
        handleSubmit,
    } = useAboutContent();

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-gray-700" />
                        Quản lý Trang Giới thiệu
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Chỉnh sửa toàn bộ nội dung hiển thị trên trang /about
                    </p>
                </div>
                <Link
                    to="/about"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                    <FontAwesomeIcon icon={faEye} /> Xem trang giới thiệu
                </Link>
            </div>

            <MessageBanner message={message} />

            <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm space-y-8">
                <HeaderSection formData={formData} handlers={handlers} />
                <IntroSection formData={formData} handlers={handlers} />
                <StorySection formData={formData} handlers={handlers} />
                <StatsSection formData={formData} handlers={handlers} />
                <TeamSection formData={formData} handlers={handlers} />
                <CommitmentsSection formData={formData} handlers={handlers} iconOptions={iconOptions} />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button type="submit" variant="primary" loading={saving}>
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </div>
    );
}

const HeaderSection = ({ formData, handlers }) => {
    return (
        <div className="space-y-4">
            <SectionTitle hint="Breadcrumb hiển thị ở đầu trang giới thiệu.">
                Breadcrumb
            </SectionTitle>
            <Input
                label="Nhãn breadcrumb (vd: Giới thiệu)"
                value={formData.header.breadcrumbLabel}
                onChange={(e) => handlers.updateHeader("breadcrumbLabel", e.target.value)}
            />
        </div>
    );
};

const IntroSection = ({ formData, handlers }) => {
    return (
        <div className="space-y-4">
            <SectionTitle hint="Tagline ngắn hiển thị dưới logo ở đầu trang.">
                Tagline
            </SectionTitle>
            <Textarea
                label="Tagline"
                rows={2}
                value={formData.intro.tagline}
                onChange={(e) => handlers.updateIntro("tagline", e.target.value)}
            />
        </div>
    );
};

const StorySection = ({ formData, handlers }) => {
    return (
        <div className="space-y-4">
            <SectionTitle hint="Phần 'Câu chuyện' - 1 đoạn văn và grid 2x2 ảnh (4 ảnh).">
                Câu chuyện
            </SectionTitle>
            <Input
                label="Tiêu đề"
                value={formData.story.title}
                onChange={(e) => handlers.updateStory("title", e.target.value)}
            />
            <Textarea
                label="Nội dung"
                rows={4}
                value={formData.story.content}
                onChange={(e) => handlers.updateStory("content", e.target.value)}
            />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    4 ảnh (grid 2x2)
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {formData.story.images.map((image, index) => (
                        <ImageUploader
                            key={index}
                            value={image}
                            onChange={(url) => handlers.updateStoryImage(index, url)}
                            alt={`Ảnh ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatsSection = ({ formData, handlers }) => {
    return (
        <div className="space-y-4">
            <SectionTitle hint="4 số liệu hiển thị dạng band ngang (vd: 10+ Năm kinh nghiệm).">
                Thống kê
            </SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
                {formData.stats.items.map((stat, index) => (
                    <div key={index} className="rounded-xl border border-gray-200 p-4 space-y-3">
                        <h4 className="font-semibold text-gray-700">Số liệu {index + 1}</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Giá trị (vd: 10+)"
                                value={stat.value}
                                onChange={(e) => handlers.updateStat(index, "value", e.target.value)}
                            />
                            <Input
                                label="Nhãn"
                                value={stat.label}
                                onChange={(e) => handlers.updateStat(index, "label", e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeamSection = ({ formData, handlers }) => {
    return (
        <div className="space-y-4">
            <SectionTitle hint="Tiêu đề, mô tả và 4 thẻ thành viên đội ngũ.">
                Đội ngũ
            </SectionTitle>
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <Input
                    label="Tiêu đề"
                    value={formData.team.title}
                    onChange={(e) => handlers.updateTeamMeta("title", e.target.value)}
                />
                <Textarea
                    label="Mô tả"
                    rows={2}
                    value={formData.team.subtitle}
                    onChange={(e) => handlers.updateTeamMeta("subtitle", e.target.value)}
                />
            </div>
            {formData.team.members.map((member, index) => (
                <div key={index} className="rounded-xl border border-gray-200 p-4 space-y-3">
                    <h4 className="font-semibold text-gray-700">Thành viên {index + 1}</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        <Input
                            label="Họ và tên"
                            value={member.name}
                            onChange={(e) => handlers.updateMember(index, "name", e.target.value)}
                        />
                        <Input
                            label="Vai trò"
                            value={member.role}
                            onChange={(e) => handlers.updateMember(index, "role", e.target.value)}
                        />
                    </div>
                    <Textarea
                        label="Mô tả ngắn"
                        rows={2}
                        value={member.bio}
                        onChange={(e) => handlers.updateMember(index, "bio", e.target.value)}
                    />
                    <Input
                        label="URL ảnh đại diện"
                        value={member.avatar}
                        onChange={(e) => handlers.updateMember(index, "avatar", e.target.value)}
                    />
                    <ImageUploader
                        value={member.avatar}
                        onChange={(url) => handlers.updateMember(index, "avatar", url)}
                        alt={member.name}
                        height="h-40"
                    />
                </div>
            ))}
        </div>
    );
};

const CommitmentsSection = ({ formData, handlers, iconOptions }) => {
    return (
        <div className="space-y-4">
            <SectionTitle hint="3 thẻ cam kết (giá trị cốt lõi) hiển thị cuối trang.">
                Cam kết
            </SectionTitle>
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <Input
                    label="Tiêu đề"
                    value={formData.commitments.title}
                    onChange={(e) => handlers.updateCommitmentsMeta("title", e.target.value)}
                />
                <Textarea
                    label="Mô tả"
                    rows={2}
                    value={formData.commitments.subtitle}
                    onChange={(e) => handlers.updateCommitmentsMeta("subtitle", e.target.value)}
                />
            </div>
            {formData.commitments.items.map((item, index) => (
                <div key={index} className="rounded-xl border border-gray-200 p-4 space-y-3">
                    <h4 className="font-semibold text-gray-700">Cam kết {index + 1}</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Biểu tượng
                            </label>
                            <select
                                value={item.icon}
                                onChange={(e) => handlers.updateCommitment(index, "icon", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 bg-white"
                            >
                                {iconOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Tiêu đề"
                            value={item.title}
                            onChange={(e) => handlers.updateCommitment(index, "title", e.target.value)}
                        />
                    </div>
                    <Textarea
                        label="Mô tả"
                        rows={3}
                        value={item.description}
                        onChange={(e) => handlers.updateCommitment(index, "description", e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
};
