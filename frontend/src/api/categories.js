import { API } from "./client";

export const categoryAPI = {
    getAll: () => API.get("/categories"),
    getById: (id) => API.get(`/categories/${id}`),
    create: (data) => API.post("/categories/create", data),
    update: (id, data) => API.put(`/categories/${id}`, data),
    delete: (id) => API.delete(`/categories/${id}`),
};
