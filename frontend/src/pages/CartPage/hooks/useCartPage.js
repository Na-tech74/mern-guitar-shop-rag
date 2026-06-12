import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../components/MessageDialog";

export default function useCartPage() {
    const { alert } = useDialog();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);

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
        dispatchCartUpdate();
    }, [dispatchCartUpdate]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const shipping = 0;
    const discount = couponApplied ? subtotal * 0.05 : 0;
    const total = subtotal + shipping - discount;
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const handleApplyCoupon = async () => {
        if (coupon.trim().toUpperCase() === "GUITAR10") {
            setCouponApplied(true);
        } else {
            setCouponApplied(false);
            await alert({ title: "Lỗi", message: "Mã giảm giá không hợp lệ!", variant: "warning" });
        }
    };

    return {
        cartItems, coupon, setCoupon, couponApplied,
        updateQuantity, removeItem, clearCart,
        subtotal, shipping, discount, total, itemCount,
        handleApplyCoupon, navigate,
    };
}
