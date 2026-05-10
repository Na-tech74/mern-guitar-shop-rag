import axios from "axios";
export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true
});

// Thêm token vào request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !isRefreshing) {
            isRefreshing = true;
            try {
                const { data } = await API.post("/auth/refresh");
                localStorage.setItem("token", data.accessToken);
                error.config.headers.Authorization = `Bearer ${data.accessToken}`;
                return API.request(error.config);
            } catch {
                localStorage.removeItem("token");
                window.location.href = "/login";
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);