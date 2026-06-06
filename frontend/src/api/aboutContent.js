import { API } from "./client";

export const aboutContentAPI = {
    get: () => API.get("/about-content"),
    update: (data) => API.put("/about-content", data),
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return API.post("/about-content/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
};
