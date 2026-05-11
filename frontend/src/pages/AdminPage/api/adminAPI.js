import { API } from "../../../api/axiosClient.js";

export const productAPI = {
    getAll: (params) => API.get("/products/get-all-products", { params }),
    getById: (id) => API.get(`/products/${id}`),
    create: (data) => API.post("/products/create-products", data),
    update: (id, data) => API.put(`/products/update-products/${id}`, data),
    delete: (id) => API.delete(`/products/${id}`),
    uploadImages: (productId, formData) => API.post(`/products/${productId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
};

export const categoryAPI = {
    getAll: () => API.get("/categories/get-all-categories"),
    getById: (id) => API.get(`/categories/get-categories-only/${id}`),
    create: (data) => API.post("/categories/create-categories", data),
    update: (id, data) => API.put(`/categories/update-categories/${id}`, data),
    delete: (id) => API.delete(`/categories/delete-categories/${id}`),
};

export const userAPI = {
    getAll: () => API.get("/users"),
    getById: (id) => API.get(`/users/${id}`),
    update: (id, data) => API.put(`/users/${id}`, data),
    delete: (id) => API.delete(`/users/${id}`),
    getProfile: () => API.get("/users/me"),
};

export const orderAPI = {
    create: (data) => API.post("/orders/create-orders", data),
    getMyOrders: () => API.get("/orders/get-my-orders"),
    getAll: (params) => API.get("/orders/get-all-orders", { params }),
    getById: (id) => API.get(`/orders/${id}`),
    updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
    delete: (id) => API.delete(`/orders/${id}`),
};