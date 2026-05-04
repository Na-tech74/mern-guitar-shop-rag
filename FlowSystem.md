User (React UI)
        │
        ▼
Frontend (React)
        │
        ├── API thường (axios)
        │        │
        │        ▼
        │   Backend (Express)
        │        │
        │        ├── Auth (JWT)
        │        ├── Product
        │        ├── Order
        │        ▼
        │     MongoDB
        │
        └── Chat API
                 │
                 ▼
           Chat Service (FastAPI / Node)
                 │
        ┌────────┴────────┐
        ▼                 ▼
  Vector DB          LLM Model
 (FAISS/Chroma)    (Mistral/OpenAI)
        │                 │
        └──────► RAG ◄────┘
                 │
                 ▼
             Response