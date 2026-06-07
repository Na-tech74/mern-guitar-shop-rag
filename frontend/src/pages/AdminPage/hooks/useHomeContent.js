import { useState, useEffect, useCallback } from "react";
import { homeContentAPI } from "../../../api";

const defaultContent = {
    carousel: {
        brand: "Nam Acoustic",
        slides: [
            { title: "", subtitle: "", description: "", image: "", cta: "Xem thêm", path: "/products" },
            { title: "", subtitle: "", description: "", image: "", cta: "Xem thêm", path: "/products" },
            { title: "", subtitle: "", description: "", image: "", cta: "Xem thêm", path: "/products" },
        ]
    },
    featuresBanner: {
        features: [
            { icon: "truck", title: "", description: "" },
            { icon: "shield", title: "", description: "" },
            { icon: "headset", title: "", description: "" },
            { icon: "award", title: "", description: "" },
        ]
    },
    categoriesSection: { title: "", subtitle: "" },
    featuredProducts: { title: "", subtitle: "" },
    clip: { title: "", description: "", buttonText: "Mua ngay", buttonLink: "/products", videoUrl: "" },
    featuredTypes: {
        title: "",
        subtitle: "",
        types: [
            { title: "", subtitle: "", image: "", link: "/products" },
            { title: "", subtitle: "", image: "", link: "/products" },
            { title: "", subtitle: "", image: "", link: "/products" },
        ]
    },
    ctaSection: {
        badgeText: "",
        title: "",
        description: "",
        primaryButtonText: "Xem sản phẩm",
        primaryButtonLink: "/products",
        secondaryButtonText: "Liên hệ ngay",
        secondaryButtonLink: "/contact",
        videoUrl: "",
    }
};

const iconOptions = [
    { value: "truck", label: "Giao hàng" },
    { value: "shield", label: "Bảo hành" },
    { value: "headset", label: "Hỗ trợ" },
    { value: "award", label: "Chất lượng" },
    { value: "gift", label: "Quà tặng" },
    { value: "rotate", label: "Đổi trả" },
];

export function useHomeContent() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("carousel");
    const [formData, setFormData] = useState(defaultContent);
    const [message, setMessage] = useState(null);

    const fetchContent = useCallback(async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await homeContentAPI.get();
            const data = res.data?.data?.content;
            if (data) {
                setFormData({
                    carousel: {
                        brand: data.carousel?.brand ?? defaultContent.carousel.brand,
                        slides: data.carousel?.slides?.length
                            ? data.carousel.slides
                            : defaultContent.carousel.slides,
                    },
                    featuresBanner: {
                        features: data.featuresBanner?.features?.length
                            ? data.featuresBanner.features
                            : defaultContent.featuresBanner.features,
                    },
                    categoriesSection: {
                        title: data.categoriesSection?.title ?? "",
                        subtitle: data.categoriesSection?.subtitle ?? "",
                    },
                    featuredProducts: {
                        title: data.featuredProducts?.title ?? "",
                        subtitle: data.featuredProducts?.subtitle ?? "",
                    },
                    clip: {
                        title: data.clip?.title ?? "",
                        description: data.clip?.description ?? "",
                        buttonText: data.clip?.buttonText ?? "Mua ngay",
                        buttonLink: data.clip?.buttonLink ?? "/products",
                        videoUrl: data.clip?.videoUrl ?? "",
                    },
                    featuredTypes: {
                        title: data.featuredTypes?.title ?? "",
                        subtitle: data.featuredTypes?.subtitle ?? "",
                        types: data.featuredTypes?.types?.length
                            ? data.featuredTypes.types
                            : defaultContent.featuredTypes.types,
                    },
                    ctaSection: {
                        badgeText: data.ctaSection?.badgeText ?? "",
                        title: data.ctaSection?.title ?? "",
                        description: data.ctaSection?.description ?? "",
                        primaryButtonText: data.ctaSection?.primaryButtonText ?? "Xem sản phẩm",
                        primaryButtonLink: data.ctaSection?.primaryButtonLink ?? "/products",
                        secondaryButtonText: data.ctaSection?.secondaryButtonText ?? "Liên hệ ngay",
                        secondaryButtonLink: data.ctaSection?.secondaryButtonLink ?? "/contact",
                        videoUrl: data.ctaSection?.videoUrl ?? "",
                    },
                });
            }
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || err.message || "Không thể tải nội dung trang chủ!",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const updateCarousel = (field, value) => {
        setFormData((prev) => ({ ...prev, carousel: { ...prev.carousel, [field]: value } }));
    };

    const updateSlide = (index, field, value) => {
        setFormData((prev) => {
            const slides = [...prev.carousel.slides];
            slides[index] = { ...slides[index], [field]: value };
            return { ...prev, carousel: { ...prev.carousel, slides } };
        });
    };

    const updateFeature = (index, field, value) => {
        setFormData((prev) => {
            const features = [...prev.featuresBanner.features];
            features[index] = { ...features[index], [field]: value };
            return { ...prev, featuresBanner: { features } };
        });
    };

    const updateFeaturedType = (index, field, value) => {
        setFormData((prev) => {
            const types = [...prev.featuredTypes.types];
            types[index] = { ...types[index], [field]: value };
            return { ...prev, featuredTypes: { ...prev.featuredTypes, types } };
        });
    };

    const updateCategory = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            categoriesSection: { ...prev.categoriesSection, [field]: value }
        }));
    };

    const updateFeaturedProducts = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            featuredProducts: { ...prev.featuredProducts, [field]: value }
        }));
    };

    const updateClip = (field, value) => {
        setFormData((prev) => ({ ...prev, clip: { ...prev.clip, [field]: value } }));
    };

    const updateFeaturedTypesMeta = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            featuredTypes: { ...prev.featuredTypes, [field]: value }
        }));
    };

    const updateCta = (field, value) => {
        setFormData((prev) => ({ ...prev, ctaSection: { ...prev.ctaSection, [field]: value } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await homeContentAPI.update(formData);
            setMessage({ type: "success", text: "Lưu nội dung trang chủ thành công!" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || err.message || "Có lỗi xảy ra, vui lòng thử lại!",
            });
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: "carousel", label: "Carousel" },
        { id: "features", label: "Tính năng" },
        { id: "headings", label: "Tiêu đề" },
        { id: "clip", label: "Khuyến mãi" },
        { id: "types", label: "Bộ sưu tập" },
        { id: "cta", label: "Tư vấn" },
    ];

    return {
        loading,
        saving,
        activeTab,
        setActiveTab,
        formData,
        setFormData,
        message,
        setMessage,
        iconOptions,
        tabs,
        handlers: {
            updateCarousel,
            updateSlide,
            updateFeature,
            updateFeaturedType,
            updateCategory,
            updateFeaturedProducts,
            updateClip,
            updateFeaturedTypesMeta,
            updateCta,
        },
        handleSubmit,
        fetchContent,
    };
}
