import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCartPlus, faMusic } from "@fortawesome/free-solid-svg-icons";

const transitionDuration = 600;

export default function Carousel({ data }) {
    const slides = data?.slides || [];
    const brand = data?.brand;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [prevSlide, setPrevSlide] = useState(null);
    const [direction, setDirection] = useState(1);

    const [transitioning, setTransitioning] = useState(false);
    const timerRef = useRef(null);

    const next = useCallback(() => {
        if (transitioning) return;
        setTransitioning(true);
        setDirection(1);
        setPrevSlide(currentSlide);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => { setTransitioning(false); setPrevSlide(null); }, transitionDuration);
    }, [currentSlide, transitioning, slides.length]);

    const prev = useCallback(() => {
        if (transitioning) return;
        setTransitioning(true);
        setDirection(-1);
        setPrevSlide(currentSlide);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => { setTransitioning(false); setPrevSlide(null); }, transitionDuration);
    }, [currentSlide, transitioning, slides.length]);

    const goTo = useCallback((index) => {
        if (transitioning || index === currentSlide) return;
        setTransitioning(true);
        setDirection(index > currentSlide ? 1 : -1);
        setPrevSlide(currentSlide);
        setCurrentSlide(index);
        setTimeout(() => { setTransitioning(false); setPrevSlide(null); }, transitionDuration);
    }, [currentSlide, transitioning]);

    // Dùng ref để luôn gọi bản `next` mới nhất mà không phải re-subscribe interval mỗi lần slide đổi
    const nextRef = useRef(next);
    useEffect(() => { nextRef.current = next; }, [next]);

    useEffect(() => {
        let intervalId = null;

        const start = () => {
            if (intervalId) return;
            intervalId = setInterval(() => nextRef.current(), 3000);
        };
        const stop = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        const onVisibilityChange = () => {
            if (document.hidden) stop();
            else start();
        };

        if (!document.hidden) start();
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);

    if (slides.length === 0) return null;

    const slide = slides[currentSlide];
    const outgoing = prevSlide !== null ? slides[prevSlide] : null;

    return (
        <div
            className="relative w-full h-[400px] md:h-[480px] lg:h-[520px] overflow-hidden bg-gray-900"

        >
            {outgoing && (
                <img
                    src={outgoing.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: transitioning ? 0 : 1, transition: `opacity ${transitionDuration}ms ease` }}
                    decoding="async"
                />
            )}
            <img
                src={slide.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                style={{ opacity: prevSlide !== null ? 0 : 1, transition: `opacity ${transitionDuration}ms ease` }}
                onLoad={(e) => { if (prevSlide !== null) e.target.style.opacity = 1; }}
                fetchPriority={currentSlide === 0 && prevSlide === null ? "high" : "auto"}
                decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent pointer-events-none" />

            <div className="relative h-full flex items-center z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full mb-4 ring-1 ring-white/10">
                            <FontAwesomeIcon icon={faMusic} className="text-amber-400" />
                            <span className="text-white/90 text-sm">{brand}</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 leading-tight">
                            {slide.title}
                            <span className="block text-gray-400 text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2">
                                Chất lượng cao
                            </span>
                        </h1>

                        <p className="text-base md:text-lg lg:text-xl text-white/80 mb-2">
                            {slide.subtitle}
                        </p>
                        <p className="text-sm md:text-base text-white/60 mb-6 md:mb-8 max-w-lg">
                            {slide.description}
                        </p>

                        <div className="flex flex-wrap gap-3 md:gap-4">
                            <Link
                                to={slide.path || "/products"}
                                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
                            >
                                {slide.cta || "Xem thêm"}
                                <FontAwesomeIcon icon={faCartPlus} />
                            </Link>
                            <Link
                                to="/products"
                                className="px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors duration-200 border border-white/30"
                            >
                                Xem thêm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={prev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-[opacity,transform] duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 will-change-transform"
                aria-label="Previous slide"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
                type="button"
                onClick={next}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-[opacity,transform] duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 will-change-transform"
                aria-label="Next slide"
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>

            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => goTo(index)}
                        className={`rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? "w-6 md:w-8 h-2 bg-amber-500"
                                : "w-2 h-2 bg-white/30 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                <div
                    className="h-full bg-amber-500 transition-transform duration-300 will-change-transform origin-left"
                    style={{
                        transform: `scaleX(${(currentSlide + 1) / slides.length})`
                    }}
                />
            </div>
        </div>
    );
}
