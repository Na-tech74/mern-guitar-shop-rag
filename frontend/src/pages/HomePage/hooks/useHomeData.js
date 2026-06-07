import { useState, useEffect } from "react";
import { API, productAPI, homeContentAPI } from "../../../api";

export default function useHomeData() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [homeContent, setHomeContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes, homeRes] = await Promise.all([
                    // phân trang sản phẩm trang home
                    productAPI.getAll({ limit: 500 }),
                    API.get("/categories", { signal: abortController.signal }),
                    homeContentAPI.get(),
                ]);
                if (!abortController.signal.aborted) {
                    setProducts(productsRes.data?.data?.products || []);
                    setCategories(categoriesRes.data?.data?.categories || []);
                    setHomeContent(homeRes.data?.data?.content || null);
                }
            } catch (error) {
                if (error.name !== 'CanceledError' && !abortController.signal.aborted) {
                    // Handle error
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => abortController.abort();
    }, []);

    return { products, categories, homeContent, loading };
}
