import { API } from "./client";

export const couponAPI = {
    getAll: (params) => API.get("/coupons", { params }),
    getById: (id) => API.get(`/coupons/${id}`),
    create: (data) => API.post("/coupons/create", data),
    update: (id, data) => API.put(`/coupons/${id}`, data),
    delete: (id) => API.delete(`/coupons/${id}`),
    apply: (data) => API.post("/coupons/apply", data),
    getActive: () => API.get("/coupons/active"),
};
