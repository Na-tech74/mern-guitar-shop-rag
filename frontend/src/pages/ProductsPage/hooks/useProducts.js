import { useState } from "react";
import { productAPI } from "../api/productAPI";

export default function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    const fetchProducts = async (params = {}) => {
        try {
            setLoading(true);
            const res = await productAPI.getAll(params);
            const data = res.data?.data;
            setProducts(data?.products || []);
            setPagination(data?.pagination || { page: 1, totalPages: 1, total: 0 });
        } catch (err) {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return { products, loading, pagination, fetchProducts };
}
