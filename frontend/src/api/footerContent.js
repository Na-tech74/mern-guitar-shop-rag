import { API } from "./client";

export const footerContentAPI = {
    get: () => API.get("/footer-content"),
    update: (data) => API.put("/footer-content", data),
};
