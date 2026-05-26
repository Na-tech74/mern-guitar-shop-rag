import { API } from "../../../api/axiosClient";

export const cartAPI = {
    createOrder: (data) => API.post("/orders", data),
};
