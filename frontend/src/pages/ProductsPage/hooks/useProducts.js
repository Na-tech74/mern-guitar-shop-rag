import { useState } from "react";
import { productAPI } from "../../../api";

export default function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    const fetchProducts = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const res = await productAPI.getAll(params);
            const data = res.data?.data;
            setProducts(data?.products || []);
            setPagination(data?.pagination || { page: 1, totalPages: 1, total: 0 });
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Không thể tải sản phẩm, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return { products, loading, error, pagination, fetchProducts };
}
