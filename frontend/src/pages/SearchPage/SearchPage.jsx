import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBoxOpen, faSlidersH, faTimes } from "@fortawesome/free-solid-svg-icons";
import { productAPI, categoryAPI } from "../../api";
import Skeleton from "../../components/Skeleton";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import ProductCard from "../../components/ProductCard";
import SortDropdown from "../../components/SortDropdown";
import CategorySidebar, { MobileFilterDrawer } from "../../components/CategorySidebar";
import useCart from "../ProductsPage/hooks/useCart";

const sortOptions = [
    { value: "price-desc", label: "Giá: Cao → Thấp" },
    { value: "price-asc", label: "Giá: Thấp → Cao" },
    { value: "name", label: "Tên A-Z" },
];

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("price-desc");
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const { addToCart, addedMap } = useCart();
    const [searchInput, setSearchInput] = useState(query);

    useEffect(() => {
        categoryAPI.getAll().then((res) => {
            setCategories(res.data?.data?.categories || []);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setPagination({ page: 1, totalPages: 1, total: 0 });
            return;
        }
        setLoading(true);
        const params = { search: query, page: pagination.page };
        if (sortBy === "price-asc") params.sortBy = "priceAsc";
        else if (sortBy === "price-desc") params.sortBy = "priceDESC";
        else if (sortBy === "name") params.sortBy = "name";
        if (selectedCategory) params.category = selectedCategory;

        productAPI.getAll(params)
            .then((res) => {
                const data = res.data?.data;
                setResults(data?.products || []);
                setPagination((prev) => ({
                    page: data?.pagination?.page || prev.page,
                    totalPages: data?.pagination?.totalPages || 1,
                    total: data?.pagination?.total || 0,
                }));
            })
            .catch(() => {
                setResults([]);
                setPagination({ page: 1, totalPages: 1, total: 0 });
            })
            .finally(() => setLoading(false));
    }, [query, sortBy, selectedCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;
        setSearchParams({ q: searchInput.trim() });
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        setShowMobileFilter(false);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tìm kiếm" }]} />

                <div className="mb-8">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Tìm kiếm sản phẩm</h1>
                    <div className="w-16 h-1 bg-amber-400 rounded-full mt-2 mb-4" />

                    <form onSubmit={handleSearch} className="relative max-w-2xl">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Nhập tên sản phẩm cần tìm..."
                            className="w-full pl-12 pr-5 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                        />
                        <button
                            type="submit"
                            className="absolute left-1 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center text-gray-400 hover:text-amber-500 transition"
                        >
                            <FontAwesomeIcon icon={faSearch} className="text-base" />
                        </button>
                    </form>

                    {query && (
                        <p className="text-sm text-gray-500 mt-3">
                            Kết quả cho từ khóa: <span className="font-semibold text-gray-700">"{query}"</span>
                            {!loading && (
                                <span className="ml-1">
                                    – có <span className="font-semibold text-amber-600">{pagination.total}</span> sản phẩm
                                </span>
                            )}
                        </p>
                    )}
                </div>

                {query && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2">
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
                            <SortDropdown value={sortBy} onChange={handleSortChange} options={sortOptions} />
                            {selectedCategory && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory("")}
                                    className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 hover:text-amber-600 transition"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                    Bỏ lọc
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <MobileFilterDrawer
                    open={showMobileFilter}
                    onClose={() => setShowMobileFilter(false)}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onChange={handleCategoryChange}
                />

                <div className="flex gap-8">
                    {query && (
                        <CategorySidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onChange={handleCategoryChange}
                        />
                    )}

                    <div className="flex-1 min-w-0">
                        {!query ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="size-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                                    <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-300" />
                                </div>
                                <p className="text-gray-500 mb-2 text-lg font-medium">Nhập từ khóa để tìm kiếm</p>
                                <p className="text-gray-400 text-sm">Gõ tên sản phẩm bạn muốn tìm vào ô bên trên</p>
                            </div>
                        ) : loading ? (
                            <Skeleton.ProductCard count={8} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" />
                        ) : results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="size-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                                    <FontAwesomeIcon icon={faBoxOpen} className="text-4xl text-gray-300" />
                                </div>
                                <p className="text-gray-500 mb-2 text-lg font-medium">Không tìm thấy sản phẩm nào</p>
                                <p className="text-gray-400 text-sm mb-6">Thử thay đổi từ khóa hoặc danh mục</p>
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
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                    {results.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onAddToCart={addToCart}
                                            isAdded={!!addedMap[product._id]}
                                        />
                                    ))}
                                </div>

                                <Pagination
                                    page={pagination.page}
                                    totalPages={pagination.totalPages}
                                    total={pagination.total}
                                    label="sản phẩm"
                                    onChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
