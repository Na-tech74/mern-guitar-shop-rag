import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faCheckCircle,
    faExclamationCircle,
    faImage,
    faArrowUp,
    faArrowDown,
    faChevronLeft,
    faEye,
    faUpload,
    faTimes,
    faSpinner,
    faVideo,
    faFilm
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useHomeContent } from "./hooks/useHomeContent";
import { homeContentAPI } from "../../api";

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

const ImageUploader = ({ value, onChange, alt = "" }) => {
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
            const res = await homeContentAPI.uploadImage(file);
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
            <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 text-gray-800 text-sm">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Đang tải ảnh lên...
            </div>
        );
    }

    if (!value) {
        return (
            <div>
                <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 text-sm hover:border-amber-500 hover:bg-gray-100 transition-colors">
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
                    className="h-32 w-full rounded-lg object-cover border border-gray-200"
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

const VideoUploader = ({ value, onChange, label = "Video" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) {
            setError("Vui lòng chọn file video!");
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            setError("Dung lượng video tối đa 50MB!");
            return;
        }
        setError(null);
        setUploading(true);
        try {
            const res = await homeContentAPI.uploadVideo(file);
            const url = res.data?.data?.url;
            if (url) {
                onChange(url);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Upload video thất bại!");
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
            <div className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 text-gray-800 text-sm">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Đang tải video lên...
            </div>
        );
    }

    if (!value) {
        return (
            <div>
                <label className="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 text-sm hover:border-amber-500 hover:bg-gray-100 transition-colors">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFile}
                        className="hidden"
                    />
                    <div className="text-center">
                        <FontAwesomeIcon icon={faVideo} className="text-2xl mb-2 block" />
                        <div>Click để tải {label.toLowerCase()} lên</div>
                        <div className="text-xs text-gray-400 mt-1">(Tối đa 50MB - mp4, webm, mov...)</div>
                    </div>
                </label>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div>
            <div className="relative">
                <video
                    src={value}
                    className="h-40 w-full rounded-lg object-cover border border-gray-200 bg-black"
                    controls
                    muted
                    playsInline
                    preload="metadata"
                />
                <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow"
                    title="Xóa video"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                <label className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-800 cursor-pointer">
                    <FontAwesomeIcon icon={faUpload} />
                    Thay video khác
                    <input
                        ref={inputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFile}
                        className="hidden"
                    />
                </label>
                <span className="text-xs text-gray-400 truncate flex-1 min-w-0" title={value}>
                    <FontAwesomeIcon icon={faFilm} className="mr-1" />
                    {value}
                </span>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default function HomeContent() {
    const {
        loading,
        saving,
        activeTab,
        setActiveTab,
        formData,
        message,
        setMessage,
        iconOptions,
        tabs,
        handlers,
        handleSubmit,
    } = useHomeContent();

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FontAwesomeIcon icon={faHouse} className="text-gray-700" />
                        Quản lý Trang chủ
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Chỉnh sửa toàn bộ nội dung hiển thị trên trang chủ
                    </p>
                </div>
                <Link
                    to="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                    <FontAwesomeIcon icon={faEye} /> Xem trang chủ
                </Link>
            </div>

            <div className="flex gap-6">
                <div className="w-48 shrink-0">
                    <div className="rounded-xl bg-white p-2 shadow-sm sticky top-24">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMessage(null);
                                }}
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-gray-100 text-gray-800"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-4 min-w-0">
                    <MessageBanner message={message} />

                    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm space-y-8">
                        {activeTab === "carousel" && (
                            <CarouselSection formData={formData} handlers={handlers} />
                        )}
                        {activeTab === "features" && (
                            <FeaturesSection formData={formData} handlers={handlers} iconOptions={iconOptions} />
                        )}
                        {activeTab === "headings" && (
                            <HeadingsSection formData={formData} handlers={handlers} />
                        )}
                        {activeTab === "clip" && (
                            <ClipSection formData={formData} handlers={handlers} />
                        )}
                        {activeTab === "types" && (
                            <FeaturedTypesSection formData={formData} handlers={handlers} />
                        )}
                        {activeTab === "cta" && (
                            <CtaSection formData={formData} handlers={handlers} />
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} /> Lên đầu trang
                            </Button>
                            <Button type="submit" variant="primary" loading={saving}>
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const CarouselSection = ({ formData, handlers }) => {
    const { updateCarousel, updateSlide } = handlers;
    const moveSlide = (index, dir) => {
        const slides = [...formData.carousel.slides];
        const target = index + dir;
        if (target < 0 || target >= slides.length) return;
        [slides[index], slides[target]] = [slides[target], slides[index]];
        updateCarousel("slides", slides);
    };
    return (
        <div className="space-y-6">
            <SectionTitle hint="Carousel hiển thị đầu trang chủ. Tối đa nhiều slide.">
                Carousel (Banner đầu trang)
            </SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
                <Input
                    label="Tên thương hiệu (hiển thị nhỏ trên slide)"
                    value={formData.carousel.brand}
                    onChange={(e) => updateCarousel("brand", e.target.value)}
                />
            </div>

            {formData.carousel.slides.map((slide, index) => (
                <div key={index} className="rounded-xl border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-700">Slide {index + 1}</h4>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                onClick={() => moveSlide(index, -1)}
                                disabled={index === 0}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
                                title="Lên"
                            >
                                <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveSlide(index, 1)}
                                disabled={index === formData.carousel.slides.length - 1}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
                                title="Xuống"
                            >
                                <FontAwesomeIcon icon={faArrowDown} />
                            </button>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                        <Input
                            label="Tiêu đề"
                            value={slide.title}
                            onChange={(e) => updateSlide(index, "title", e.target.value)}
                        />
                        <Input
                            label="Tiêu đề phụ"
                            value={slide.subtitle}
                            onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                        />
                    </div>
                    <Input
                        label="Mô tả"
                        value={slide.description}
                        onChange={(e) => updateSlide(index, "description", e.target.value)}
                    />
                    <div className="grid md:grid-cols-3 gap-3">
                        <Input
                            label="URL hình ảnh"
                            value={slide.image}
                            onChange={(e) => updateSlide(index, "image", e.target.value)}
                        />
                        <Input
                            label="Nút CTA"
                            value={slide.cta}
                            onChange={(e) => updateSlide(index, "cta", e.target.value)}
                        />
                        <Input
                            label="Liên kết (path)"
                            value={slide.path}
                            onChange={(e) => updateSlide(index, "path", e.target.value)}
                        />
                    </div>
                    <ImageUploader
                        value={slide.image}
                        onChange={(url) => updateSlide(index, "image", url)}
                        alt={slide.title}
                    />
                </div>
            ))}
        </div>
    );
};

const FeaturesSection = ({ formData, handlers, iconOptions }) => {
    const { updateFeature } = handlers;
    return (
        <div className="space-y-6">
            <SectionTitle hint="Banner 4 tính năng nổi bật ngay dưới carousel.">
                Banner tính năng
            </SectionTitle>
            {formData.featuresBanner.features.map((feature, index) => (
                <div key={index} className="rounded-xl border border-gray-200 p-4 space-y-3">
                    <h4 className="font-semibold text-gray-700">Tính năng {index + 1}</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Biểu tượng
                            </label>
                            <select
                                value={feature.icon}
                                onChange={(e) => updateFeature(index, "icon", e.target.value)}
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
                            value={feature.title}
                            onChange={(e) => updateFeature(index, "title", e.target.value)}
                        />
                    </div>
                    <Input
                        label="Mô tả"
                        value={feature.description}
                        onChange={(e) => updateFeature(index, "description", e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
};

const HeadingsSection = ({ formData, handlers }) => {
    return (
        <div className="space-y-6">
            <SectionTitle hint="Tiêu đề và mô tả của các section danh mục, sản phẩm nổi bật và bộ sưu tập.">
                Tiêu đề các section
            </SectionTitle>
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <h4 className="font-semibold text-gray-700">Section danh mục</h4>
                <Input
                    label="Tiêu đề"
                    value={formData.categoriesSection.title}
                    onChange={(e) => handlers.updateCategory("title", e.target.value)}
                />
                <Input
                    label="Mô tả"
                    value={formData.categoriesSection.subtitle}
                    onChange={(e) => handlers.updateCategory("subtitle", e.target.value)}
                />
            </div>
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <h4 className="font-semibold text-gray-700">Section sản phẩm nổi bật</h4>
                <Input
                    label="Tiêu đề"
                    value={formData.featuredProducts.title}
                    onChange={(e) => handlers.updateFeaturedProducts("title", e.target.value)}
                />
                <Input
                    label="Mô tả"
                    value={formData.featuredProducts.subtitle}
                    onChange={(e) => handlers.updateFeaturedProducts("subtitle", e.target.value)}
                />
            </div>
        </div>
    );
};

const ClipSection = ({ formData, handlers }) => {
    return (
        <div className="space-y-6">
            <SectionTitle hint="Section video khuyến mãi ở giữa trang chủ. Để trống URL video sẽ dùng video mặc định.">
                Section khuyến mãi (Clip)
            </SectionTitle>
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <Input
                    label="Tiêu đề"
                    value={formData.clip.title}
                    onChange={(e) => handlers.updateClip("title", e.target.value)}
                />
                <Input
                    label="Mô tả"
                    value={formData.clip.description}
                    onChange={(e) => handlers.updateClip("description", e.target.value)}
                />
                <div className="grid md:grid-cols-2 gap-3">
                    <Input
                        label="Nhãn nút bấm"
                        value={formData.clip.buttonText}
                        onChange={(e) => handlers.updateClip("buttonText", e.target.value)}
                    />
                    <Input
                        label="Liên kết nút bấm"
                        value={formData.clip.buttonLink}
                        onChange={(e) => handlers.updateClip("buttonLink", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video clip
                    </label>
                    <VideoUploader
                        value={formData.clip.videoUrl}
                        onChange={(url) => handlers.updateClip("videoUrl", url)}
                        label="Video clip"
                    />
                </div>
            </div>
        </div>
    );
};

const FeaturedTypesSection = ({ formData, handlers }) => {
    const { updateFeaturedType, updateFeaturedTypesMeta } = handlers;
    return (
        <div className="space-y-6">
            <SectionTitle hint="Section bộ sưu tập hiển thị các dòng sản phẩm.">
                Bộ sưu tập
            </SectionTitle>
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <Input
                    label="Tiêu đề"
                    value={formData.featuredTypes.title}
                    onChange={(e) => updateFeaturedTypesMeta("title", e.target.value)}
                />
                <Input
                    label="Mô tả"
                    value={formData.featuredTypes.subtitle}
                    onChange={(e) => updateFeaturedTypesMeta("subtitle", e.target.value)}
                />
            </div>
            {formData.featuredTypes.types.map((type, index) => (
                <div key={index} className="rounded-xl border border-gray-200 p-4 space-y-3">
                    <h4 className="font-semibold text-gray-700">Mục {index + 1}</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        <Input
                            label="Tiêu đề"
                            value={type.title}
                            onChange={(e) => updateFeaturedType(index, "title", e.target.value)}
                        />
                        <Input
                            label="Phụ đề"
                            value={type.subtitle}
                            onChange={(e) => updateFeaturedType(index, "subtitle", e.target.value)}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                        <Input
                            label="URL hình ảnh"
                            value={type.image}
                            onChange={(e) => updateFeaturedType(index, "image", e.target.value)}
                        />
                        <Input
                            label="Liên kết"
                            value={type.link}
                            onChange={(e) => updateFeaturedType(index, "link", e.target.value)}
                        />
                    </div>
                    <ImageUploader
                        value={type.image}
                        onChange={(url) => updateFeaturedType(index, "image", url)}
                        alt={type.title}
                    />
                </div>
            ))}
        </div>
    );
};

const CtaSection = ({ formData, handlers }) => {
    return (
        <div className="space-y-6">
            <SectionTitle hint="Section kêu gọi hành động ở cuối trang chủ (CTA hỗ trợ). Để trống URL video sẽ dùng video mặc định.">
                Section CTA hỗ trợ
            </SectionTitle>
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <Input
                    label="Nhãn nhỏ (badge)"
                    value={formData.ctaSection.badgeText}
                    onChange={(e) => handlers.updateCta("badgeText", e.target.value)}
                />
                <Input
                    label="Tiêu đề"
                    value={formData.ctaSection.title}
                    onChange={(e) => handlers.updateCta("title", e.target.value)}
                />
                <Input
                    label="Mô tả"
                    value={formData.ctaSection.description}
                    onChange={(e) => handlers.updateCta("description", e.target.value)}
                />
                <div className="grid md:grid-cols-2 gap-3">
                    <Input
                        label="Nút chính - Nhãn"
                        value={formData.ctaSection.primaryButtonText}
                        onChange={(e) => handlers.updateCta("primaryButtonText", e.target.value)}
                    />
                    <Input
                        label="Nút chính - Liên kết"
                        value={formData.ctaSection.primaryButtonLink}
                        onChange={(e) => handlers.updateCta("primaryButtonLink", e.target.value)}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                    <Input
                        label="Nút phụ - Nhãn"
                        value={formData.ctaSection.secondaryButtonText}
                        onChange={(e) => handlers.updateCta("secondaryButtonText", e.target.value)}
                    />
                    <Input
                        label="Nút phụ - Liên kết"
                        value={formData.ctaSection.secondaryButtonLink}
                        onChange={(e) => handlers.updateCta("secondaryButtonLink", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video nền
                    </label>
                    <VideoUploader
                        value={formData.ctaSection.videoUrl}
                        onChange={(url) => handlers.updateCta("videoUrl", url)}
                        label="Video nền"
                    />
                </div>
            </div>
        </div>
    );
};
