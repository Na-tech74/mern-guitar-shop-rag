import { useEffect, useRef, useState } from "react";

/**
 * useInView
 * Hook dùng IntersectionObserver để phát hiện element có trong viewport không.
 * Trả về [ref, inView] - gắn ref vào element để theo dõi, inView = true/false.
 *
 * @param {Object} options - tuỳ chọn truyền thẳng vào IntersectionObserver
 * @param {string} [options.rootMargin="0px"] - khoảng cách "ảo" mở rộng viewport
 *   (vd: "200px" = bắt đầu trigger khi element cách viewport 200px)
 * @param {number} [options.threshold=0.1] - tỉ lệ element hiện trong viewport để trigger
 *
 * Fallback: nếu trình duyệt không hỗ trợ IntersectionObserver → mặc định inView = true
 */
export function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.1, ...options }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, inView];
}
