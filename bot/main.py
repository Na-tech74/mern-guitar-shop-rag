from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from google import genai

from config import GEMINI_API_KEY, GEMINI_MODEL

app = FastAPI(title="RAG Chatbot Service", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """Bạn là trợ lý ảo của Nam Acoustic Guitar Shop - cửa hàng bán đàn guitar.

Nhiệm vụ của bạn là tư vấn và trả lời thân thiện, ngắn gọn bằng tiếng Việt về:
- Sản phẩm: Guitar Acoustic, Guitar Classic, Guitar Electric, phụ kiện đàn guitar.
- Giá cả, khuyến mãi, mã giảm giá.
- Chính sách: bảo hành 12 tháng, miễn phí giao hàng đơn trên 500k, đổi trả 7 ngày.
- Khóa học guitar, thanh toán, giao hàng, liên hệ cửa hàng.

Chỉ trả lời dựa trên thông tin của cửa hàng. Nếu câu hỏi ngoài phạm vi, hãy lịch sự hướng dẫn người dùng liên hệ trang web. Trả lời ngắn gọn, dễ hiểu."""

client = genai.Client(api_key=GEMINI_API_KEY)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def read_root():
    return {"message": "RAG Bot is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/chat")
def chat(req: ChatRequest):
    if not req.message.strip():
        return {"reply": "Bạn chưa nhập nội dung, hãy gửi câu hỏi cho mình nhé!"}

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=f"{SYSTEM_PROMPT}\n\nNgười dùng: {req.message}",
        )
        reply = response.text.strip() or "Mình chưa có câu trả lời cho câu hỏi này."
    except Exception as exc:
        print(f"[chat error] {exc}")
        reply = "Xin lỗi, hiện tại dịch vụ AI đang gặp sự cố. Bạn vui lòng thử lại sau nhé!"

    return {"reply": reply}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
