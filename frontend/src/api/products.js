import { API } from "./client";

export const productAPI = {
    getAll: (params) => API.get("/products", { params }),
    getTop: (params) => API.get("/products/top", { params }),
    getTopSelling: (limit = 5) => API.get("/products/top-selling", { params: { limit } }),
    getById: (id) => API.get(`/products/${id}`),
    create: (formData) => API.post("/products", formData),
    update: (id, formData) => API.put(`/products/${id}`, formData),
    delete: (id) => API.delete(`/products/${id}`),
    uploadImages: (productId, formData) => API.post(`/products/${productId}/images`, formData),
};
