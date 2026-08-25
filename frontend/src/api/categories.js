import { API } from "./client";

export const categoryAPI = {
    getAll: (params) => API.get("/categories", { params }),
    getById: (id) => API.get(`/categories/${id}`),
    getTopSelling: (limit = 5) => API.get("/categories/top-selling", { params: { limit } }),
    create: (data) => API.post("/categories/create", data),
    update: (id, data) => API.put(`/categories/${id}`, data),
    delete: (id) => API.delete(`/categories/${id}`),
};
