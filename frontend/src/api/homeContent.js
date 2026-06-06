import { API } from "./client";

export const homeContentAPI = {
    get: () => API.get("/home-content"),
    update: (data) => API.put("/home-content", data),
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return API.post("/home-content/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
    uploadVideo: (file) => {
        const formData = new FormData();
        formData.append("video", file);
        return API.post("/home-content/upload-video", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
};
