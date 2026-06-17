# Bot - RAG Chatbot Microservice

Python microservice cung cấp API chatbot AI tư vấn sản phẩm cho Nam Acoustic Guitar Shop, sử dụng RAG (Retrieval-Augmented Generation) với dữ liệu từ MongoDB.

## Kiến trúc

```
User → FastAPI → Embed câu hỏi → Search FAISS top-k → Ghép context + LLM → Response
```

## Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Framework | FastAPI + Uvicorn |
| Embedding | sentence-transformers |
| Vector DB | FAISS (IndexFlatL2) |
| LLM | OpenAI GPT-4o-mini |
| Data source | MongoDB (qua pymongo) |

## Cấu trúc file

```
bot/
├── .venv/              # Virtual environment
├── .env                # Biến môi trường
├── requirements.txt    # Python dependencies
├── readme.md           # File này
├── main.py             # FastAPI app + endpoint /api/chat
├── config.py           # Đọc .env
├── embedder.py         # Embedding model
├── vector_store.py     # FAISS vector database
├── chunker.py          # Chunk văn bản
├── llm.py              # Gọi LLM
└── indexer.py          # Index dữ liệu từ MongoDB
```

## Cài đặt & Chạy

```powershell
cd D:\mern-guitar-shop-rag
python -m venv bot\.venv
bot\.venv\Scripts\Activate
pip install -r bot\requirements.txt
uvicorn main:app --reload --port 8000
```

API tại `http://localhost:8000`. Docs tại `http://localhost:8000/docs`.

## API

### `POST /api/chat`

```json
{ "message": "cây đàn nào dưới 10 triệu?" }
```

### `GET /health`

Kiểm tra trạng thái service.

## Biến môi trường (.env)

```env
MONGO_URI=mongodb://localhost:27017/ten_db
OPENAI_API_KEY=sk-...
EMBEDDING_MODEL=intfloat/multilingual-e5-small
```
