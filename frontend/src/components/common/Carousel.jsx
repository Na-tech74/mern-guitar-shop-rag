import { useState, useEffect } from "react";

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        { id: 1, title: "Guitar Acoustic cao cấp", image: "/banner1.jpg" },
        { id: 2, title: "Piano chính hãng", image: "/banner2.jpg" },
        { id: 3, title: "Khóa học nhạc cụ", image: "/banner3.jpg" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <h2 className="text-white text-3xl font-bold">{slide.title}</h2>
                    </div>
                </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${
                            index === currentSlide ? "bg-amber-600" : "bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}