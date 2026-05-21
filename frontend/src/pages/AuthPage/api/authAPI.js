import { API } from "../../../api/axiosClient.js"

export const registerAPI = (data) => API.post("/auth/register", data);
export const loginAPI = (data) => API.post("/auth/login", data);
export const logoutAPI = () => API.post("/auth/logout");
export const forgotPasswordAPI = (data) => API.post("/auth/password/forgot", data);
export const resetPasswordAPI = (data) => API.post("/auth/password/reset", data);
