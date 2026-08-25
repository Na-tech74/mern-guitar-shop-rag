import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash, faSearch, faSpinner, faStar,
    faMessage, faCalendar, faBox
} from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../../helpers/formatters";
import { useReviews } from "./hooks/useReviews";
import UserAvatar from "../../components/UserAvatar";
import { getOptimizedImage } from "../../helpers/image";
import Button from "../../components/Button";

const RATING_LABELS = {
    all: "Tất cả",
    5: "5 sao",
    4: "4 sao",
    3: "3 sao",
    2: "2 sao",
    1: "1 sao",
};

function StarRating({ rating, size = "xs" }) {
    const sizeClass = size === "sm" ? "text-sm" : "text-[10px]";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={`${sizeClass} ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
                />
            ))}
        </div>
    );
}

export default function Reviews() {
    const {
        loading, refetching, error, filteredReviews, stats,
        searchTerm, setSearchTerm, ratingFilter, setRatingFilter, handleDelete
    } = useReviews();

    if (error) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faMessage} className="text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý đánh giá</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Quản lý đánh giá sản phẩm</p>
                    </div>
                </div>
                <div className="rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
                    <p className="mb-4 text-red-500">{error.message || "Không thể tải danh sách đánh giá"}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faMessage} className="text-amber-600 text-sm sm:text-lg" />
                </div>
                <div>
                    <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý đánh giá</h1>
                    <p className="text-[10px] sm:text-sm text-gray-500">{stats.total} đánh giá</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                <div className="col-span-2 sm:col-span-1 rounded-xl bg-white p-3 sm:p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-amber-500">{stats.avgRating}</p>
                        <StarRating rating={Math.round(stats.avgRating)} size="sm" />
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Điểm trung bình</p>
                    </div>
                </div>
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="rounded-xl bg-white p-3 sm:p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-amber-500">{star}</span>
                            <FontAwesomeIcon icon={faStar} className="text-[10px] text-amber-400" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-amber-400 rounded-full transition-all"
                                    style={{ width: `${stats.total > 0 ? (stats.ratings[star - 1] / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-400 w-8 text-right">{stats.ratings[star - 1]}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="relative flex-1 max-w-md w-full">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên user, sản phẩm, nội dung..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                            />
                            {refetching && (
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 animate-spin"
                                />
                            )}
                        </div>
                        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
                            {Object.entries(RATING_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setRatingFilter(key)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition whitespace-nowrap ${
                                        ratingFilter === key
                                            ? "bg-amber-500 text-white shadow-sm"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full size-10 sm:size-12 border-b-2 border-amber-400"></div>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                        <div className="size-12 sm:size-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faMessage} className="text-xl sm:text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-1 text-sm">Không có đánh giá nào</p>
                        <p className="text-xs sm:text-sm text-gray-400">
                            {ratingFilter !== "all"
                                ? `Không có đánh giá ${RATING_LABELS[ratingFilter]}`
                                : "Chưa có đánh giá nào từ người dùng"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredReviews.map((review) => (
                            <div key={review._id} className="p-3 sm:p-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex gap-3">
                                    <div className="shrink-0 hidden sm:block">
                                        <UserAvatar user={review.user} size="md" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div className="sm:hidden">
                                                    <UserAvatar user={review.user} size="sm" />
                                                </div>
                                                <span className="font-medium text-gray-800 text-sm">{review.user?.name || "Ẩn danh"}</span>
                                                <StarRating rating={review.rating} />
                                                {review.title && (
                                                    <span className="text-xs text-gray-500 font-medium">· {review.title}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="size-8 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-all flex items-center justify-center shrink-0"
                                                title="Xóa đánh giá"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{review.comment}</p>

                                        <div className="flex items-center gap-3 flex-wrap">
                                            {review.product && (
                                                <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1">
                                                    {review.product.images?.[0] ? (
                                                        <img
                                                            src={getOptimizedImage(review.product.images[0], 32)}
                                                            alt=""
                                                            className="size-4 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faBox} className="text-[10px] text-gray-300" />
                                                    )}
                                                    <span className="text-[11px] text-gray-500 truncate max-w-[150px]">
                                                        {review.product.name}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-[10px] sm:text-[11px] text-gray-400 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faCalendar} className="text-[9px]" />
                                                {formatDateTime(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
