import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { productAPI } from "../../../api";
import { formatCurrency } from "../../../helpers/formatters";
import { Link } from "react-router-dom";

export default function TopSellingProducts() {
    const [products, setProducts] = useState([]);
    const [totalSold, setTotalSold] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productAPI.getTopSelling(5)
            .then(res => {
                setProducts(res.data?.data?.products || []);
                setTotalSold(res.data?.data?.totalSold || 0);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full size-8 border-b-2 border-amber-500"></div>
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
                </div>
                <Link to="/admin/products" className="text-xs sm:text-sm text-gray-700 hover:text-amber-500 flex items-center gap-1">
                    Xem tất cả <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </div>

            <div className="space-y-3">
                {products.map((product, index) => (
                    <div key={product._id} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-5 text-center shrink-0">
                            {index + 1}
                        </span>
                        <img
                            src={product.images?.[0] || "/placeholder.png"}
                            alt={product.name}
                            className="size-10 sm:size-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category?.name || "—"}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-gray-800">{formatCurrency(product.price)}</p>
                            <p className="text-xs text-orange-500 font-medium">{product.sold} đã bán</p>
                        </div>
                    </div>
                ))}
            </div>

            {totalSold > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                        Tổng đã bán: <span className="font-semibold text-orange-500">{totalSold}</span> sản phẩm
                    </p>
                </div>
            )}
        </div>
    );
}
