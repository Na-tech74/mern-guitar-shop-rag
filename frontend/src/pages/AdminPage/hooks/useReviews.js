import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { reviewAPI } from "../../../api";
import useDebounce from "../../../hooks/useDebounce";
import { useDialog } from "../../../components/MessageDialog";

export const useReviews = () => {
    const { confirm, alert } = useDialog();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const [ratingFilter, setRatingFilter] = useState("all");

    const hasLoadedRef = useRef(false);

    const fetchReviews = useCallback(async ({ silent = false } = {}) => {
        try {
            if (silent && hasLoadedRef.current) {
                setRefetching(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const res = await reviewAPI.getAll();
            setReviews(res.data?.data?.reviews || []);
            hasLoadedRef.current = true;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchReviews({ silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchReviews]);

    const filteredReviews = useMemo(() => {
        let result = reviews || [];

        if (ratingFilter !== "all") {
            const rating = Number(ratingFilter);
            result = result.filter((r) => r.rating === rating);
        }

        if (debouncedSearch.trim()) {
            const term = debouncedSearch.toLowerCase();
            result = result.filter((r) =>
                r.user?.name?.toLowerCase().includes(term) ||
                r.user?.email?.toLowerCase().includes(term) ||
                r.product?.name?.toLowerCase().includes(term) ||
                r.title?.toLowerCase().includes(term) ||
                r.comment?.toLowerCase().includes(term)
            );
        }

        return result;
    }, [reviews, debouncedSearch, ratingFilter]);

    const stats = useMemo(() => {
        const total = reviews.length;
        const ratings = [0, 0, 0, 0, 0];
        reviews.forEach((r) => {
            if (r.rating >= 1 && r.rating <= 5) {
                ratings[r.rating - 1]++;
            }
        });
        const avgRating = total > 0
            ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
            : 0;
        return { total, ratings, avgRating };
    }, [reviews]);

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa đánh giá",
            message: "Bạn có chắc muốn xóa đánh giá này? Hành động không thể hoàn tác.",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (!ok) return;
        try {
            await reviewAPI.delete(id);
            setReviews((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Không thể xóa đánh giá!",
                variant: "error",
            });
        }
    };

    return {
        reviews,
        filteredReviews,
        loading,
        refetching,
        error,
        stats,
        searchTerm,
        setSearchTerm,
        ratingFilter,
        setRatingFilter,
        handleDelete,
        fetchReviews,
    };
};
