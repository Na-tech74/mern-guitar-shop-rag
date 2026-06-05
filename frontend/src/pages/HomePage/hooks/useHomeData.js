import { useState, useEffect } from "react";
import { API } from "../../../api/axiosClient.js";
import { productAPI } from "../../ProductsPage/api/productAPI.js";
import { homeContentAPI } from "../../AdminPage/api/adminAPI.js";

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
                    productAPI.getTop({ limit: 12 }),
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
