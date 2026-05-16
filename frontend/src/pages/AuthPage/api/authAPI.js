import { API } from "../../../api/axiosClient.js"

export const registerAPI = (data) => API.post("/auth/register", data);
export const loginAPI = (data) => API.post("/auth/login", data);
export const logoutAPI = () => API.post("/auth/logout");
export const forgotPasswordAPI = (data) => API.post("/auth/forgot-password", data);
export const resetPasswordAPI = (data) => API.post("/auth/reset-password", data);
