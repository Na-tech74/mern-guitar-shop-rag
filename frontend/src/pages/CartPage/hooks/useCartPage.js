import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../components/MessageDialog";
import { couponAPI } from "../../../api";

const COUPON_STORAGE_KEY = "appliedCoupon";

function loadAppliedCoupon() {
    try {
        const raw = localStorage.getItem(COUPON_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveAppliedCoupon(data) {
    if (data) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(data));
    } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
    }
}

export default function useCartPage() {
    const { alert } = useDialog();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(loadAppliedCoupon);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);
    }, []);

    const dispatchCartUpdate = useCallback(() => {
        window.dispatchEvent(new Event("cart-updated"));
    }, []);

    const updateQuantity = useCallback((id, delta) => {
        setCartItems(prev => {
            const updated = prev.map(item =>
                item._id === id
                    ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
                    : item
            );
            localStorage.setItem("cart", JSON.stringify(updated));
            dispatchCartUpdate();
            return updated;
        });
    }, [dispatchCartUpdate]);

    const removeItem = useCallback((id) => {
        setCartItems(prev => {
            const updated = prev.filter(item => item._id !== id);
            localStorage.setItem("cart", JSON.stringify(updated));
            dispatchCartUpdate();
            return updated;
        });
    }, [dispatchCartUpdate]);

    const clearCart = useCallback(() => {
        localStorage.setItem("cart", "[]");
        setCartItems([]);
        saveAppliedCoupon(null);
        setAppliedCoupon(null);
        dispatchCartUpdate();
    }, [dispatchCartUpdate]);

    const subtotal = useMemo(() =>
        cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
        [cartItems]
    );

    const shipping = 0;

    const discount = useMemo(() => {
        if (!appliedCoupon) return 0;
        const { type, value, maxDiscount } = appliedCoupon;
        if (type === "free_shipping") return shipping;
        if (type === "percentage") {
            const d = (subtotal * value) / 100;
            return maxDiscount > 0 ? Math.min(d, maxDiscount) : d;
        }
        if (type === "fixed") return value;
        return 0;
    }, [appliedCoupon, subtotal, shipping]);

    const total = subtotal + shipping - discount;
    const itemCount = useMemo(() =>
        cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
        [cartItems]
    );

    const handleApplyCoupon = async () => {
        try {
            const res = await couponAPI.apply({ code: coupon, orderValue: subtotal });
            const data = res.data?.data?.coupon;
            setAppliedCoupon(data);
            saveAppliedCoupon(data);
        } catch (err) {
            setAppliedCoupon(null);
            saveAppliedCoupon(null);
            await alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Mã giảm giá không hợp lệ!",
                variant: "warning",
            });
        }
    };

    const handleRemoveCoupon = useCallback(() => {
        setCoupon("");
        setAppliedCoupon(null);
        saveAppliedCoupon(null);
    }, []);

    return {
        cartItems, coupon, setCoupon, appliedCoupon,
        updateQuantity, removeItem, clearCart,
        subtotal, shipping, discount, total, itemCount,
        handleApplyCoupon, handleRemoveCoupon, navigate,
    };
}
