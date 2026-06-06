import { API } from "./client";

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
