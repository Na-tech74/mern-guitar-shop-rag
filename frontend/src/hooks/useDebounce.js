import { useEffect, useState } from "react";

/**
 * useDebounce
 * Trả về `value` sau khi đã chờ đủ `delay` ms không thay đổi.
 * Hữu ích cho search input để tránh filter / gọi API liên tục mỗi keystroke.
 *
 * @param {*} value - Giá trị cần debounce (thường là searchTerm)
 * @param {number} delay - Thời gian chờ tính bằng ms (mặc định 300)
 * @returns {*} value sau khi đã debounce
 *
 * @example
 *   const [search, setSearch] = useState("");
 *   const debouncedSearch = useDebounce(search, 300);
 *   useEffect(() => { fetch(...) }, [debouncedSearch]);
 */
export default function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}
