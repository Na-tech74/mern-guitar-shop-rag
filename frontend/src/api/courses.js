import { API } from "./client";

export const courseAPI = {
    getAll: (params) => API.get("/courses", { params }),
    getPublished: (params) => API.get("/courses/published", { params }),
    getBySlug: (slug) => API.get(`/courses/slug/${slug}`),
    getById: (id) => API.get(`/courses/${id}`),
    create: (formData) => API.post("/courses", formData),
    update: (id, formData) => API.put(`/courses/${id}`, formData),
    delete: (id) => API.delete(`/courses/${id}`),
};
