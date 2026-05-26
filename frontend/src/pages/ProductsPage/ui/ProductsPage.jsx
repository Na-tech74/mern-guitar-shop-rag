import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList, faShoppingCart, faImage, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import useProducts from "../hooks/useProducts";
import { API } from "../../../api/axiosClient";
import { getOptimizedImage } from "../../../helpers/format";
import Carousel from "../../../components/Carousel";

const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};

export default function ProductsPage() {
    const { products, loading, pagination, fetchProducts } = useProducts();
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("default");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        API.get("/categories").then((res) => {
            const data = res.data?.data?.categories || [];
            setCategories(data);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        const params = {};
        if (sortBy === "price-asc") params.sortBy = "priceAsc";
        else if (sortBy === "price-desc") params.sortBy = "priceDESC";
        else if (sortBy === "name") params.sortBy = "name";
        if (selectedCategory) params.category = selectedCategory;
        fetchProducts(params);
    }, [sortBy, selectedCategory]);

    return (
        <>
            <Carousel />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Sản phẩm</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
                        <p className="text-gray-500 mt-1">Có {pagination.total} sản phẩm</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                        >
                            <option value="default">Mặc định</option>
                            <option value="price-asc">Giá: Thấp đến cao</option>
                            <option value="price-desc">Giá: Cao đến thấp</option>
                            <option value="name">Tên A-Z</option>
                        </select>

                        {/* View Mode */}
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 ${viewMode === "grid" ? "bg-amber-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                            >
                                <FontAwesomeIcon icon={faThLarge} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 ${viewMode === "list" ? "bg-amber-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
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
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Danh mục</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => setSelectedCategory("")}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition ${!selectedCategory
                                                ? "bg-amber-50 text-amber-600"
                                                : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                                            }`}
                                    >
                                        Tất cả
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat._id}>
                                        <button
                                            onClick={() => setSelectedCategory(cat._id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === cat._id
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                                                }`}
                                        >
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
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <FontAwesomeIcon icon={faImage} className="text-4xl mb-4 text-gray-300" />
                                <p>Không tìm thấy sản phẩm</p>
                            </div>
                        ) : (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                                {products.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/products/${product._id}`}
                                        className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-amber-100 transition-shadow group ${viewMode === "list" ? "flex" : ""}`}
                                    >
                                        <div className={`relative ${viewMode === "list" ? "w-48 shrink-0" : ""}`}>
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
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FontAwesomeIcon icon={faImage} className="text-3xl" />
                                                    </div>
                                                )}
                                                {product.stock !== undefined && (
                                                    <div className={`absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[11px] font-medium flex items-center gap-1 ${
                                                        product.stock > 0
                                                            ? "bg-green-500 text-white"
                                                            : "bg-red-500 text-white"
                                                    }`}>
                                                        <FontAwesomeIcon icon={product.stock > 0 ? faCheck : faXmark} className="text-[9px]" />
                                                        {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={`p-4 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                                            {product.category?.name && (
                                                <p className="text-xs text-amber-600 mb-1">{product.category.name}</p>
                                            )}
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                            <div className="mt-auto">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xl font-bold text-amber-600">{formatPrice(product.price)}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); /* add to cart */ }}
                                                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                                                >
                                                    <FontAwesomeIcon icon={faShoppingCart} />
                                                    Thêm vào giỏ
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => fetchProducts({ page, ...(selectedCategory ? { category: selectedCategory } : {}), ...(sortBy !== "default" ? { sortBy } : {}) })}
                                        className={`px-4 py-2 rounded-lg text-sm ${page === pagination.page
                                                ? "bg-amber-600 text-white"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-amber-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}