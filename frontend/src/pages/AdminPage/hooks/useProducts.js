import { useState, useCallback, useEffect, useRef } from "react";
import { productAPI, categoryAPI } from "../../../api";
import useDebounce from "../../../hooks/useDebounce";
import { useDialog } from "../../../components/MessageDialog";

/**
 * useProducts
 * Quản lý state + thao tác CRUD sản phẩm cho trang Admin.
 *
 * Cải tiến chính:
 *  - Pagination + search SERVER-SIDE (không còn `limit: 9999`).
 *  - Debounce searchTerm 300ms để tránh gọi API mỗi keystroke.
 *  - Memory leak fix: theo dõi & revoke `URL.createObjectURL` khi xóa ảnh,
 *    reset form, hoặc unmount.
 *  - `loading` chỉ true lần đầu; refetch sau đó (đổi trang, đổi search,
 *    visibilitychange) dùng cờ `refetching` để KHÔNG flash trắng bảng.
 *  - Mọi window.alert / window.confirm thay bằng useDialog().
 */
export const useProducts = () => {
    const { confirm, alert } = useDialog();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });

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

    // Theo dõi các blob URL đã tạo để revoke đúng lúc, tránh rò bộ nhớ.
    const blobUrlsRef = useRef(new Set());
    const hasLoadedRef = useRef(false);

    /**
     * Fetch danh sách sản phẩm theo trang + search hiện tại.
     * @param {object} opts
     * @param {number} opts.page
     * @param {string} opts.search
     * @param {boolean} opts.silent - true: dùng `refetching` thay vì `loading`
     */
    const fetchProducts = useCallback(async ({ page, search, silent = false } = {}) => {
        try {
            if (silent && hasLoadedRef.current) {
                setRefetching(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const params = {
                page: page ?? pagination.page,
                limit: pagination.limit,
            };
            if (search?.trim()) params.search = search.trim();

            const res = await productAPI.getAll(params);
            const data = res.data?.data;
            setProducts(data?.products || []);
            setPagination((prev) => ({
                ...prev,
                page: data?.pagination?.page || 1,
                totalPages: data?.pagination?.totalPages || 1,
                total: data?.pagination?.total || 0,
            }));
            hasLoadedRef.current = true;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, [pagination.page, pagination.limit]);

    // Tách fetch categories (chỉ gọi 1 lần khi mount).
    const fetchCategories = useCallback(async () => {
        try {
            const res = await categoryAPI.getAll();
            setCategories(res.data?.data?.categories || []);
        } catch {
            setCategories([]);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Refetch khi đổi trang hoặc search (debounced). Reset về trang 1 khi search đổi
    // bằng cách setState page=1 rồi return — effect chạy lại với page mới sẽ fetch,
    // tránh double-fetch.
    const searchVersionRef = useRef(debouncedSearch);
    useEffect(() => {
        const isNewSearch = searchVersionRef.current !== debouncedSearch;
        searchVersionRef.current = debouncedSearch;
        if (isNewSearch && pagination.page !== 1) {
            setPagination((prev) => ({ ...prev, page: 1 }));
            return;
        }
        fetchProducts({ page: pagination.page, search: debouncedSearch, silent: hasLoadedRef.current });
    }, [debouncedSearch, pagination.page]);

    // Refetch khi tab trình duyệt được focus lại — silent để tránh flash bảng.
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchProducts({ page: pagination.page, search: debouncedSearch, silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchProducts, pagination.page, debouncedSearch]);

    // Cleanup mọi blob URL còn sót khi unmount.
    useEffect(() => {
        const urls = blobUrlsRef.current;
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
            urls.clear();
        };
    }, []);

    const revokeBlob = (url) => {
        if (url && blobUrlsRef.current.has(url)) {
            URL.revokeObjectURL(url);
            blobUrlsRef.current.delete(url);
        }
    };

    const handlePageChange = useCallback((page) => {
        setPagination((prev) => ({ ...prev, page }));
    }, []);

    const createProduct = useCallback(async (data) => {
        await productAPI.create(data);
        await fetchProducts({ page: 1, search: debouncedSearch, silent: true });
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [fetchProducts, debouncedSearch]);

    const updateProduct = useCallback(async (id, data) => {
        await productAPI.update(id, data);
        await fetchProducts({ page: pagination.page, search: debouncedSearch, silent: true });
    }, [fetchProducts, pagination.page, debouncedSearch]);

    const deleteProduct = useCallback(async (id) => {
        await productAPI.delete(id);
        await fetchProducts({ page: pagination.page, search: debouncedSearch, silent: true });
    }, [fetchProducts, pagination.page, debouncedSearch]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const newFileList = [...(formData.fileList || []), ...files];
        const previews = files.map((f) => {
            const url = URL.createObjectURL(f);
            blobUrlsRef.current.add(url);
            return url;
        });
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
            revokeBlob(removedUrl);
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
            alert({
                title: "Lỗi",
                message: error.response?.data?.message || "Có lỗi xảy ra!",
                variant: "error",
            });
        }
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa sản phẩm",
            message: "Bạn có chắc muốn xóa sản phẩm này? Hành động không thể hoàn tác.",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (!ok) return;
        try {
            await deleteProduct(id);
        } catch (error) {
            alert({
                title: "Lỗi",
                message: error.response?.data?.message || "Có lỗi xảy ra!",
                variant: "error",
            });
        }
    };

    const handleEdit = (product) => {
        // Revoke blob cũ trước khi mở form mới (nếu user đang sửa dở 1 sản phẩm khác).
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current.clear();

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
        // Revoke tất cả blob của form hiện tại.
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current.clear();

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
        // Backward-compat: trang Products.jsx vẫn xài `filteredProducts`,
        // nhưng giờ filter đã do server xử lý nên trả về luôn products.
        filteredProducts: products,
        categories,
        loading,
        refetching,
        error,
        pagination,
        handlePageChange,
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
