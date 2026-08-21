import { useState, useCallback, useEffect, useRef } from "react";
import { compressImage } from "../../../helpers/imageCompression";
import { brandAPI } from "../../../api";
import { useDialog } from "../../../components/MessageDialog";

export const useBrands = () => {
    const { confirm, alert } = useDialog();

    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({
        name: "", description: "", country: "", website: "", isActive: true,
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");
    const logoBlobRef = useRef(null);

    const fetchBrands = useCallback(async () => {
        setLoading(true);
        try {
            const res = await brandAPI.getAll();
            setBrands(res.data?.data?.brands || []);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    useEffect(() => {
        return () => {
            if (logoBlobRef.current) {
                URL.revokeObjectURL(logoBlobRef.current);
            }
        };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (logoBlobRef.current) {
            URL.revokeObjectURL(logoBlobRef.current);
        }
        const url = URL.createObjectURL(file);
        logoBlobRef.current = url;
        setLogoFile(file);
        setLogoPreview(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("description", formData.description);
            fd.append("country", formData.country);
            fd.append("website", formData.website);
            fd.append("isActive", formData.isActive);
            if (logoFile) {
                const compressed = await compressImage(logoFile);
                fd.append("logo", compressed);
            }

            if (editingBrand) {
                await brandAPI.update(editingBrand._id, fd);
            } else {
                await brandAPI.create(fd);
            }
            await fetchBrands();
            resetForm();
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Có lỗi xảy ra!",
                variant: "error",
            });
        }
    };

    const handleEdit = (brand) => {
        if (logoBlobRef.current) {
            URL.revokeObjectURL(logoBlobRef.current);
            logoBlobRef.current = null;
        }
        setEditingBrand(brand);
        setFormData({
            name: brand.name,
            description: brand.description || "",
            country: brand.country || "",
            website: brand.website || "",
            isActive: brand.isActive,
        });
        setLogoPreview(brand.logo || "");
        setLogoFile(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa thương hiệu",
            message: "Bạn có chắc muốn xóa thương hiệu này?",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (!ok) return;
        try {
            await brandAPI.delete(id);
            await fetchBrands();
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Xóa thất bại!",
                variant: "error",
            });
        }
    };

    const resetForm = () => {
        if (logoBlobRef.current) {
            URL.revokeObjectURL(logoBlobRef.current);
            logoBlobRef.current = null;
        }
        setShowModal(false);
        setEditingBrand(null);
        setFormData({ name: "", description: "", country: "", website: "", isActive: true });
        setLogoFile(null);
        setLogoPreview("");
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    return {
        brands, loading, showModal, setShowModal,
        editingBrand, formData, setFormData,
        logoPreview, handleImageChange,
        handleSubmit, handleEdit, handleDelete,
        resetForm, openModal, fetchBrands,
    };
};
