import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList, faBoxOpen, faTriangleExclamation, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import useProducts from "./hooks/useProducts";
import { categoryAPI } from "../../api";
import Carousel from "../../components/Carousel";
import Skeleton from "../../components/Skeleton";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import ProductCard from "../../components/ProductCard";
import SortDropdown from "../../components/SortDropdown";
import CategorySidebar, { MobileFilterDrawer } from "../../components/CategorySidebar";
import useCart from "./hooks/useCart";

const sortOptions = [
    { value: "price-desc", label: "Giá: Cao → Thấp" },
    { value: "price-asc", label: "Giá: Thấp → Cao" },
    { value: "name", label: "Tên A-Z" },
];

export default function ProductsPage() {

    const [searchParams] = useSearchParams();
    const { products, loading, error, pagination, fetchProducts } = useProducts();
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("price-desc");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const didAutoSelect = useRef(false);
    const { addToCart, addedMap } = useCart();

    const categoryNames = useMemo(() => {
        const order = ["Guitar Acoustic", "Guitar Classic", "Guitar Bass", "Guitar Electric", "Ukulele", "Piano"];
        const map = {};
        order.forEach((name, i) => { map[name] = i; });
        return map;
    }, []);

    const sortedProducts = useMemo(() => {
        if (selectedCategory) return products;
        return [...products].sort((a, b) => {
            const aName = a.category?.name;
            const bName = b.category?.name;
            const aOrder = aName && aName in categoryNames ? categoryNames[aName] : Infinity;
            const bOrder = bName && bName in categoryNames ? categoryNames[bName] : Infinity;
            return aOrder - bOrder;
        });
    }, [products, selectedCategory, categoryNames]);

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

    useEffect(() => {
        categoryAPI.getAll().then((res) => {
            const data = res.data?.data?.categories || [];
            setCategories(data);
            if (!didAutoSelect.current && searchParams.get("all") !== "1") {
                didAutoSelect.current = true;
                const acoustic = data.find((cat) => cat.name === "Guitar Acoustic");
                if (acoustic) setSelectedCategory(acoustic._id);
            }
        }).catch(() => {});
    }, []);

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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Sản phẩm</h1>
                        <div className="w-16 h-1 bg-amber-400 rounded-full mt-2 mb-2" />
                        <p className="text-sm sm:text-base text-gray-500">Có <span className="font-semibold text-gray-700">{pagination.total}</span> sản phẩm</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                            {/* Mobile Filter Button + Badge */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setShowMobileFilter(true)}
                                    className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:border-amber-400 hover:text-amber-600 transition"
                                >
                                    <FontAwesomeIcon icon={faSlidersH} className="text-xs" />
                                    Bộ lọc
                                </button>
                                {selectedCategory && (
                                    <span className="size-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
                                )}
                            </div>
                            {/* Sort */}
                            <SortDropdown value={sortBy} onChange={setSortBy} options={sortOptions} />
                        </div>
                        {/* View Mode */}
                        <div className="flex border border-gray-200 rounded-xl overflow-hidden sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`flex-1 p-2 sm:p-2.5 transition ${viewMode === "grid" ? "bg-amber-400 text-white" : "bg-white text-gray-500 hover:bg-amber-50 hover:text-amber-500"}`}
                            >
                                <FontAwesomeIcon icon={faThLarge} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("list")}
                                className={`flex-1 p-2 sm:p-2.5 transition ${viewMode === "list" ? "bg-amber-400 text-white" : "bg-white text-gray-500 hover:bg-amber-50 hover:text-amber-500"}`}
                            >
                                <FontAwesomeIcon icon={faList} />
                            </button>
                        </div>
                    </div>
                </div>

                <MobileFilterDrawer
                    open={showMobileFilter}
                    onClose={() => setShowMobileFilter(false)}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onChange={setSelectedCategory}
                />

                {/* Content */}
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <CategorySidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onChange={setSelectedCategory}
                    />

                    {/* Products Grid */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <Skeleton.ProductCard count={6} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" />
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
                        ) : sortedProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="size-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                                    <FontAwesomeIcon icon={faBoxOpen} className="text-4xl text-gray-300" />
                                </div>
                                <p className="text-gray-500 mb-2 text-lg font-medium">Không tìm thấy sản phẩm</p>
                                <p className="text-gray-400 text-sm mb-6">Thử thay đổi bộ lọc hoặc danh mục</p>
                                {(sortBy !== "price-desc" || selectedCategory) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSortBy("price-desc");
                                            setSelectedCategory("");
                                        }}
                                    >
                                        Xoá bộ lọc
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" : "space-y-3 sm:space-y-4"}>
                                {sortedProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        viewMode={viewMode}
                                        onAddToCart={addToCart}
                                        isAdded={!!addedMap[product._id]}
                                    />
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
