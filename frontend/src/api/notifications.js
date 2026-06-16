import { API } from "./client";

export const notificationAPI = {
    getAll: (params) => API.get("/notifications", { params }),
    markAsRead: (id) => API.put(`/notifications/${id}/read`),
    markAllAsRead: () => API.put("/notifications/read-all"),
};
