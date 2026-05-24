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
        fileList: [],
        existingImages: [],
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [productsRes, categoriesRes] = await Promise.all([
                productAPI.getAll(),
                categoryAPI.getAll().catch(() => ({ data: { data: { categories: [] } } }))
            ]);
            setProducts(productsRes.data?.data?.products || []);
            setCategories(categoriesRes.data?.data?.categories || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                fetchProducts();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const newFileList = [...(formData.fileList || []), ...files];
        const previews = files.map((f) => URL.createObjectURL(f));
        setFormData({
            ...formData,
            fileList: newFileList,
            images: [...(formData.images || []), ...previews],
        });
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        const newFileList = [...(formData.fileList || [])];
        const existingImages = [...(formData.existingImages || [])];
        const removedUrl = newImages[index];

        const inFileList = formData.fileList?.length
            ? index >= (formData.images.length - formData.fileList.length)
            : false;

        if (inFileList) {
            const fileIdx = index - (formData.images.length - formData.fileList.length);
            newFileList.splice(fileIdx, 1);
        } else {
            const existingIdx = existingImages.indexOf(removedUrl);
            if (existingIdx !== -1) existingImages.splice(existingIdx, 1);
        }

        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages, fileList: newFileList, existingImages: existingImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("description", formData.description);
            fd.append("price", String(formData.price).replace(/\./g, ""));
            fd.append("category", formData.category);
            fd.append("stock", String(formData.stock).replace(/\./g, ""));

            const fileList = formData.fileList || [];
            for (const file of fileList) {
                fd.append("images", file);
            }

            if (editingProduct) {
                await updateProduct(editingProduct._id, fd);
            } else {
                await createProduct(fd);
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
            fileList: [],
            existingImages: product.images || [],
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
            fileList: [],
            existingImages: [],
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
        handleFileChange,
        removeImage,
    };
};