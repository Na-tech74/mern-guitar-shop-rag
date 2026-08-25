import { API } from "./client";

export const knowledgeChunkAPI = {
    getAll: (params) => API.get("/knowledge-chunks", { params }),
    getById: (id) => API.get(`/knowledge-chunks/${id}`),
    getByDocument: (documentId) => API.get(`/knowledge-chunks/document/${documentId}`),
    create: (data) => API.post("/knowledge-chunks", data),
    update: (id, data) => API.put(`/knowledge-chunks/${id}`, data),
    delete: (id) => API.delete(`/knowledge-chunks/${id}`),
    deleteByDocument: (documentId) => API.delete(`/knowledge-chunks/document/${documentId}`),
};
