import { useMemo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

/**
 * Pagination - Component phân trang dùng chung toàn dự án
 *
 * Props:
 *   page          (number, bắt buộc)  - Trang hiện tại (1-based)
 *   totalPages    (number, bắt buộc)  - Tổng số trang
 *   onChange      (fn, bắt buộc)      - Callback(newPage) khi user chuyển trang
 *   total         (number, tuỳ chọn)   - Tổng số items, hiển thị "Có X mục"
 *   label         (string, default "mục") - Đơn vị cho total (vd: "sản phẩm", "đơn hàng")
 *   siblings      (number, default 1) - Số trang hiển thị 2 bên trang hiện tại
 *   scrollToTop   (bool, default true) - Cuộn mượt lên container cha khi đổi trang
 *
 * Tự động ẩn khi totalPages <= 1. Có đầy đủ aria-* cho screen reader.
 */
export default function Pagination({
    page,
    totalPages,
    onChange,
    total,
    label = "mục",
    siblings = 1,
    scrollToTop = true,
}) {
    const navRef = useRef(null);

    const items = useMemo(() => {
        const totalNumbers = siblings * 2 + 5;
        if (totalPages <= totalNumbers) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const leftSibling = Math.max(page - siblings, 1);
        const rightSibling = Math.min(page + siblings, totalPages);
        const showLeftDots = leftSibling > 2;
        const showRightDots = rightSibling < totalPages - 1;
        const result = [1];

        if (showLeftDots) {
            result.push("...");
        } else {
            for (let i = 2; i < leftSibling; i++) result.push(i);
        }
        for (let i = leftSibling; i <= rightSibling; i++) {
            if (i !== 1 && i !== totalPages) result.push(i);
        }
        if (showRightDots) {
            result.push("...");
        } else {
            for (let i = rightSibling + 1; i < totalPages; i++) result.push(i);
        }
        if (totalPages > 1) result.push(totalPages);
        return result;
    }, [page, totalPages, siblings]);

    if (totalPages <= 1) return null;

    const goTo = (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === page) return;
        onChange(newPage);
        if (scrollToTop) {
            const parent = navRef.current?.parentElement;
            if (parent?.scrollIntoView) {
                parent.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    return (
        <nav
            ref={navRef}
            className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6"
            aria-label="Phân trang"
        >
            {total !== undefined && (
                <p className="text-sm text-gray-500">
                    Có <span className="font-medium text-gray-700">{total}</span> {label}
                </p>
            )}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => goTo(page - 1)}
                    aria-label="Trang trước"
                    className="size-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                </button>
                {items.map((p, i) =>
                    p === "..." ? (
                        <span
                            key={`dots-${i}`}
                            className="px-1.5 text-gray-400 select-none"
                            aria-hidden="true"
                        >…</span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            onClick={() => goTo(p)}
                            aria-current={p === page ? "page" : undefined}
                            aria-label={`Trang ${p}`}
                            className={`min-w-9 h-9 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                                p === page
                                    ? "bg-amber-600 text-white"
                                    : "border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => goTo(page + 1)}
                    aria-label="Trang sau"
                    className="size-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                </button>
            </div>
        </nav>
    );
}
