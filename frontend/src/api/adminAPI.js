import { API } from "./axiosClient.js";

export const productAPI = {
    getAll: (params) => API.get("/products/get-all-product", { params }),
    getById: (id) => API.get(`/products/get-product-only/${id}`),
    create: (data) => API.post("/products/create-product", data),
    update: (id, data) => API.put(`/products/update-product/${id}`, data),
    delete: (id) => API.delete(`/products/delete-product/${id}`),
    uploadImages: (formData) => API.post("/products/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
};

export const categoryAPI = {
    getAll: () => API.get("/categorise/get-all-category"),
    getById: (id) => API.get(`/categorise/get-category-only/${id}`),
    create: (data) => API.post("/categorise/create-category", data),
    update: (id, data) => API.put(`/categorise/update-category/${id}`, data),
    delete: (id) => API.delete(`/categorise/delete-category/${id}`),
};

export const userAPI = {
    getAll: () => API.get("/users"),
    getById: (id) => API.get(`/users/${id}`),
    update: (id, data) => API.put(`/users/${id}`, data),
    delete: (id) => API.delete(`/users/${id}`),
    getProfile: () => API.get("/users/me"),
};

export const orderAPI = {
    getAll: () => API.get("/orders"),
    getById: (id) => API.get(`/orders/${id}`),
    updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
    delete: (id) => API.delete(`/orders/${id}`),
};