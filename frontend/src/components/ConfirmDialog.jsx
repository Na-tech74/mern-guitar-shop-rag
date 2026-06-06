import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faCircleInfo, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

/**
 * DialogProvider + useDialog
 *
 * Cung cấp 2 hàm thay thế `window.confirm` và `window.alert` bằng modal đẹp hơn,
 * không block UI và có thể await trong async function.
 *
 *   const { confirm, alert } = useDialog();
 *   const ok = await confirm({ title, message, confirmText, variant: "danger" });
 *   await alert({ title, message, variant: "error" });
 *
 * Mount <DialogProvider> 1 lần ở cấp layout (vd AdminLayout) để mọi component con dùng được.
 */

const DialogContext = createContext(null);

const variantConfig = {
    danger:  { icon: faTriangleExclamation, color: "text-red-600",    btn: "danger"  },
    warning: { icon: faTriangleExclamation, color: "text-gray-700",  btn: "primary" },
    info:    { icon: faCircleInfo,          color: "text-blue-600",   btn: "primary" },
    success: { icon: faCircleCheck,         color: "text-green-600",  btn: "primary" },
    error:   { icon: faCircleXmark,         color: "text-red-600",    btn: "primary" },
};

export function DialogProvider({ children }) {
    const [state, setState] = useState(null);
    const resolverRef = useRef(null);

    const close = useCallback((result) => {
        if (resolverRef.current) {
            resolverRef.current(result);
            resolverRef.current = null;
        }
        setState(null);
    }, []);

    const confirm = useCallback((opts = {}) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;
            setState({
                mode: "confirm",
                title: opts.title ?? "Xác nhận",
                message: opts.message ?? "Bạn có chắc chắn?",
                confirmText: opts.confirmText ?? "Xác nhận",
                cancelText: opts.cancelText ?? "Hủy",
                variant: opts.variant ?? "warning",
            });
        });
    }, []);

    const alert = useCallback((opts = {}) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;
            setState({
                mode: "alert",
                title: opts.title ?? "Thông báo",
                message: opts.message ?? "",
                confirmText: opts.confirmText ?? "Đã hiểu",
                variant: opts.variant ?? "info",
            });
        });
    }, []);

    useEffect(() => {
        if (!state) return;
        const onKey = (e) => {
            if (e.key === "Escape") close(false);
            if (e.key === "Enter") close(true);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [state, close]);

    const value = useMemo(() => ({ confirm, alert }), [confirm, alert]);

    return (
        <DialogContext.Provider value={value}>
            {children}
            {state && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                    onClick={() => close(false)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); close(false); } }}
                    role="button"
                    tabIndex={-1}
                    aria-label="Đóng hộp thoại"
                >
                    <div
                        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-pop"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <div className={`shrink-0 ${variantConfig[state.variant]?.color || ""}`}>
                                <FontAwesomeIcon icon={variantConfig[state.variant]?.icon || faCircleInfo} className="text-2xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-800">{state.title}</h3>
                                {state.message && (
                                    <p className="mt-1 text-sm text-gray-500 whitespace-pre-wrap break-words">{state.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            {state.mode === "confirm" && (
                                <Button variant="secondary" onClick={() => close(false)}>{state.cancelText}</Button>
                            )}
                            <Button
                                variant={variantConfig[state.variant]?.btn || "primary"}
                                onClick={() => close(true)}
                                autoFocus
                            >
                                {state.confirmText}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    );
}

/**
 * Hook lấy 2 hàm `confirm` và `alert` từ context.
 * Nếu chưa có Provider sẽ fallback về `window.confirm` / `window.alert`
 * để không crash các trang chưa wrap provider.
 */
export function useDialog() {
    const ctx = useContext(DialogContext);
    if (ctx) return ctx;
    return {
        confirm: ({ message } = {}) => Promise.resolve(window.confirm(message || "")),
        alert: ({ message } = {}) => { window.alert(message || ""); return Promise.resolve(); },
    };
}
