import axios from "axios";
export const API = axios.create({
    // baseURL: import.meta.env.VITE_SOCKET_URL, // Sử dụng biến môi trường cho URL API

    baseURL: import.meta.env.VITE_API_URL, // Sử dụng biến môi trường cho URL API
});