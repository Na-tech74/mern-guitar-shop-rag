User hỏi → "Tôi nên mua guitar nào cho người mới?"
        │
        ▼
Frontend gửi message → /api/chat
        │
        ▼
Backend Chat Service
        │
        ▼
1. Convert câu hỏi → embedding
        │
        ▼
2. Search Vector DB (FAISS)
        │
        ▼
3. Lấy top-k documents
        │
        ▼
4. Ghép context + question
        │
        ▼
5. Gửi vào LLM (Mistral)
        │
        ▼
6. Generate answer
        │
        ▼
7. Trả về frontend