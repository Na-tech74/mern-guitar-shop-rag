import { API } from "./client";

export const userAPI = {
    getAll: () => API.get("/users"),
    getById: (id) => API.get(`/users/${id}`),
    update: (id, data) => API.put(`/users/${id}`, data),
    delete: (id) => API.delete(`/users/${id}`),
    getProfile: () => API.get("/users/me"),
    updateMyProfile: (data) => API.put("/users/me", data),
    changePassword: (data) => API.put("/users/password", data),
};
