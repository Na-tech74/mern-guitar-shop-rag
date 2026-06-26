Nếu bạn đang làm RAG cho guitar shop, tôi khuyên lấy 4 nhóm dữ liệu chính:

Nhóm 1 — Product catalog

Mỗi sản phẩm nên có:

tên
slug
loại đàn
hãng
giá
mô tả ngắn
mô tả dài
thông số
ảnh
tags
mục đích sử dụng: beginner / fingerstyle / biểu diễn / học tập
Nhóm 2 — FAQ + policy

Ví dụ:

ship bao lâu
có được kiểm tra hàng không
đổi trả mấy ngày
bảo hành bao lâu
có hỗ trợ trả góp không
Nhóm 3 — Knowledge articles

Ví dụ:

cách chọn guitar cho người mới
nên mua acoustic hay classic
cách chọn size đàn
guitar gỗ thịt và laminate khác gì
amp cho guitar điện là gì
Nhóm 4 — Product comparison / recommendation notes

Ví dụ:

Yamaha F310 phù hợp người mới
Rosen G11/G12 thiên về gì
guitar nào trong tầm 3 triệu, 5 triệu, 10 triệu

Cái này cực hợp để chatbot tư vấn kiểu:

“Em mới học nên mua cây nào dưới 4 triệu?”

3) Không nên lấy data gì

Tránh nhét vào RAG:
dữ liệu đơn hàng cá nhân của khách
chat log bừa bãi
data copy từ web không kiểm chứng
bài viết quá ngắn kiểu 1–2 dòng
dữ liệu trùng lặp 10 nguồn khác nhau
file scan ảnh mờ OCR lỗi

4) Cấu trúc data tôi khuyên bạn làm
Thư mục data:
data/
├─ products/
│  ├─ yamaha_f310.json
│  ├─ rosen_g12d_pro.json
│  └─ ...
├─ faqs/
│  └─ faq_shop.json
├─ policies/
│  ├─ shipping.txt
│  ├─ return.txt
│  └─ warranty.txt
├─ blogs/
│  ├─ chon-guitar-cho-nguoi-moi.md
│  └─ phan-biet-acoustic-classic.md
└─ reviews/
   └─ review_notes.json


   Kế hoạch chi tiết
Kiến trúc

Frontend (React) ──POST /api/chat──→ Express (proxy) ──→ FastAPI Bot (port 8000)
                                                              │
                                                    ┌─────────┴──────────┐
                                                    │  embedder.py       │
                                                    │  → vector_store.py │
                                                    │  → llm.py (Gemini) │
                                                    └────────────────────┘

🔧 Python Bot (7 files)
File	Status	Nội dung
bot/embedder.py	Mới	SentenceTransformer model, hàm embed(texts: list[str]) → np.ndarray
bot/vector_store.py	Mới	FAISS IndexFlatL2 + pickle: add(embeddings, metadatas), search(query_vec, k=5), save/load
bot/chunker.py	Mới	chunk_product(doc), chunk_blog(doc), chunk_policy(file_path) → list {text, metadata}
bot/indexer.py	Mới	Script chạy 1 lần: load data → chunk → embed → lưu FAISS index + metadata
bot/llm.py	Mới	Gemini wrapper (dùng google-genai SDK): generate(query, context_docs) → str
bot/service.py	Sửa	Pipeline RAG: rag_chat(message) → embed → search → build prompt → Gemini → response
bot/main.py	Sửa	Thêm POST /api/chat, startup event load index
📁 Data files (mới)
File	Nội dung
bot/data/faqs.json	Câu hỏi thường gặp (FAQ)
bot/data/shipping.txt	Chính sách giao hàng
bot/data/return.txt	Chính sách đổi trả
bot/data/warranty.txt	Chính sách bảo hành
🌐 Express Backend (2 files)
File	Status
backend/src/controllers/chat.controller.js	Mới
backend/src/routers/chat.routes.js	Mới
backend/src/routers/index.js	Sửa
⚛️ React Frontend (3 files)
File	Status	Nội dung
frontend/src/api/chatbot.js	Mới	sendMessage(text) → POST /api/chat
frontend/src/api/index.js	Sửa	Export chatbotAPI
frontend/src/components/ChatBot.jsx	Mới	Floating bubble widget (góc dưới-phải), input, message list, loading, scroll
📦 Indexing flow
indexer.py chạy 1 lần:

  MongoDB.products → chunker → embedder → FAISS index
  MongoDB.blogs    → chunker → embedder → FAISS index
  data/*.json/.txt → chunker → embedder → FAISS index
                              ↓
                     Lưu: index.faiss + metadata.pkl

🧠 Prompt template
Bạn là trợ lý tư vấn cho Nam Acoustic Guitar Shop.
Dùng thông tin sau để trả lời khách hàng bằng tiếng Việt:

[THÔNG TIN SẢN PHẨM / CHÍNH SÁCH]
{context}

Câu hỏi: {user_message}
Trả lời: