"""
preprocessor.py
Tiền xử lý văn bản: normalize Unicode, lowercase, loại bỏ ký tự thừa,
chuẩn hóa khoảng trắng, xử lý tiếng Việt.
"""

import re
import unicodedata


def normalize_unicode(text: str) -> str:
    """Chuẩn hóa Unicode NFC (ghép đúng tổ hợp dấu tiếng Việt)."""
    return unicodedata.normalize("NFC", text)


def normalize_whitespace(text: str) -> str:
    """Giảm nhiều khoảng trắng / newline thừa thành 1, trim đầu cuối."""
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def remove_special_chars(text: str) -> str:
    """Giữ lại chữ cái, số, dấu câu cơ bản tiếng Việt, bỏ ký tự lạ."""
    text = re.sub(r"[^\w\sàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđùúụủũưứừửữựìíịỉĩòóọỏõôồốộổỗơờớởỡợùúụủũưứừửữựýỳỷỹỵÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÙÚỤỦŨƯỨỪỬỮỰÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỞỠỢÙÚỤỦŨƯỨỪỬỮỰÝỲỶỸỴ.,!?:;()\-/%\"]", " ", text)
    return text


def clean_text(text: str) -> str:
    """Pipeline tiền xử lý hoàn chỉnh."""
    text = normalize_unicode(text)
    text = text.lower()
    text = remove_special_chars(text)
    text = normalize_whitespace(text)
    return text
