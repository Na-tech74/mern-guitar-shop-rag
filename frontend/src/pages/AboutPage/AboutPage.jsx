import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMusic,
    faAward,
    faUsers,
    faGuitar,
    faHeadset,
    faGift,
    faShield,
    faStar,
    faHeart,
    faTag,
    faLeaf,
    faQuoteLeft,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import useAboutData from "./hooks/useAboutData";

const iconMap = {
    music: faMusic,
    award: faAward,
    users: faUsers,
    guitar: faGuitar,
    headset: faHeadset,
    gift: faGift,
    shield: faShield,
    star: faStar,
    heart: faHeart,
    tag: faTag,
    leaf: faLeaf,
};

export default function AboutPage() {
    const { content, loading } = useAboutData();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full size-12 border-b-2 border-amber-400" />
            </div>
        );
    }

    const header = content?.header || {};
    const intro = content?.intro || {};
    const story = content?.story || {};
    const stats = content?.stats?.items || [];
    const team = content?.team || {};
    const commitments = content?.commitments || {};
    const storyImages = story.images || [];

    return (
        <div className="bg-white text-gray-900">

            {/* Hero */}
            <section className="border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
                    <nav className="text-sm mb-10">
                        <ol className="flex items-center gap-2 text-gray-400">
                            <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                            <li className="text-gray-300">/</li>
                            <li className="text-gray-600 font-medium">{header.breadcrumbLabel || "Giới thiệu"}</li>
                        </ol>
                    </nav>
                    <div className="max-w-3xl">
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
                            About us
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
                            Câu chuyện về <span className="text-amber-500">Nam Acoustic</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-500 leading-relaxed">
                            {intro.tagline || "Cửa hàng nhạc cụ hàng đầu Việt Nam, mang đến những sản phẩm chất lượng nhất cho đam mê âm nhạc của bạn."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Story + Grid 2x2 */}
            {storyImages.length > 0 && (
                <section className="py-20 sm:py-28">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                                {story.title || "Câu chuyện của chúng tôi"}
                            </h2>
                            <div className="w-16 h-1 bg-amber-400 rounded-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {storyImages.slice(0, 4).map((src, idx) => (
                                <div
                                    key={idx}
                                    className={`relative overflow-hidden rounded-2xl bg-gray-100 shadow-soft ${
                                        idx === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                                    }`}
                                >
                                    <img
                                        src={src}
                                        alt={`${story.title || "Câu chuyện"} ${idx + 1}`}
                                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            ))}
                        </div>
                        {story.content && (
                            <div className="max-w-3xl mx-auto text-center">
                                <FontAwesomeIcon icon={faQuoteLeft} className="text-amber-300 text-2xl mb-4" />
                                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed italic">
                                    {story.content}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Stats band */}
            {stats.length > 0 && stats.some((s) => s.value || s.label) && (
                <section className="bg-gradient-to-r from-amber-50 to-amber-50/50 py-16 sm:py-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                            {stats.map((s, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-500 tracking-tight">
                                        {s.value || "—"}
                                    </div>
                                    <div className="text-sm sm:text-base text-gray-600 mt-2 font-medium">
                                        {s.label || ""}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Team */}
            {team.members?.length > 0 && team.members.some((m) => m.name) && (
                <section className="py-20 sm:py-28">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mb-14">
                            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
                                Our team
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                                {team.title || "Đội ngũ của chúng tôi"}
                            </h2>
                            <div className="w-16 h-1 bg-amber-400 rounded-full mb-4" />
                            {team.subtitle && (
                                <p className="text-lg text-gray-500 leading-relaxed">
                                    {team.subtitle}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                            {team.members.map((m, idx) => (
                                <div key={idx} className="group">
                                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-5 shadow-soft">
                                        {m.avatar ? (
                                            <img
                                                src={m.avatar}
                                                alt={m.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-bold">
                                                {m.name?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        {m.name || ""}
                                    </h3>
                                    <p className="text-sm text-amber-500 font-medium mb-2">
                                        {m.role || ""}
                                    </p>
                                    {m.bio && (
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {m.bio}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Commitments */}
            {commitments.items?.length > 0 && commitments.items.some((c) => c.title) && (
                <section className="py-20 sm:py-28 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mb-14">
                            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
                                Our values
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                                {commitments.title || "Cam kết của chúng tôi"}
                            </h2>
                            <div className="w-16 h-1 bg-amber-400 rounded-full mb-4" />
                            {commitments.subtitle && (
                                <p className="text-lg text-gray-500 leading-relaxed">
                                    {commitments.subtitle}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {commitments.items.map((c, idx) => {
                                const Icon = iconMap[c.icon] || faStar;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-soft hover:shadow-pop hover:border-amber-200 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className="size-8 flex items-center justify-center shrink-0 mt-0.5">
                                                <FontAwesomeIcon icon={Icon} className="text-gray-900 text-base" />
                                            </div>
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                                                {c.title || ""}
                                            </h3>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                            {c.description || ""}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center mt-12">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-lg font-medium transition shadow-sm hover:shadow-md text-sm"
                            >
                                Khám phá sản phẩm
                                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
