import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const defaultTypes = [
    {
        title: "Guitar Acoustic",
        subtitle: "Đa dạng mẫu mã",
        image: "https://res.cloudinary.com/dsh9anp7p/image/upload/v1778732551/guitar-shop/blogs/rnrmbpbtrjlqiyrpc9f9.jpg",
        link: "/products"
    },
    {
        title: "Guitar Classic",
        subtitle: "Thiết kế sang trọng",
        image: "https://res.cloudinary.com/dsh9anp7p/image/upload/v1779347115/guitar-shop/blogs/xgdfhlwkckxxftyeetrn.jpg",
        link: "/products"
    },
    {
        title: "Ukulele",
        subtitle: "Nhỏ gọn, tiện lợi",
        image: "https://res.cloudinary.com/dsh9anp7p/image/upload/v1779346001/guitar-shop/products/lsyl4pypymtcuxf5lzca.jpg",
        link: "/products"
    }
];

export default function FeaturedTypes({ data }) {
    const items = (data?.types && data.types.length > 0) ? data.types : defaultTypes;
    const title = data?.title || "Bộ sưu tập";
    const subtitle = data?.subtitle || "Khám phá các dòng guitar phổ biến nhất";

    return (
        <section className="py-10" style={{ contentVisibility: 'auto' }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                    <p className="text-gray-500">{subtitle}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {items.map((item, idx) => (
                        <Link
                            key={`${item.title}-${idx}`}
                            to={item.link || "/products"}
                            className="group relative h-[200px] rounded-2xl overflow-hidden"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-amber-500/50 rounded-2xl transition-all duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-xl font-bold text-white mb-1.5">{item.title}</h3>
                                <p className="text-sm text-white/70 mb-4">{item.subtitle}</p>
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    Khám phá
                                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                                </span>
                            </div>
                            <div className="absolute top-4 right-4 size-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <FontAwesomeIcon icon={faArrowRight} className="text-white text-xs" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
