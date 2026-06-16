import { API } from "./client";

export const orderAPI = {
    create: (data) => API.post("/orders", data),
    getMyOrders: () => API.get("/orders/me"),
    getAll: (params) => API.get("/orders", { params }),
    getById: (id) => API.get(`/orders/${id}`),
    updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
    delete: (id) => API.delete(`/orders/${id}`),
    getStats: () => API.get("/orders/stats"),
    momoPayment: (orderId) => API.post("/orders/momo-payment", { orderId }),
};
