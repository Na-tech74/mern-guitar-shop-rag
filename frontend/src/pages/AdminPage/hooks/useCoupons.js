import { useState, useCallback, useEffect, useRef } from "react";
import { couponAPI } from "../../../api";
import { useDialog } from "../../../components/MessageDialog";
import useDebounce from "../../../hooks/useDebounce";
import { formatDate } from "../../../helpers/formatters";

const initialFormData = {
    code: "",
    type: "percentage",
    value: "",
    minOrderValue: "",
    maxDiscount: "",
    usageLimit: "",
    perUserLimit: 1,
    startDate: "",
    endDate: "",
    isActive: true,
};

export const useCoupons = () => {
    const { confirm, alert } = useDialog();

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const hasLoadedRef = useRef(false);

    const parseCouponData = (coupon) => ({
        _id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderValue: coupon.minOrderValue || 0,
        maxDiscount: coupon.maxDiscount || 0,
        usageLimit: coupon.usageLimit || 0,
        usedCount: coupon.usedCount || 0,
        perUserLimit: coupon.perUserLimit || 1,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        isActive: coupon.isActive,
        applicableProducts: coupon.applicableProducts || [],
        applicableCategories: coupon.applicableCategories || [],
        createdAt: coupon.createdAt,
        updatedAt: coupon.updatedAt,
    });

    const fetchCoupons = useCallback(async ({ silent = false } = {}) => {
        try {
            if (silent && hasLoadedRef.current) {
                setRefetching(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const params = { page, limit: 10 };
            if (debouncedSearch) params.search = debouncedSearch;

            const res = await couponAPI.getAll(params);
            const data = res.data?.data;
            setCoupons((data?.coupons || []).map(parseCouponData));
            setTotalPages(data?.pagination?.totalPages || 1);
            setTotal(data?.pagination?.total || 0);
            hasLoadedRef.current = true;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchCoupons({ silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchCoupons]);

    const toInputDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const h = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${y}-${m}-${day}T${h}:${min}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                code: formData.code,
                type: formData.type,
                value: Number(formData.value),
                minOrderValue: Number(formData.minOrderValue) || 0,
                maxDiscount: Number(formData.maxDiscount) || 0,
                usageLimit: Number(formData.usageLimit) || 0,
                perUserLimit: Number(formData.perUserLimit) || 1,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                isActive: formData.isActive,
            };

            if (editingCoupon) {
                const res = await couponAPI.update(editingCoupon._id, payload);
                const updated = res.data?.data?.coupon;
                if (updated) {
                    setCoupons((prev) => prev.map((c) => (c._id === editingCoupon._id ? parseCouponData(updated) : c)));
                }
            } else {
                await couponAPI.create(payload);
                if (page === 1) {
                    fetchCoupons({ silent: true });
                } else {
                    setPage(1);
                }
            }

            setShowModal(false);
            resetForm();
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Có lỗi xảy ra!",
                variant: "error",
            });
        }
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa mã giảm giá",
            message: "Bạn có chắc muốn xóa mã giảm giá này?",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (!ok) return;
        try {
            await couponAPI.delete(id);
            setCoupons((prev) => prev.filter((c) => c._id !== id));
            setTotal((prev) => prev - 1);
            if (coupons.length <= 1 && page > 1) {
                setPage((p) => p - 1);
            }
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Có lỗi xảy ra!",
                variant: "error",
            });
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            type: coupon.type,
            value: String(coupon.value),
            minOrderValue: String(coupon.minOrderValue || ""),
            maxDiscount: String(coupon.maxDiscount || ""),
            usageLimit: String(coupon.usageLimit || ""),
            perUserLimit: coupon.perUserLimit || 1,
            startDate: toInputDate(coupon.startDate),
            endDate: toInputDate(coupon.endDate),
            isActive: coupon.isActive,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingCoupon(null);
        setFormData(initialFormData);
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    const handleToggleActive = async (coupon) => {
        try {
            const res = await couponAPI.update(coupon._id, { isActive: !coupon.isActive });
            const updated = res.data?.data?.coupon;
            if (updated) {
                setCoupons((prev) => prev.map((c) => (c._id === coupon._id ? parseCouponData(updated) : c)));
            }
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Có lỗi xảy ra!",
                variant: "error",
            });
        }
    };

    return {
        coupons,
        loading,
        refetching,
        error,
        searchTerm,
        setSearchTerm,
        page,
        totalPages,
        total,
        setPage,
        handleSubmit,
        handleDelete,
        handleEdit,
        handleToggleActive,
        resetForm,
        openModal,
        showModal,
        setShowModal,
        editingCoupon,
        formData,
        setFormData,
        fetchCoupons,
    };
};
