import { API } from "../../../api/axiosClient.js";

export const productAPI = {
    getAll: (params) => API.get("/products", { params }),
    getById: (id) => API.get(`/products/${id}`),
    getTop: (params) => API.get("/products/top", { params }),
};
