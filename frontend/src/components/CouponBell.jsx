import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faPercent, faMoneyBillWave, faTruck,
    faTag, faCopy, faCheck
} from "@fortawesome/free-solid-svg-icons";
import { couponAPI } from "../api";

const typeConfig = {
    percentage: { label: "Giảm %", color: "text-rose-600 bg-rose-50 border-rose-200" },
    fixed: { label: "Giảm tiền", color: "text-blue-600 bg-blue-50 border-blue-200" },
    free_shipping: { label: "Free ship", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
};

export default function CouponBell() {
    const [open, setOpen] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [copied, setCopied] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        couponAPI.getActive()
            .then((res) => setCoupons(res.data?.data?.coupons || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleCopy = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(code);
            setTimeout(() => setCopied(null), 2000);
        } catch {}
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative"
                aria-label="Mã giảm giá"
            >
                <FontAwesomeIcon
                    icon={faBell}
                    className={`text-xl transition-colors ${open ? "text-amber-500" : "text-gray-600 hover:text-amber-500"}`}
                />
                {coupons.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold">
                        {coupons.length}
                    </span>
                )}
            </button>

            {open && (
                <div className="max-sm:fixed max-sm:top-16 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[calc(100vw-2rem)] max-sm:z-[100] sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faTag} className=" text-sm" />
                            <h3 className="font-semibold text-sm text-gray-800">Mã giảm giá</h3>
                        </div>
                        <span className="text-xs text-gray-400">{coupons.length} mã</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2 space-y-2">
                        {coupons.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-400">
                                Hiện chưa có mã giảm giá nào
                            </div>
                        ) : (
                            coupons.map((c) => {
                                const cfg = typeConfig[c.type] || typeConfig.percentage;
                                return (
                                    <div key={c._id} className={`rounded-lg border ${cfg.color} p-3`}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-sm text-gray-800">{c.code}</span>
                                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cfg.color}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {c.type === "percentage"
                                                        ? `Giảm ${c.value}%${c.maxDiscount > 0 ? ` (tối đa ${c.maxDiscount.toLocaleString()}đ)` : ""}`
                                                        : c.type === "fixed"
                                                        ? `Giảm ${c.value.toLocaleString()}đ`
                                                        : "Miễn phí vận chuyển"}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(c.code)}
                                                className={`shrink-0 size-8 rounded-lg flex items-center justify-center transition-colors ${
                                                    copied === c.code
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-600"
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={copied === c.code ? faCheck : faCopy} className="text-xs" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                                            {c.minOrderValue > 0 && <span>Đơn tối thiểu: {c.minOrderValue.toLocaleString()}đ</span>}
                                            <span>HSD: {new Date(c.endDate).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                        <p className="text-[10px] text-gray-400 text-center">Nhập mã tại giỏ hàng để nhận ưu đãi</p>
                    </div>
                </div>
            )}
        </div>
    );
}
