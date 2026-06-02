import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGuitar } from "@fortawesome/free-solid-svg-icons";
const defaultImages = {
    "guitar-acoustic": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80",
    "guitar-classic": "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=400&q=80",
    "ukulele": "https://images.unsplash.com/photo-1514117445517-2ec90fa4b84b?w=400&q=80",
    "piano": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80"
};
export default function CategoriesSection({ categories }) {
    const getImage = (category) => {
        if (category.image) return category.image;
        return defaultImages[category.slug] || null;
    };
    return (
        <section className="py-6" style={{ contentVisibility: 'auto' }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Danh mục sản phẩm</h2>
                    <p className="text-gray-500">Lựa chọn danh mục phù hợp với nhu cầu của bạn</p>
                </div>
                {categories.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-xl animate-pulse overflow-hidden">
                                <div className="h-40 bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {categories.slice(0,6).map((category) => {
                            const image = getImage(category);
                            return (
                                <Link
                                    key={category._id}
                                    to={`/products?category=${category._id}`}
                                    className="group bg-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="relative h-40 overflow-hidden">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={category.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faGuitar} className="text-4xl text-amber-600" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-semibold text-gray-800 group-hover:text-amber-600">{category.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {category.description || "Xem sản phẩm"}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}