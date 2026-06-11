import { API } from "./client";

export const contactContentAPI = {
    get: () => API.get("/contact-content"),
    update: (data) => API.put("/contact-content", data),
};
