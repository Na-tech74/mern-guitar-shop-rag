import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Pagination({ page, totalPages, onChange, minPages = 1 }) {
    const pages = Math.max(totalPages, minPages);

    const items = useMemo(() => {
        if (pages <= 2) return Array.from({ length: pages }, (_, i) => i + 1);
        const result = [1, 2, "..."];
        const start = Math.max(3, page - 1);
        const end = Math.min(pages - 1, page + 1);
        if (start <= end) {
            result.pop();
            for (let i = start; i <= end; i++) result.push(i);
            if (end < pages - 1) result.push("...");
        }
        if (!result.includes(pages)) result.push(pages);
        return result;
    }, [page, pages]);

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>
            {items.map((p, i) =>
                p === "..." ? (
                    <span key={`e${i}`} className="text-gray-400 text-sm px-1">...</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onChange(p)}
                        className={`size-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                            p === page
                                ? "bg-amber-600 text-white"
                                : "border border-gray-200 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}
            <button
                type="button"
                disabled={page >= pages}
                onClick={() => onChange(page + 1)}
                className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
        </div>
    );
}
