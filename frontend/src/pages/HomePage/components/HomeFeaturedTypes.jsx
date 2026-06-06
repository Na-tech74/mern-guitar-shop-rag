import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function FeaturedTypes({ data }) {
    const items = data?.types || [];
    if (items.length === 0) return null;
    const title = data?.title || "Bộ sưu tập";
    const subtitle = data?.subtitle || "Khám phá các dòng guitar phổ biến nhất";

    return (
        <section className="py-16 bg-gray-50" style={{ contentVisibility: 'auto' }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                    <div className="w-16 h-1 bg-amber-400 rounded-full mx-auto mb-3" />
                    <p className="text-gray-500">{subtitle}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {items.map((item, idx) => (
                        <Link
                            key={`${item.title}-${idx}`}
                            to={item.link || "/products"}
                            className="group relative h-[320px] rounded-2xl overflow-hidden shadow-soft hover:shadow-pop transition-all duration-500"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-amber-400/30 rounded-2xl transition-all duration-500" />
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center justify-center size-8 rounded-full bg-white/15 backdrop-blur-sm text-white/80 text-xs font-semibold">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-white/60 mb-4 line-clamp-2">{item.subtitle}</p>
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 group-hover:text-amber-300 transition-colors">
                                    Khám phá
                                    <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-amber-400/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
