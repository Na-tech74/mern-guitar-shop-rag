import axios from "axios";

export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true
});

API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
        return config;
    }
    if (!config.headers["Content-Type"] && !config.headers.get("Content-Type")) {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});

let isRefreshing = false;
let refreshQueue = [];

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes('/auth/refresh')) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push((newToken) => {
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            originalRequest._retry = true;
                            resolve(API(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }

            isRefreshing = true;
            originalRequest._retry = true;

            try {
                const { data } = await API.post("/auth/refresh");
                const newToken = data.data?.accessToken;
                sessionStorage.setItem("token", newToken);
                refreshQueue.forEach(cb => cb(newToken));
                refreshQueue = [];
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return API(originalRequest);
            } catch {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("userInfo");
                refreshQueue.forEach(cb => cb(null));
                refreshQueue = [];
                if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

