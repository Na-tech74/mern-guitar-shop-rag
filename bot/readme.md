# Bot - RAG Chatbot 

Python  cung cấp API chatbot AI tư vấn sản phẩm cho **Nam Acoustic Guitar Shop**, sử dụng **RAG (Retrieval-Augmented Generation)** với dữ liệu sản phẩm từ MongoDB và tri thức từ các file chính sách.

## Kiến trúc RAG

```
User (Frontend)
    │
    ▼
POST /api/chat { message }
    │
    ▼
┌─────────────────────────────┐
│  1. Embed query             │  sentence-transformers (multilingual-e5-small)
│     Query → Vector (384d)   │  Hỗ trợ tiếng Việt tốt
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│  2. Search FAISS top-5      │  IndexFlatL2 - tìm 5 vectors gần nhất
│     Vector → Top-5 docs     │  cosine similarity (normalized)
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│  3. Build context           │  Ghép context docs + system prompt
│     Docs + Prompt           │  Giới hạn thông tin trả lời
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│  4. Gemini LLM             │  google-genai (gemini-3.6-flash)
│     Context + Query → Reply │  Trả lời bằng tiếng Việt
└─────────────────────────────┘
              │
              ▼
        Response to User
```

## Knowledge Base (Dữ liệu RAG)

Dữ liệu được index vào FAISS gồm **56 vectors**:

| Nguồn | Số lượng | Nội dung |
|--------|----------|----------|
| **MongoDB products** | 52 chunks | Tên, giá, mô tả, danh mục, thương hiệu, tồn kho |
| **FAQ** | 1 chunk | 10 câu hỏi thường gặp (giá, bảo hành, giao hàng...) |
| **Chính sách giao hàng** | 1 chunk | Miễn phí ship, phí, thời gian, đóng gói |
| **Chính sách bảo hành** | 1 chunk | 12 tháng, phạm vi, điều kiện, quy trình |
| **Chính sách đổi trả** | 1 chunk | 7 ngày, điều kiện, hoàn tiền, quy trình |

**Cách thêm dữ liệu mới:**
- **Sản phẩm**: Thêm vào MongoDB → chạy `python indexer.py`
- **Chính sách**: Thêm file `.txt` vào thư mục `data/` → chạy `python indexer.py`

## Công nghệ

| Thành phần | Công nghệ | Mô tả |
|------------|-----------|-------|
| Framework | FastAPI + Uvicorn | REST API server |
| Embedding | sentence-transformers | `intfloat/multilingual-e5-small` (384 dim) |
| Vector DB | FAISS | `IndexFlatL2` - lưu file `index.faiss` + `metadata.pkl` |
| LLM | Google Gemini | `gemini-3.6-flash` qua `google-genai` SDK |
| Data source | MongoDB | Sản phẩm từ collection `products` |
| Chính sách | File `.txt` | FAQ, bảo hành, giao hàng, đổi trả trong `data/` |

## Cấu trúc file

```
bot/
├── .env                # Biến môi trường (MONGO_URI, GEMINI_API_KEY, ...)
├── .env.example        # Template env
├── requirements.txt    # Python dependencies
├── readme.md           # File này
│
├── main.py             # FastAPI app + endpoint /api/chat
├── config.py           # Đọc .env (MONGO_URI, GEMINI_API_KEY, GEMINI_MODEL)
├── service.py          # RAG Pipeline: embed → search → build context → LLM
├── embedder.py         # SentenceTransformer embedding model
├── vector_store.py     # FAISS vector database + persistence
├── chunker.py          # Chunk dữ liệu products + policies
├── llm.py              # Gọi Gemini API với context RAG
├── indexer.py          # Index dữ liệu từ MongoDB + file .txt vào FAISS
│
├── data/               # Thư mục tri thức (chính sách cửa hàng)
│   ├── faq.txt         # Câu hỏi thường gặp
│   ├── shipping.txt    # Chính sách giao hàng
│   ├── warranty.txt    # Chính sách bảo hành
│   └── return.txt      # Chính sách đổi trả
│
├── index.faiss         # FAISS index file (tự tạo sau khi indexer)
├── metadata.pkl        # Metadata vectors (tự tạo sau khi indexer)
└── .venv/              # Virtual environment
```

## API Endpoints

### `POST /api/chat`

Gửi tin nhắn, nhận câu trả lời từ RAG chatbot.

**Request:**
```json
{
  "message": "guitar acoustic giá bao nhiêu?"
}
```

**Response:**
```json
{
  "reply": "Chào bạn! Tại Nam Acoustic Guitar Shop, guitar acoustic có giá từ 1.500.000đ đến 15.000.000đ..."
}
```

**Flow xử lý:**
1. Validate input (không rỗng)
2. Embed query → vector 384 chiều
3. Search FAISS top-5 documents gần nhất
4. Build context + system prompt
5. Gọi Gemini API → nhận response
6. Trả về `{ reply }`

### `GET /`

Kiểm tra trạng thái service.

```json
{
  "message": "RAG Bot is running!",
  "index_size": 56
}
```

### `GET /health`

Health check.

```json
{
  "status": "healthy",
  "index_vectors": 56
}
```

## Biến môi trường (.env)

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/Guitar_Shop

# Google Gemini
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-3.6-flash

# Embedding
EMBEDDING_MODEL=intfloat/multilingual-e5-small
```

| Biên | Mô tả | Mặc định |
|------|-------|----------|
| `MONGO_URI` | MongoDB connection string | - |
| `GEMINI_API_KEY` | API key Google AI Studio | - |
| `GEMINI_MODEL` | Model Gemini | `gemini-3.6-flash` |
| `EMBEDDING_MODEL` | SentenceTransformer model | `intfloat/multilingual-e5-small` |

## Cài đặt & Chạy

### 1. Cài đặt

```powershell
cd bot
python -m venv .venv
.venv\Scripts\Activate
pip install -r requirements.txt
```

### 2. Cấu hình .env

```powershell
copy .env.example .env
# Chỉnh sửa .env với MONGO_URI và GEMINI_API_KEY
```

### 3. Index dữ liệu

```powershell
python indexer.py
```

Output:
```
[1/4] Connecting to MongoDB...
[indexer] Found 52 products
[2/4] Chunking data...
[indexer] Product chunks: 52
[indexer] Policy chunks: 4
[3/4] Embedding texts...
[indexer] Embeddings shape: (56, 384)
[4/4] Building FAISS index...
[vector_store] Saved index: 56 vectors, dim=384
```

**Lưu ý:** Chạy lại `indexer.py` mỗi khi thêm/sửa sản phẩm trong MongoDB hoặc thêm file chính sách mới trong `data/`.

### 4. Chạy bot server

```powershell
python main.py
```

Hoặc dùng uvicorn:

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000
```

Bot chạy tại `http://localhost:8000`. Swagger docs tại `http://localhost:8000/docs`.

## Chi tiết các module

### `main.py` - FastAPI App

- Khởi tạo FastAPI với lifespan context manager
- Load FAISS index khi startup
- CORS middleware (cho phép tất cả origins trong dev)
- Endpoint `POST /api/chat` gọi `rag_chat()` từ `service.py`

### `service.py` - RAG Pipeline

```python
def rag_chat(message: str) -> str:
    # 1. Kiểm tra index đã load chưa
    # 2. Embed câu hỏi → query vector
    # 3. Search FAISS top-5
    # 4. Gọi Gemini với context
    # 5. Trả về câu trả lời
```

### `embedder.py` - Embedding Model

- Lazy load `SentenceTransformer` (chỉ load 1 lần)
- `embed_texts(list[str])` → `np.ndarray (n, 384)`
- `embed_query(str)` → `np.ndarray (1, 384)`
- Model: `intfloat/multilingual-e5-small` (hỗ trợ 100+ ngôn ngữ)

### `vector_store.py` - FAISS Database

- `build_index(embeddings, metadata)` → Build + lưu `index.faiss` + `metadata.pkl`
- `load_index()` → Load từ disk
- `search(query_embedding, top_k=5)` → Tìm top-k vectors gần nhất
- `get_index_size()` → Số vectors hiện có

### `chunker.py` - Data Chunking

- `chunk_product(product)` → 1 chunk text từ 1 MongoDB document
- `chunk_products(list)` → List chunks từ products
- `chunk_policy_file(text, name)` → 1 chunk từ file policy
- `chunk_policy_files(dict)` → List chunks từ dict files

### `llm.py` - Gemini Integration

- System prompt: Trợ lý ảo Nam Acoustic Guitar Shop
- `build_prompt(message, context_docs)` → Ghép context + câu hỏi
- `generate_reply(message, context_docs)` → Gọi Gemini API
- Trả lời ngắn gọn, thân thiện bằng tiếng Việt

### `indexer.py` - Data Indexer

- Kết nối MongoDB → lấy products
- Đọc file `.txt` trong `data/`
- Chunk → Embed → Build FAISS index
- Chạy 1 lần, reload khi có dữ liệu mới

## System Prompt

```
Bạn là trợ lý ảo của Nam Acoustic Guitar Shop - cửa hàng bán đàn guitar.

Nhiệm vụ của bạn là tư vấn và trả lời thân thiện, ngắn gọn bằng tiếng Việt về:
- Sản phẩm: Guitar Acoustic, Guitar Classic, Guitar Electric, Ukulele, Piano, phụ kiện.
- Giá cả, khuyến mãi, mã giảm giá.
- Chính sách: bảo hành 12 tháng, miễn phí giao hàng đơn trên 500k, đổi trả 7 ngày.
- Khóa học guitar, thanh toán, giao hàng, liên hệ cửa hàng.

Quy tắc trả lời:
- Chỉ trả lời dựa trên thông tin được cung cấp bên dưới.
- Nếu không có thông tin phù hợp, hãy lịch sự hướng dẫn người dùng liên hệ cửa hàng.
- Trả lời ngắn gọn, dễ hiểu, dùng tiếng Việt.
- Nếu hỏi về giá, hãy nêu rõ tên sản phẩm và giá cụ thể.
- Nếu hỏi so sánh, nêu ưu nhược điểm từng sản phẩm.
```

## Tích hợp Frontend

Frontend gọi bot qua Vite proxy:

```js
// vite.config.js
proxy: {
  "/bot": {
    target: "http://localhost:8000",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/bot/, "")
  }
}

// chatbot.js
const botClient = axios.create({
  baseURL: "/bot",
  timeout: 60000,
});
```

Frontend gọi: `POST /bot/api/chat` → Vite proxy → `http://localhost:8000/api/chat`

## Yêu cầu hệ thống

- **Python**: >= 3.10
- **MongoDB**: Chạy trên `localhost:27017`
- **Google Gemini API Key**: Đăng ký tại [Google AI Studio](https://aistudio.google.com/)
- **Cổng**: 8000 (bot server)

## Troubleshooting

| Lỗi | Nguyên nhân | Cách sửa |
|------|-------------|----------|
| `No index found` | Chưa chạy indexer | `python indexer.py` |
| `404 NOT_FOUND: model` | Model Gemini đã ngưng | Cập nhật `GEMINI_MODEL` trong `.env` |
| `Products in DB: 0` | Sai database name | Kiểm tra `MONGO_URI` trong `.env` |
| Frontend hiện mock reply | Bot server chưa chạy | Chạy `python main.py` trước |
| Timeout khi chat | Embedding model chưa load | Chờ vài giây, model load lần đầu |
