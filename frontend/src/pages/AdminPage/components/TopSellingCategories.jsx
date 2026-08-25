import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { categoryAPI } from "../../../api";
import { Link } from "react-router-dom";

export default function TopSellingCategories() {
    const [categories, setCategories] = useState([]);
    const [totalSold, setTotalSold] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryAPI.getTopSelling(5)
            .then(res => {
                setCategories(res.data?.data?.categories || []);
                setTotalSold(res.data?.data?.totalSold || 0);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const maxSold = Math.max(...categories.map(c => c.totalSold), 1);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full size-8 border-b-2 border-amber-500"></div>
                </div>
            </div>
        );
    }

    if (categories.length === 0) return null;

    return (
        <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faTags} className="text-purple-500" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Danh mục bán chạy</h3>
                </div>
                <Link to="/admin/categories" className="text-xs sm:text-sm text-gray-700 hover:text-amber-500 flex items-center gap-1">
                    Xem tất cả <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </div>

            <div className="space-y-3">
                {categories.map((cat, index) => {
                    const widthPercent = (cat.totalSold / maxSold) * 100;
                    return (
                        <div key={cat._id}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 w-5 text-center">
                                        {index + 1}
                                    </span>
                                    {cat.image && (
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="size-8 rounded-md object-cover"
                                        />
                                    )}
                                    <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-semibold text-gray-800">{cat.totalSold}</span>
                                    <span className="text-xs text-gray-500 ml-1">đã bán</span>
                                </div>
                            </div>
                            <div className="ml-7 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                                    style={{ width: `${widthPercent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalSold > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                        Tổng đã bán: <span className="font-semibold text-purple-500">{totalSold}</span> sản phẩm
                    </p>
                </div>
            )}
        </div>
    );
}
