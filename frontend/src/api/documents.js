import { API } from "./client";

export const documentAPI = {
    getAll: (params) => API.get("/documents", { params }),
    getById: (id) => API.get(`/documents/${id}`),
    create: (data) => API.post("/documents", data),
    update: (id, data) => API.put(`/documents/${id}`, data),
    delete: (id) => API.delete(`/documents/${id}`),
};
