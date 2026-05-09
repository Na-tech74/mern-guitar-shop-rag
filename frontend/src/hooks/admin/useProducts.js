import { useState, useCallback, useEffect } from "react";
import { productAPI, categoryAPI } from "../../api/adminAPI";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                productAPI.getAll({ limit: 100 }),
                categoryAPI.getAll()
            ]);
            setProducts(productsRes.data?.data || []);
            setCategories(categoriesRes.data?.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const createProduct = useCallback(async (data) => {
        const res = await productAPI.create(data);
        refetch();
        return res;
    }, [refetch]);

    const updateProduct = useCallback(async (id, data) => {
        const res = await productAPI.update(id, data);
        refetch();
        return res;
    }, [refetch]);

    const deleteProduct = useCallback(async (id) => {
        const res = await productAPI.delete(id);
        refetch();
        return res;
    }, [refetch]);

    return {
        products,
        categories,
        loading,
        error,
        refetch,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};