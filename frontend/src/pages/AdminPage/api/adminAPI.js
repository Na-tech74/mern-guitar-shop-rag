import { API } from "../../../api/axiosClient.js";

export const productAPI = {
    getAll: (params) => API.get("/products", { params }),
    getById: (id) => API.get(`/products/${id}`),
    create: (formData) => API.post("/products", formData),
    update: (id, formData) => API.put(`/products/${id}`, formData),
    delete: (id) => API.delete(`/products/${id}`),
    uploadImages: (productId, formData) => API.post(`/products/${productId}/images`, formData),
};

export const categoryAPI = {
    getAll: () => API.get("/categories"),
    getById: (id) => API.get(`/categories/${id}`),
    create: (data) => API.post("/categories/create", data),
    update: (id, data) => API.put(`/categories/${id}`, data),
    delete: (id) => API.delete(`/categories/${id}`),
};

export const userAPI = {
    getAll: () => API.get("/users"),
    getById: (id) => API.get(`/users/${id}`),
    update: (id, data) => API.put(`/users/${id}`, data),
    delete: (id) => API.delete(`/users/${id}`),
    getProfile: () => API.get("/users/me"),
};

export const orderAPI = {
    create: (data) => API.post("/orders", data),
    getMyOrders: () => API.get("/orders/me"),
    getAll: (params) => API.get("/orders", { params }),
    getById: (id) => API.get(`/orders/${id}`),
    updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
    delete: (id) => API.delete(`/orders/${id}`),
    getStats: () => API.get("/orders/stats"),
};

export const courseAPI = {
    getAll: (params) => API.get("/courses", { params }),
    getPublished: (params) => API.get("/courses/published", { params }),
    getBySlug: (slug) => API.get(`/courses/slug/${slug}`),
    getById: (id) => API.get(`/courses/${id}`),
    create: (formData) => API.post("/courses", formData),
    update: (id, formData) => API.put(`/courses/${id}`, formData),
    delete: (id) => API.delete(`/courses/${id}`),
};

export const uploadAPI = {
    uploadImages: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        return API.post("/uploads", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
};

export const blogAPI = {
    getAll: (params) => API.get("/blogs", { params }),
    getById: (id) => API.get(`/blogs/${id}`),
    create: (data) => API.post("/blogs", data),
    update: (id, data) => API.put(`/blogs/${id}`, data),
    delete: (id) => API.delete(`/blogs/${id}`),
    uploadBanner: (blogId, formData) => API.post(`/blogs/${blogId}/banner`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
};
