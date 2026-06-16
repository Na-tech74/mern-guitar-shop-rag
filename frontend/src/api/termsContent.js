import { API } from "./client";

export const termsContentAPI = {
    get: () => API.get("/terms-content"),
    update: (data) => API.put("/terms-content", data),
};
