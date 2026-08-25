import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMusic, faChevronRight, faTrademark } from "@fortawesome/free-solid-svg-icons";
import { getOptimizedImage } from "../../../helpers/image";
import Skeleton from "../../../components/Skeleton";
import Pagination from "../../../components/Pagination";

const ITEMS_PER_PAGE = 4;
const MAX_PAGES = 5;

const CATEGORY_ORDER = ["guitar", "acoustic", "classic", "electric", "piano", "ukulele", "kèn", "trống", "phụ kiện"];

function sortByCategoryOrder(categories) {
    return [...categories].sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aIdx = CATEGORY_ORDER.findIndex((k) => aName.includes(k));
        const bIdx = CATEGORY_ORDER.findIndex((k) => bName.includes(k));
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
}

function distributeEvenly(items, perPage, maxPages) {
    const sorted = [...items].sort((a, b) => b.price - a.price);
    const half = Math.ceil((perPage * maxPages) / 2);
    const high = sorted.slice(0, half);
    const low = sorted.slice(-half).reverse();

    const pages = [];
    for (let i = 0; i < maxPages; i++) {
        const page = [];
        if (high[i]) page.push(high[i]);
        if (low[i]) page.push(low[i]);
        if (high[i + maxPages]) page.push(high[i + maxPages]);
        if (low[i + maxPages]) page.push(low[i + maxPages]);
        if (page.length > 0) {
            pages.push(page.sort((a, b) => b.price - a.price));
        }
    }
    return pages.flat();
}

export default function FeaturedProducts({ products, categories, title, subtitle }) {
    const [pages, setPages] = useState({});

    const grouped = useMemo(() => {
        const parents = sortByCategoryOrder(
            (categories || []).filter((c) => !c.parent)
        );

        const childMap = {};
        (categories || []).forEach((c) => {
            if (c.parent?._id) {
                const pid = c.parent._id;
                if (!childMap[pid]) childMap[pid] = [];
                childMap[pid].push(c._id);
            }
        });

        return parents
            .map((parent) => {
                const childIds = childMap[parent._id] || [];
                const allIds = [parent._id, ...childIds];
                const items = distributeEvenly(
                    (products || []).filter((p) => {
                        const catId = p.category?._id || p.category;
                        return allIds.includes(catId);
                    }),
                    ITEMS_PER_PAGE,
                    MAX_PAGES
                );
                return { ...parent, items };
            })
            .filter((c) => c.items.length > 0);
    }, [products, categories]);

    const totalPages = useMemo(() => {
        const t = {};
        grouped.forEach((c) => {
            t[c._id] = Math.min(MAX_PAGES, Math.max(1, Math.ceil(c.items.length / ITEMS_PER_PAGE)));
        });
        return t;
    }, [grouped]);

    const goToPage = (catId, page) => {
        setPages((prev) => ({ ...prev, [catId]: page }));
    };

    if (products.length === 0) {
        return (
            <section className="py-6 sm:py-8 lg:py-10 bg-white min-h-[2000px] sm:min-h-[2400px] md:min-h-[2200px]">
                <div className="max-w-7xl mx-auto px-4 space-y-8 sm:space-y-10 lg:space-y-12">
                    <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                        <div className="w-16 h-1 bg-amber-400 rounded-full mx-auto mb-3" />
                        <p className="text-sm sm:text-base text-gray-500">{subtitle}</p>
                    </div>
                    {[0, 1].map((i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <div className="w-1 h-7 sm:h-8 bg-amber-400 rounded-full" />
                                    <div>
                                        <Skeleton.Block className="h-5 sm:h-6 w-40 sm:w-48 mb-2" />
                                        <Skeleton.Block className="h-3 w-28 sm:w-32" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <div key={j} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <Skeleton.Block className="h-44 sm:h-56 lg:h-60 rounded-none" />
                                        <div className="p-3 sm:p-4 space-y-2">
                                            <Skeleton.Block className="h-3 sm:h-4 w-3/4" />
                                            <Skeleton.Block className="h-3 w-full" />
                                            <Skeleton.Block className="h-3 w-5/6" />
                                            <div className="flex justify-between pt-1">
                                                <Skeleton.Block className="h-4 sm:h-5 w-1/3" />
                                                <Skeleton.Block className="h-3 sm:h-4 w-1/6" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (grouped.length === 0) {
        return (
            <section className="py-6 sm:py-8 lg:py-10 bg-white min-h-[600px] sm:min-h-[800px]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-10 sm:py-12">
                        <FontAwesomeIcon icon={faMusic} className="text-4xl sm:text-5xl text-gray-300 mb-4" />
                        <p className="text-sm sm:text-base text-gray-500">Chưa có sản phẩm nào</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-6 sm:py-8 lg:py-10 bg-white min-h-[1500px] sm:min-h-[1900] md:min-h-[1700px]">
            <div className="max-w-7xl mx-auto px-4 space-y-8 sm:space-y-10 lg:space-y-12">
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                    <div className="w-16 h-1 bg-amber-400 rounded-full mx-auto mb-3" />
                    <p className="text-sm sm:text-base text-gray-500">{subtitle }</p>
                </div>
                {grouped.map((category) => {
                    const tp = totalPages[category._id] || 1;
                    const page = Math.min(Math.max(pages[category._id] || 1, 1), tp);
                    const start = (page - 1) * ITEMS_PER_PAGE;
                    const paginatedItems = category.items.slice(start, start + ITEMS_PER_PAGE);

                    return (
                        <div key={category._id} id={`fp-${category.slug || category.name.toLowerCase().replace(/\s+/g, "-")}`} className="scroll-mt-[140px]">
                            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                                    <div className="w-1 h-7 sm:h-8 bg-amber-400 rounded-full shrink-0" />
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                                            <span className="text-amber-500">/</span> {category.name}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-gray-400">Sản phẩm được bán nhiều nhất</p>
                                    </div>
                                </div>
                                <Link to={`/products?category=${category._id}`} className="hidden md:flex shrink-0 items-center gap-1 text-amber-500 hover:text-amber-600 font-medium text-sm transition-colors">
                                    Xem tất cả <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                {paginatedItems.map((product) => (
                                    <div key={product._id} className="animate-fadeInUp">
                                        <ProductCard product={product} categoryName={category.name} />
                                    </div>
                                ))}

                            </div>
                            <Pagination
                                page={page}
                                totalPages={tp}
                                total={category.items.length}
                                label="sản phẩm"
                                scrollToTop={false}
                                forceShow
                                wrapAround
                                onChange={(p) => goToPage(category._id, p)}
                            />
                            <div className="text-center mt-3 sm:mt-4 md:hidden">
                                <Link to={`/products?category=${category._id}`} className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-600 font-medium text-sm transition-colors">
                                    Xem tất cả {category.name.toLowerCase()} <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

const ProductCard = ({ product, categoryName }) => {
    const isAcoustic = categoryName?.toLowerCase().includes("acoustic");
    return (
        <Link to={`/products/${product._id}`} className="group block bg-white rounded-lg border border-gray-200 hover:border-amber-200 shadow-soft hover:shadow-pop transition-all duration-300 overflow-hidden h-full">
            <div className="relative overflow-hidden">
                <img
                    src={getOptimizedImage(product.images?.[0], 400) || "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80"}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-44 sm:h-56 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.sold > 0 && !isAcoustic && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-sm">
                        Hot
                    </div>
                )}
            </div>
            <div className="p-3 sm:p-4 bg-white rounded-b-lg">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                    {product.name}
                </h3>
                {product.brand?.name && (
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <FontAwesomeIcon icon={faTrademark} className="text-[8px] sm:text-[10px]" />
                        {product.brand.name}
                    </p>
                )}
                <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                    {product.description}
                </p>
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                        {product.originalPrice > product.price && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through shrink-0">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                            </span>
                        )}
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-600 truncate">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                        <FontAwesomeIcon icon={faStar} className="text-[10px] sm:text-xs text-amber-400" />
                        <span className="text-xs sm:text-sm text-gray-400">4.5</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
