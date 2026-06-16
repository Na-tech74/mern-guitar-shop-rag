import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../components/MessageDialog";
import { orderAPI } from "../../../api";

const initialForm = {
    fullName: "",
    phone: "",
    address: "",
    city: "",
};

export default function useCheckoutPage() {
    const { alert } = useDialog();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login?redirect=/checkout", { replace: true });
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart.length === 0) {
            navigate("/cart", { replace: true });
            return;
        }
        setCartItems(cart);

        const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
        if (userInfo?.name) {
            setForm(prev => ({ ...prev, fullName: userInfo.name }));
        }
    }, [navigate]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const total = subtotal;

    function getPaymentBorderClass(method) {
        if (paymentMethod === method) {
            if (method === "cod") return "border-emerald-400 bg-emerald-50";
            if (method === "banking") return "border-blue-400 bg-blue-50";
            if (method === "momo") return "border-rose-400 bg-rose-50";
        }
        return "border-gray-200 hover:border-gray-300";
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
        if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        else if (!/^(0|\+84)[3-9][0-9]{8}$/.test(form.phone.trim())) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }
        if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
        if (!form.city.trim()) newErrors.city = "Vui lòng nhập thành phố";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const items = cartItems.map(item => ({
                product: item.name,
                productId: item._id,
                quantity: item.quantity,
            }));

            const res = await orderAPI.create({
                items,
                shippingAddress: {
                    fullName: form.fullName.trim(),
                    phone: form.phone.trim(),
                    address: form.address.trim(),
                    city: form.city.trim(),
                },
                paymentMethod,
                note: note.trim(),
            });

            const orderData = res.data?.data?.order || {};

            if (paymentMethod === "momo") {
                const payRes = await orderAPI.momoPayment(orderData._id);
                const { payUrl } = payRes.data?.data || {};
                if (payUrl) {
                    localStorage.setItem("cart", "[]");
                    window.dispatchEvent(new Event("cart-updated"));
                    window.location.href = payUrl;
                    return;
                }
                throw new Error("Không thể tạo link thanh toán MoMo!");
            }

            localStorage.setItem("cart", "[]");
            window.dispatchEvent(new Event("cart-updated"));

            navigate("/order-success", {
                state: {
                    orderId: orderData._id,
                    total: orderData.total || total,
                    paymentMethod: orderData.paymentMethod || paymentMethod,
                }
            });
        } catch (err) {
            const msg = err.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại!";
            await alert({ title: "Lỗi", message: msg, variant: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return {
        cartItems,
        form, errors, handleChange,
        paymentMethod, setPaymentMethod, getPaymentBorderClass,
        note, setNote,
        submitting,
        subtotal, itemCount, total,
        handleSubmit,
    };
}
