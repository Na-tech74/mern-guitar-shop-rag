import { API } from "./client";

export const chatbotAPI = {
    send: (message) => API.post("/chatbot/chat", { message }),
    reindex: () => API.post("/chatbot/reindex"),
    getStats: () => API.get("/chatbot/stats"),
    getRecent: (limit = 10) => API.get(`/chatbot/recent?limit=${limit}`),
    getPolicyFiles: () => API.get("/chatbot/policy-files"),
    getPolicyFile: (filename) => API.get(`/chatbot/policy-files/${filename}`),
};
