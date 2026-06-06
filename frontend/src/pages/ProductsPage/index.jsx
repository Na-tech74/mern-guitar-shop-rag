import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList, faShoppingCart, faImage, faCheck, faXmark, faBoxOpen, faTriangleExclamation, faFire, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import useProducts from "./hooks/useProducts";
import { API } from "../../api";
import { getOptimizedImage, formatCurrency } from "../../helpers/format";
import Carousel from "../../components/Carousel";
import Skeleton from "../../components/Skeleton";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import useCart from "./hooks/useCart";

export default function ProductsPage() {
    const { products, loading, error, pagination, fetchProducts } = useProducts();
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("default");
    const [selectedCategory, setSelectedCategory] = useState("");
    const { addToCart, addedMap } = useCart();

    useEffect(() => {
        API.get("/categories").then((res) => {
            const data = res.data?.data?.categories || [];
            setCategories(data);
        }).catch(() => {});
    }, []);

    const getParams = useCallback((page) => {
        const params = { page };
        if (sortBy === "price-asc") params.sortBy = "priceAsc";
        else if (sortBy === "price-desc") params.sortBy = "priceDESC";
        else if (sortBy === "name") params.sortBy = "name";
        if (selectedCategory) params.category = selectedCategory;
        return params;
    }, [sortBy, selectedCategory]);

    useEffect(() => {
        fetchProducts(getParams(1));
    }, [sortBy, selectedCategory]);

    return (
        <>
            <Carousel />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-400">
                        <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-600 font-medium">Sản phẩm</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Sản phẩm</h1>
                        <div className="w-16 h-1 bg-amber-400 rounded-full mt-2 mb-2" />
                        <p className="text-gray-500">Có <span className="font-semibold text-gray-700">{pagination.total}</span> sản phẩm</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition appearance-none cursor-pointer"
                        >
                            <option value="default">Mặc định</option>
                            <option value="price-asc">Giá: Thấp đến cao</option>
                            <option value="price-desc">Giá: Cao đến thấp</option>
                            <option value="name">Tên A-Z</option>
                        </select>

                        {/* View Mode */}
                        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`p-2.5 transition ${viewMode === "grid" ? "bg-amber-400 text-white" : "bg-white text-gray-500 hover:bg-amber-50 hover:text-amber-500"}`}
                            >
                                <FontAwesomeIcon icon={faThLarge} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("list")}
                                className={`p-2.5 transition ${viewMode === "list" ? "bg-amber-400 text-white" : "bg-white text-gray-500 hover:bg-amber-50 hover:text-amber-500"}`}
                            >
                                <FontAwesomeIcon icon={faList} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6 shadow-soft">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-1 h-5 bg-amber-400 rounded-full" />
                                <h3 className="font-semibold text-gray-800">Danh mục</h3>
                            </div>
                            <ul className="space-y-1">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory("")}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                                            !selectedCategory
                                                ? "bg-amber-50 text-amber-600 border-l-2 border-amber-400"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-2 border-transparent"
                                        }`}
                                    >
                                        <span className={`size-2 rounded-full ${!selectedCategory ? "bg-amber-400" : "bg-gray-300"}`} />
                                        Tất cả
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat._id}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedCategory(cat._id)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                                                selectedCategory === cat._id
                                                    ? "bg-amber-50 text-amber-600 border-l-2 border-amber-400"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-2 border-transparent"
                                            }`}
                                        >
                                            <span className={`size-2 rounded-full ${selectedCategory === cat._id ? "bg-amber-400" : "bg-gray-300"}`} />
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <Skeleton.ProductCard count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="size-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl text-red-400" />
                                </div>
                                <p className="text-gray-600 mb-6">{error}</p>
                                <Button variant="primary" onClick={() => fetchProducts(getParams(pagination.page))}>
                                    Thử lại
                                </Button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="size-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                                    <FontAwesomeIcon icon={faBoxOpen} className="text-4xl text-gray-300" />
                                </div>
                                <p className="text-gray-500 mb-2 text-lg font-medium">Không tìm thấy sản phẩm</p>
                                <p className="text-gray-400 text-sm mb-6">Thử thay đổi bộ lọc hoặc danh mục</p>
                                {(sortBy !== "default" || selectedCategory) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSortBy("default");
                                            setSelectedCategory("");
                                        }}
                                    >
                                        Xoá bộ lọc
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                                {products.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/products/${product._id}`}
                                        className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-pop hover:border-amber-200 transition-all duration-300 group ${viewMode === "list" ? "flex" : "flex flex-col"}`}
                                    >
                                        <div className={`relative ${viewMode === "list" ? "w-52 shrink-0" : ""}`}>
                                            <div className={`w-full ${viewMode === "list" ? "h-full" : "h-56"} bg-gray-100 overflow-hidden`}>
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
                                                        <FontAwesomeIcon icon={faImage} className="text-3xl" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                                                {product.sold > 0 && (
                                                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                        <FontAwesomeIcon icon={faFire} className="text-[9px]" />
                                                        Hot
                                                    </div>
                                                )}
                                                {product.stock !== undefined && (
                                                    <div className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-medium flex items-center gap-1 shadow-sm ${
                                                        product.stock > 0
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-gray-500 text-white"
                                                    }`}>
                                                        <span className={`size-1.5 rounded-full ${product.stock > 0 ? "bg-white" : "bg-gray-300"}`} />
                                                        {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col flex-1 min-w-0">
                                            {product.category?.name && (
                                                <p className="text-[11px] font-semibold tracking-wider uppercase text-amber-500 mb-1.5">
                                                    {product.category.name}
                                                </p>
                                            )}
                                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 leading-snug">
                                                {product.name}
                                            </h3>
                                            {viewMode === "list" && product.description && (
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </p>
                                            )}
                                            <div className="mt-auto">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xl font-bold text-amber-600">{formatCurrency(product.price)}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => addToCart(product, e)}
                                                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 shadow-sm ${
                                                        addedMap[product._id]
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-amber-400 hover:bg-amber-500 text-white hover:shadow-md"
                                                    }`}
                                                >
                                                    <FontAwesomeIcon icon={addedMap[product._id] ? faCheck : faShoppingCart} className="text-sm" />
                                                    {addedMap[product._id] ? "Đã thêm" : "Thêm vào giỏ"}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Pagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            total={pagination.total}
                            label="sản phẩm"
                            onChange={(p) => fetchProducts(getParams(p))}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
