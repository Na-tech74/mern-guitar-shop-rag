import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCheck, faShoppingCart, faUserPlus,
    faCheckDouble, faArrowRight, faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { notificationAPI } from "../api";
import { formatDateTime } from "../helpers/formatters";

const typeConfig = {
    new_order: { icon: faShoppingCart, bg: "bg-blue-100", text: "text-blue-600" },
    new_user: { icon: faUserPlus, bg: "bg-violet-100", text: "text-violet-600" },
    order_status: { icon: faShoppingCart, bg: "bg-cyan-100", text: "text-cyan-600" },
};

export default function AdminNotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await notificationAPI.getAll({ limit: 10 });
            setNotifications(res.data?.data?.notifications || []);
            setUnreadCount(res.data?.data?.unreadCount || 0);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {}
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {}
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => { setOpen((v) => !v); if (!open) fetchNotifications(); }}
                className={`relative p-2 rounded-lg transition-colors ${open ? "bg-gray-200" : "hover:bg-gray-100"}`}
                aria-label="Thông báo"
            >
                <FontAwesomeIcon icon={faBell} className={`text-lg transition-colors hover:text-amber-500 ${open ? "text-black" : "text-gray-600"}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[8px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBell} className="text-black text-xs" />
                            Thông báo
                        </h3>
                        {unreadCount > 0 && (
                            <button type="button" onClick={handleMarkAllRead} className="text-[11px] text-gray-700 hover:text-black font-medium flex items-center gap-1">
                                <FontAwesomeIcon icon={faCheckDouble} className="text-[10px]" />
                                Đọc tất cả
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="py-8 flex justify-center">
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-400 text-lg" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-400">
                                Chưa có thông báo nào
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const cfg = typeConfig[n.type] || { icon: faBell, bg: "bg-gray-100", text: "text-gray-600" };
                                return (
                                    <div
                                        key={n._id}
                                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-gray-100" : ""}`}
                                    >
                                        <div className={`size-8 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center shrink-0`}>
                                            <FontAwesomeIcon icon={cfg.icon} className="text-sm" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs ${!n.isRead ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {formatDateTime(n.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 shrink-0">
                                            {!n.isRead && (
                                                <button type="button" onClick={() => handleMarkRead(n._id)} className="size-6 rounded hover:bg-gray-200 text-gray-400 flex items-center justify-center" title="Đánh dấu đã đọc">
                                                    <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                                </button>
                                            )}
                                            {n.link && (
                                                <Link to={n.link} onClick={() => setOpen(false)} className="size-6 rounded hover:bg-gray-200 text-gray-500 flex items-center justify-center" title="Xem chi tiết">
                                                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center">
                        <Link to="/admin/orders" onClick={() => setOpen(false)} className="text-[11px] text-gray-700 hover:text-black font-medium">
                            Xem tất cả đơn hàng
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
