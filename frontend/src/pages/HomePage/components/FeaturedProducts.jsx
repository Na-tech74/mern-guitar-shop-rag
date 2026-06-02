import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowRight, faMusic, faGuitar, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getOptimizedImage } from "../../../helpers/format";

export default function FeaturedProducts({ products, categories, loading }) {
    const grouped = useMemo(() => {
        const map = {};
        (products || []).forEach((p) => {
            const catId = p.category?._id || p.category;
            if (!map[catId]) map[catId] = [];
            map[catId].push(p);
        });
        return categories
            .map((c) => ({
                ...c,
                items: (map[c._id] || []).slice(0, 4),
            }))
            .filter((c) => c.items.length > 0);
    }, [products, categories]);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-xl animate-pulse overflow-hidden">
                                <div className="h-60 bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                                    <div className="pt-2 flex justify-between">
                                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                                        <div className="h-4 bg-gray-200 rounded w-1/6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (grouped.length === 0) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-12">
                        <FontAwesomeIcon icon={faMusic} className="text-5xl text-gray-300 mb-4" />
                        <p className="text-gray-500">Chưa có sản phẩm nào</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 space-y-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Sản Phẩm Nổi Bật</h2>
                    <p className="text-gray-500">Mang đến cho khách hàng những cây đàn chất lượng nhất</p>
                </div>
                {grouped.map((category, ci) => (
                    <div key={category._id}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                            </div>
                            <Link to={`/products?category=${category._id}`} className="hidden md:flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm">
                                Xem tất cả <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {category.items.map((product, i) => (
                                <div key={product._id} className="animate-fadeInUp" style={{ animationDelay: `${(ci * 4 + i) * 60}ms` }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-4 md:hidden">
                            <Link to={`/products?category=${category._id}`} className="inline-flex items-center gap-1 text-amber-600 font-medium text-sm">
                                Xem tất cả {category.name.toLowerCase()} <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

const ProductCard = ({ product }) => {
    return (
        <Link to={`/products/${product._id}`} className="group block bg-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative overflow-hidden">
                <img
                    src={getOptimizedImage(product.images?.[0], 400) || "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80"}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.sold > 0 && (
                    <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                        Hot
                    </div>
                )}
            </div>
            <div className="p-4 bg-gray-200 rounded-b-xl">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-amber-600">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                        <FontAwesomeIcon icon={faStar} className="text-xs" />
                        <span className="text-sm text-gray-500">4.5</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};