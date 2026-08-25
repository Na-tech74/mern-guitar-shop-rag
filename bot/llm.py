"""
llm.py
Gọi Google Gemini API với context từ RAG pipeline.
"""

from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL

SYSTEM_PROMPT = """Bạn là trợ lý tư vấn bán hàng của Nam Acoustic Guitar Shop.

NHIỆM VỤ CHÍNH: Giới thiệu sản phẩm cụ thể cho khách hàng dựa trên THÔNG TIN SẢN PHẨM được cung cấp bên dưới.

QUY TẮC BẮT BUỘC:
1. Nếu THÔNG TIN SẢN PHẨM có sản phẩm phù hợp, BẮT BUỘC phải nêu TÊN SẢN PHẨM + GIÁ + THÔNG SỐ KỸ THUẬT.
2. Trả lời ngắn gọn, súc tích: tên sản phẩm, giá, thông số chính, ưu điểm.
3. Kết thúc bằng lời khuyên hoặc khuyến khích liên hệ cửa hàng.
4. Trả lời bằng tiếng Việt, thân thiện, 2-4 câu.

VÍ DÚ CÁCH TRẢ LỜI ĐÚNG:
"Dạ bạn nên chọn Rosen G12 - giá 1.200.000đ. Thông số: Guitar Acoustic 41 inch, gỗ Spruce + Phong, action thấp dễ bấm. Rất phù hợp cho người mới bắt đầu. Bạn đến cửa hàng thử đàn nhé!"

TUYỆT ĐỐI KHÔNG được trả lời chung chung kiểu "bạn nên chọn acoustic hoặc classic" mà KHÔNG nêu tên sản phẩm cụ thể.
"""

_client = None


def _get_client():
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            print("[llm] ERROR: GEMINI_API_KEY not set!")
            return None
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def build_prompt(user_message: str, context_docs: list[dict]) -> str:
    context_parts = []
    for doc in context_docs:
        source = doc.get("source", "")
        source_title = doc.get("source_title", "")
        text = doc.get("text", "")
        product_name = doc.get("product_name", "")

        header = source_title or source
        if product_name:
            header = f"{product_name} ({source})"

        if text:
            context_parts.append(f"[{header}]\n{text}")

    context_str = "\n\n---\n\n".join(context_parts) if context_parts else "(Không có thông tin liên quan)"

    return (
        f"{SYSTEM_PROMPT}\n\n"
        f"THÔNG TIN SẢN PHẨM TỪ CỬA HÀNG:\n{context_str}\n\n"
        f"Câu hỏi của khách hàng: {user_message}\n"
        f"Trả lời:"
    )


def generate_reply(user_message: str, context_docs: list[dict]) -> str:
    client = _get_client()
    if client is None:
        return "Lỗi: Chưa cấu hình GEMINI_API_KEY. Vui lòng kiểm tra file .env"

    prompt = build_prompt(user_message, context_docs)

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        reply = response.text.strip()
        return reply if reply else "Mình chưa có câu trả lời cho câu hỏi này."
    except Exception as exc:
        print(f"[llm error] model={GEMINI_MODEL} error={exc}")
        return f"Xin lỗi, hiện tại dịch vụ AI đang gặp sự cố. Bạn vui lòng thử lại sau! (Lỗi: {type(exc).__name__})"
