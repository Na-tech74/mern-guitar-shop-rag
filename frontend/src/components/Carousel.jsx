import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCartPlus, faMusic } from "@fortawesome/free-solid-svg-icons";

const slides = [
    {
        id: 1,
        title: "Guitar Acoustic Cao Cấp",
        subtitle: "Chất lượng âm thanh tuyệt vời cho mọi không gian",
        description: "Khám phá bộ sưu tập guitar acoustic cao cấp với thiết kế tinh xảo và âm thanh sống động",
        image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1600&q=80",
        cta: "Mua ngay",
        path: "/products",
        badge: "Bestseller"
    },
    {
        id: 2,
        title: "Piano Chính Hãng",
        subtitle: "Biểu diễn chuyên nghiệp với âm thanh hoàn hảo",
        description: "Bộ sưu tập piano điện tử và acoustic từ các thương hiệu nổi tiếng thế giới",
        image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1600&q=80",
        cta: "Khám phá",
        path: "/products",
        badge: "New Arrival"
    },
    {
        id: 3,
        title: "Ukulele & Nhạc Cụ",
        subtitle: "Học nhạc cùng giáo viên chuyên nghiệp",
        description: "Đăng ký khóa học guitar, piano, violin và nhiều nhạc cụ khác với giáo viên giàu kinh nghiệm",
        image: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=1600&q=80",
        cta: "Đăng ký ngay",
        path: "/products",
        badge: "Limited"
    },
];

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const goNext = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 700);
    }, [isAnimating]);

    const goPrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 700);
    };

    const goTo = (index) => {
        if (isAnimating || index === currentSlide) return;
        setIsAnimating(true);
        setCurrentSlide(index);
        setTimeout(() => setIsAnimating(false), 700);
    };

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(goNext, 5000);
        return () => clearInterval(timer);
    }, [isPaused, goNext]);

    return (
        <div
            className="relative w-full h-[400px] md:h-[480px] lg:h-[520px] overflow-hidden group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                        index === currentSlide
                            ? "opacity-100 z-10"
                            : "opacity-0 z-0"
                    }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            transform: index === currentSlide ? "scale(100%)" : "scale(105%)"
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
            ))}

            {/* Badge */}
            {slides[currentSlide].badge && (
                <div className="absolute top-4 md:top-6 left-4 md:left-6 z-20">
                    <span className="px-3 md:px-4 py-1.5 bg-amber-500 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg">
                        {slides[currentSlide].badge}
                    </span>
                </div>
            )}

            {/* Content */}
            <div className="relative h-full flex items-center z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
                            <FontAwesomeIcon icon={faMusic} className="text-amber-400" />
                            <span className="text-white/90 text-sm">Nam Acoustic</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 leading-tight">
                            {slides[currentSlide].title}
                            <span className="block text-amber-400 text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2">
                                Chất lượng cao
                            </span>
                        </h1>

                        <p className="text-base md:text-lg lg:text-xl text-white/80 mb-2">
                            {slides[currentSlide].subtitle}
                        </p>
                        <p className="text-sm md:text-base text-white/60 mb-6 md:mb-8 max-w-lg">
                            {slides[currentSlide].description}
                        </p>

                        <div className="flex flex-wrap gap-3 md:gap-4">
                            <Link
                                to={slides[currentSlide].path}
                                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                            >
                                {slides[currentSlide].cta}
                                <FontAwesomeIcon icon={faCartPlus} className="transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/products"
                                className="px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/30"
                            >
                                Xem thêm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:scale-110 opacity-0 group-hover:opacity-100"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
                onClick={goNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:scale-110 opacity-0 group-hover:opacity-100"
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goTo(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? "w-6 md:w-8 bg-amber-500"
                                : "w-2 bg-white/50 hover:bg-white/80"
                        }`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                    style={{
                        width: `${((currentSlide + 1) / slides.length) * 100}%`
                    }}
                />
            </div>
        </div>
    );
}