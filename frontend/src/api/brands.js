import { API } from "./client";

export const brandAPI = {
    getAll: (params) => API.get("/brands", { params }),
    getById: (id) => API.get(`/brands/${id}`),
    create: (data) => API.post("/brands/create", data),
    update: (id, data) => API.put(`/brands/${id}`, data),
    delete: (id) => API.delete(`/brands/${id}`),
};
