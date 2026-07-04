import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { orderAPI } from "../../../api";

export default function useOrderSuccessPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const queryOrderId = searchParams.get("orderId");

    const orderId = state?.orderId || queryOrderId;

    useEffect(() => {
        if (!orderId) {
            navigate("/", { replace: true });
            return;
        }

        if (state?.orderId && state?.total) {
            setOrder({ total: state.total, paymentMethod: state.paymentMethod || "cod" });
            setLoading(false);
            return;
        }

        orderAPI.getById(orderId)
            .then((res) => {
                const o = res.data?.data?.order || res.data?.data;
                setOrder({ total: o?.total || 0, paymentMethod: o?.paymentMethod || "cod" });
            })
            .catch(() => navigate("/", { replace: true }))
            .finally(() => setLoading(false));
    }, [orderId, navigate, state]);

    return { state: order ? { orderId, total: order.total, paymentMethod: order.paymentMethod } : null, loading };
}
