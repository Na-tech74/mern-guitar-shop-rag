import axios from "axios";
export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
    let token = null;
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
        token = JSON.parse(userInfo).accessToken;
    }
    if (!token) {
        token = localStorage.getItem("token");
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});