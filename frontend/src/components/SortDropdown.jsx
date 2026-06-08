import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function SortDropdown({ value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selected = options.find((o) => o.value === value);

    return (
        <div className="relative flex-1 sm:flex-none" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 pr-8 sm:pr-10 border border-gray-200 rounded-xl text-sm bg-white cursor-pointer text-gray-700 hover:border-amber-400 transition"
            >
                <span className="truncate">{selected?.label}</span>
                <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full text-left px-3 sm:px-4 py-2.5 text-sm transition ${
                                value === opt.value
                                    ? "bg-amber-50 text-amber-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
