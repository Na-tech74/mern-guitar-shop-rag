import { useState, useCallback } from "react";

const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
};

export default function useCart() {
    const [addedMap, setAddedMap] = useState({});

    const addToCart = useCallback((product, quantity = 1, e) => {
        if (e) {
            e.stopPropagation?.();
            e.preventDefault?.();
        }
        const cart = getCart();
        const existing = cart.find(item => item._id === product._id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
                quantity,
            });
        }
        saveCart(cart);
        setAddedMap(prev => ({ ...prev, [product._id]: true }));
        setTimeout(() => setAddedMap(prev => ({ ...prev, [product._id]: false })), 1500);
    }, []);

    return { addToCart, addedMap };
}
