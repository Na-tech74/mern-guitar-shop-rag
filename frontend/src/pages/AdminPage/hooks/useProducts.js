import { useState, useCallback, useEffect, useMemo } from "react";
import { productAPI, categoryAPI } from "../api/adminAPI";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        images: [],
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                productAPI.getAll(),
                categoryAPI.getAll()
            ]);
            setProducts(productsRes.data?.data || []);
            setCategories(categoriesRes.data?.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products || [];
        return (products || []).filter(p =>
            p.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const createProduct = useCallback(async (data) => {
        try {
            await productAPI.create(data);
            await fetchProducts();
        } catch (err) {
            throw err;
        }
    }, [fetchProducts]);

    const updateProduct = useCallback(async (id, data) => {
        try {
            await productAPI.update(id, data);
            await fetchProducts();
        } catch (err) {
            throw err;
        }
    }, [fetchProducts]);

    const deleteProduct = useCallback(async (id) => {
        try {
            await productAPI.delete(id);
            await fetchProducts();
        } catch (err) {
            throw err;
        }
    }, [fetchProducts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
            };
            if (editingProduct) {
                await updateProduct(editingProduct._id, productData);
            } else {
                await createProduct(productData);
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await deleteProduct(id);
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra!");
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

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    return {
        products,
        categories,
        loading,
        error,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        createProduct,
        updateProduct,
        deleteProduct,
        handleDelete,
        handleEdit,
        handleSubmit,
        resetForm,
        openModal,
        showModal,
        setShowModal,
        editingProduct,
        setEditingProduct,
        formData,
        setFormData,
        fetchProducts,
    };
};