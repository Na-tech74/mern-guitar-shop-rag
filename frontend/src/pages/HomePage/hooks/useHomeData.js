import { useState, useEffect } from "react";
import { API } from "../../../api/axiosClient.js";
import { productAPI } from "../../ProductsPage/api/productAPI.js";

export default function useHomeData() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productAPI.getTop({ limit: 12 }),
                    API.get("/categories", { signal: abortController.signal })
                ]);
                if (!abortController.signal.aborted) {
                    setProducts(productsRes.data?.data?.products || []);
                    setCategories(categoriesRes.data?.data?.categories || []);
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

    return { products, categories, loading };
}
