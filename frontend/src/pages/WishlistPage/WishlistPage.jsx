import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart,
    faHeartBroken,
    faShoppingBag,
    faTrash,
    faArrowLeft,
    faCartPlus,
    faCheck,
    faImage,
} from "@fortawesome/free-solid-svg-icons";
import { getOptimizedImage, formatCurrency } from "../../helpers/format";
import Button from "../../components/Button";
import useCart from "../ProductsPage/hooks/useCart";

export default function WishlistPage() {
    const [items, setItems] = useState([]);
    const { addToCart, addedMap } = useCart();

    useEffect(() => {
        setItems(JSON.parse(localStorage.getItem("wishlist") || "[]"));
        const sync = () => setItems(JSON.parse(localStorage.getItem("wishlist") || "[]"));
        window.addEventListener("wishlist-updated", sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener("wishlist-updated", sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const totalValue = useMemo(
        () => items.reduce((sum, it) => sum + (it.price || 0), 0),
        [items]
    );

    const remove = useCallback((id) => {
        setItems((prev) => {
            const next = prev.filter((it) => it._id !== id);
            localStorage.setItem("wishlist", JSON.stringify(next));
            window.dispatchEvent(new Event("wishlist-updated"));
            return next;
        });
    }, []);

    const clearAll = useCallback(() => {
        if (!window.confirm("Xóa tất cả sản phẩm yêu thích?")) return;
        localStorage.setItem("wishlist", "[]");
        setItems([]);
        window.dispatchEvent(new Event("wishlist-updated"));
    }, []);

    const addAllToCart = useCallback(() => {
        items.forEach((item) => addToCart(item, 1));
    }, [items, addToCart]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="text-sm mb-4">
                    <ol className="flex items-center gap-2 text-gray-400">
                        <li>
                            <Link to="/" className="hover:text-amber-600 transition">Trang chủ</Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-700 font-medium">Yêu thích</li>
                    </ol>
                </nav>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="size-10 sm:size-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                            <FontAwesomeIcon icon={faHeart} className="text-amber-500 text-sm sm:text-base" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
                            <p className="text-xs text-gray-500">
                                {items.length > 0
                                    ? `${items.length} sản phẩm · Tổng ${formatCurrency(totalValue)}`
                                    : "Danh sách đang trống"}
                            </p>
                        </div>
                    </div>
                    {items.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Button variant="primary" size="md" onClick={addAllToCart} className="!text-xs sm:!text-sm !px-3 sm:!px-4">
                                <FontAwesomeIcon icon={faShoppingBag} />
                                <span className="sm:hidden">Thêm hết</span>
                                <span className="hidden sm:inline">Thêm tất cả vào giỏ</span>
                            </Button>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition inline-flex items-center gap-1.5 font-medium"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                Xóa hết
                            </button>
                        </div>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-12 sm:py-20 px-4 sm:px-6 text-center">
                        <div className="size-16 sm:size-24 mx-auto mb-4 sm:mb-6 bg-amber-50 rounded-2xl flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeartBroken} className="text-2xl sm:text-4xl text-amber-400" />
                        </div>
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Chưa có sản phẩm yêu thích</h2>
                        <p className="text-xs sm:text-base text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
                            Lưu lại những món đàn bạn thích để mua sau hoặc chia sẻ với bạn bè.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-medium transition"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {items.map((item) => {
                            const isAdded = !!addedMap[item._id];
                            return (
                                <article
                                    key={item._id}
                                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className="relative h-44 sm:h-52 bg-gray-50 overflow-hidden">
                                        <Link to={`/products/${item._id}`} className="block w-full h-full">
                                            {item.images?.[0] ? (
                                                <img
                                                    src={getOptimizedImage(item.images[0], 600)}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <FontAwesomeIcon icon={faImage} className="text-4xl" />
                                                </div>
                                            )}
                                        </Link>

                                        <div className="absolute right-3 top-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-amber-600 shadow-sm">
                                            {formatCurrency(item.price)}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => remove(item._id)}
                                            aria-label="Xóa khỏi yêu thích"
                                            className="absolute right-3 bottom-3 size-9 rounded-full bg-white/95 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-sm"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                        </button>
                                    </div>

                                    <div className="p-3 sm:p-4">
                                        <Link
                                            to={`/products/${item._id}`}
                                            className="block font-semibold text-gray-900 line-clamp-2 hover:text-amber-600 transition min-h-[2.5rem] sm:min-h-[2.75rem] text-sm sm:text-base"
                                        >
                                            {item.name}
                                        </Link>

                                        <div className="mt-3 sm:mt-4 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => addToCart(item, 1)}
                                                disabled={isAdded}
                                                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
                                                    isAdded
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : "bg-amber-400 text-white hover:bg-amber-500"
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={isAdded ? faCheck : faCartPlus} className="text-xs" />
                                                {isAdded ? "Đã thêm" : "Thêm vào giỏ"}
                                            </button>
                                            <Link
                                                to={`/products/${item._id}`}
                                                className="px-3 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600 transition text-sm font-medium"
                                            >
                                                Xem
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
