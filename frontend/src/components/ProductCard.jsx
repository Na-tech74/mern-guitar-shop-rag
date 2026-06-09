import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faShoppingCart, faCheck, faFire, faEye } from "@fortawesome/free-solid-svg-icons";
import { getOptimizedImage, formatCurrency } from "../helpers/format";

export default function ProductCard({ product, viewMode = "grid", onAddToCart, isAdded }) {
    const inStock = product.stock === undefined || product.stock > 0;

    return (
        <div className={`bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-pop hover:border-amber-200 transition-all duration-300 group ${viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"}`}>
            <Link
                to={`/products/${product._id}`}
                className={`relative block overflow-hidden ${viewMode === "list" ? "w-full sm:w-44 lg:w-52 shrink-0" : ""}`}
            >
                <div className={`w-full ${viewMode === "list" ? "h-40 sm:h-full" : "aspect-[4/3] sm:h-56"} bg-gray-100`}>
                    {product.images?.[0] ? (
                        <img
                            src={getOptimizedImage(product.images[0], 400)}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FontAwesomeIcon icon={faImage} className="text-2xl sm:text-3xl" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    {product.sold > 0 && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-amber-500 text-white text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm flex items-center gap-1">
                            <FontAwesomeIcon icon={faFire} className="text-[8px] sm:text-[9px]" />
                            Hot
                        </div>
                    )}
                    {product.stock !== undefined && (
                        <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium flex items-center gap-1 shadow-sm ${product.stock > 0
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}>
                            <span className={`size-1 sm:size-1.5 rounded-full ${product.stock > 0 ? "bg-white" : "bg-gray-300"}`} />
                            {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
                <Link to={`/products/${product._id}`} className="block">
                    {product.category?.name && (
                        <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-amber-500 mb-1">
                            {product.category.name}
                        </p>
                    )}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2 leading-snug hover:text-amber-600 transition">
                        {product.name}
                    </h3>
                </Link> 
                {viewMode === "list" && product.description && (
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                )}
                <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <span className="text-base sm:text-lg lg:text-xl font-bold text-amber-600">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2">
                        <Link
                            to={`/products/${product._id}`}
                            className="flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-medium transition flex items-center justify-center gap-1 border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50"
                        >
                            <FontAwesomeIcon icon={faEye} className="text-[10px] sm:text-xs" />
                            <span className="sm:hidden">Xem</span>
                            <span className="hidden sm:inline">Xem chi tiết</span>
                        </Link>
                        <button
                            type="button"
                            disabled={!inStock}
                            onClick={(e) => onAddToCart(product, 1, e)}
                            className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-medium transition flex items-center justify-center gap-1 shadow-sm ${!inStock
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : isAdded
                                        ? "bg-emerald-500 text-white"
                                        : "bg-amber-400 hover:bg-amber-500 text-white hover:shadow-md"
                                }`}
                        >
                            <FontAwesomeIcon
                                icon={isAdded ? faCheck : faShoppingCart}
                                className="text-[10px] sm:text-xs"
                            />
                            {isAdded ? (
                                <span>Đã thêm</span>
                            ) : (
                                <>
                                    <span className="sm:hidden">Thêm</span>
                                    <span className="hidden sm:inline">Thêm giỏ</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
