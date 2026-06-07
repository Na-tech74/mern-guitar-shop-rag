import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGuitar } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "../../../components/Skeleton";

export default function CategoriesSection({ categories, title, subtitle }) {
    return (
        <section className="py-16 bg-white min-h-[1100px] md:min-h-[600px]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{title || "Danh mục sản phẩm"}</h2>
                    <div className="w-16 h-1 bg-amber-400 rounded-full mx-auto mb-3" />
                    <p className="text-gray-500">{subtitle || "Lựa chọn danh mục phù hợp với nhu cầu của bạn"}</p>
                </div>
                {categories.length === 0 ? (
                    <Skeleton.CategoryCard count={6} />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
                        {categories.slice(0,6).map((category) => (
                            <Link
                                key={category._id}
                                to={`/products?category=${category._id}`}
                                className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-pop transition-all duration-300"
                            >
                                <div className="relative h-40 overflow-hidden">
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faGuitar} className="text-4xl text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-amber-500 transition-colors">{category.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                        {category.description || "Xem sản phẩm"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}