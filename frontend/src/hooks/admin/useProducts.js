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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, formData);
            } else {
                await createProduct(formData);
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await deleteProduct(id);
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category?._id || product.category,
            stock: product.stock,
            images: product.images || [],
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            stock: "",
            images: [],
        });
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
        products,
        categories,
        loading,
        error,
        refetch,
        createProduct,
        updateProduct,
        deleteProduct,
        handleDelete,
        handleEdit,
        handleSubmit,
        resetForm,
        filteredProducts
    };
};