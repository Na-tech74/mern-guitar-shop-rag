"""
main.py
FastAPI app - RAG Chatbot Service cho Nam Acoustic Guitar Shop.
Startup: load FAISS index từ disk hoặc MongoDB.
POST /api/chat: embed → search → Gemini → structured reply + sources.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import uvicorn

from vector_store import load_index, get_index_size, load_chunks_from_mongodb
from service import rag_chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: load FAISS index từ disk hoặc MongoDB."""
    print("[bot] Starting RAG Chatbot Service...")
    loaded = load_index()
    if loaded:
        print(f"[bot] FAISS index loaded: {get_index_size()} vectors")
    else:
        print("[bot] No FAISS index on disk, trying MongoDB...")
        meta, embeddings = load_chunks_from_mongodb()
        if embeddings is not None and len(meta) > 0:
            from vector_store import build_index
            import numpy as np
            build_index(embeddings, meta)
            print(f"[bot] Loaded from MongoDB: {get_index_size()} vectors")
        else:
            print("[bot] WARNING: No data found. Run 'python indexer.py' first!")
    yield
    print("[bot] Shutting down.")


app = FastAPI(title="RAG Chatbot Service", version="3.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def read_root():
    return {"message": "RAG Bot is running!", "index_size": get_index_size()}


@app.get("/health")
def health_check():
    return {"status": "healthy", "index_vectors": get_index_size()}


@app.post("/api/chat")
def chat(req: ChatRequest):
    if not req.message.strip():
        return {"reply": "Bạn chưa nhập nội dung, hãy gửi câu hỏi cho mình nhé!", "sources": None}

    try:
        result = rag_chat(req.message)
    except Exception as exc:
        import traceback
        print(f"[chat error] {exc}")
        traceback.print_exc()
        result = {"reply": f"Xin lỗi, lỗi: {type(exc).__name__}: {exc}", "sources": None}

    return result


@app.post("/api/reindex")
def reindex():
    """Endpoint để admin trigger reindex từ MongoDB."""
    try:
        from indexer import main as run_indexer
        run_indexer()
        return {"status": "ok", "message": "Reindex thành công!", "index_size": get_index_size()}
    except Exception as exc:
        print(f"[reindex error] {exc}")
        return {"status": "error", "message": str(exc)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
