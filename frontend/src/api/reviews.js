import { API } from "./client";

export const reviewAPI = {
    getAll: (params) => API.get("/review", { params }),
    create: (data) => API.post("/review", data),
    update: (id, data) => API.put(`/review/${id}`, data),
    delete: (id) => API.delete(`/review/${id}`),
};
