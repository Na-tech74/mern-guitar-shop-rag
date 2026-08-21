import axios from "axios";

const botClient = axios.create({
    baseURL: import.meta.env.VITE_BOT_URL || "http://localhost:8000",
    timeout: 30000,
});

export const chatbotAPI = {
    send: (message) => botClient.post("/api/chat", { message }),
};
