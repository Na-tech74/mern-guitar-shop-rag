import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function useOrderSuccessPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const queryOrderId = searchParams.get("orderId");

    const orderId = state?.orderId || queryOrderId;
    const total = state?.total || 0;
    const paymentMethod = state?.paymentMethod || "momo";

    useEffect(() => {
        if (!orderId) {
            navigate("/", { replace: true });
        }
    }, [orderId, navigate]);

    return { state: { orderId, total, paymentMethod } };
}
