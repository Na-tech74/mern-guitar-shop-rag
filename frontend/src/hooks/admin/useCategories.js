import { useState, useCallback, useEffect } from "react";
import { categoryAPI } from "../../api/adminAPI";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await categoryAPI.getAll();
            setCategories(res.data?.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const createCategory = useCallback(async (data) => {
        const res = await categoryAPI.create(data);
        refetch();
        return res;
    }, [refetch]);

    const updateCategory = useCallback(async (id, data) => {
        const res = await categoryAPI.update(id, data);
        refetch();
        return res;
    }, [refetch]);

    const deleteCategory = useCallback(async (id) => {
        const res = await categoryAPI.delete(id);
        refetch();
        return res;
    }, [refetch]);

    return {
        categories,
        loading,
        error,
        refetch,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};