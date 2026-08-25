"""
chunker.py
Chia dữ liệu thành các chunk nhỏ để embed và tìm kiếm.
Hỗ trợ chunking strategy: chunk_size, overlap cho nội dung dài.
Mỗi chunk có: text, source, metadata.
"""

from preprocessor import clean_text

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100


def split_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Chia text thành nhiều đoạn theo chunk_size ký tự, có overlap.
    Ưu tiên cắt theo câu (.) hoặc đoạn (\n) nếu có thể.
    """
    text = text.strip()
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size

        if end < len(text):
            for sep in ["\n\n", "\n", ". ", "! ", "? "]:
                last_sep = text.rfind(sep, start + chunk_size // 2, end)
                if last_sep > start:
                    end = last_sep + len(sep)
                    break

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - overlap
        if start >= len(text):
            break

    return chunks


def chunk_product(product: dict) -> dict:
    """Chuyển 1 product thành 1 chunk text."""
    name = product.get("name", "")
    description = product.get("description", "")
    price = product.get("price", 0)
    original_price = product.get("originalPrice", 0)
    brand = product.get("brand", {})
    brand_name = brand.get("name", "") if isinstance(brand, dict) else ""
    category = product.get("category", {})
    category_name = category.get("name", "") if isinstance(category, dict) else ""
    stock = product.get("stock", 0)
    sold = product.get("sold", 0)

    price_text = f"{price:,}đ".replace(",", ".")
    discount_text = ""
    if original_price and original_price > price:
        discount_text = f", giá gốc {original_price:,}đ".replace(",", ".")

    text = (
        f"Sản phẩm: {name}\n"
        f"Danh mục: {category_name}\n"
        f"Thương hiệu: {brand_name}\n"
        f"Giá: {price_text}{discount_text}\n"
        f"Mô tả: {description}\n"
        f"Tồn kho: {stock} | Đã bán: {sold}"
    )

    return {
        "text": clean_text(text),
        "source": "product",
        "product_id": str(product.get("_id", "")),
        "product_name": name,
        "category": category_name,
        "brand": brand_name,
        "price": price,
    }


def chunk_products(products: list[dict]) -> list[dict]:
    """Chunk list products thành list chunks."""
    return [chunk_product(p) for p in products]


def chunk_document(doc: dict) -> list[dict]:
    """
    Chunk 1 document từ MongoDB collection 'documents'.
    Chia nội dung dài thành nhiều chunk nhỏ.
    """
    content = doc.get("content", "")
    if not content.strip():
        return []

    chunks = split_text(content)
    result = []
    doc_type = doc.get("type", "")
    doc_title = doc.get("title", "")
    doc_id = str(doc.get("_id", ""))

    for i, chunk_text in enumerate(chunks):
        result.append({
            "text": clean_text(chunk_text),
            "source": f"document:{doc_type}",
            "document_id": doc_id,
            "document_title": doc_title,
            "document_type": doc_type,
            "chunk_index": i,
        })

    return result


def chunk_documents(documents: list[dict]) -> list[dict]:
    """Chunk list documents thành list chunks."""
    all_chunks = []
    for doc in documents:
        all_chunks.extend(chunk_document(doc))
    return all_chunks


def chunk_policy_file(text: str, source_name: str) -> list[dict]:
    """
    Chunk 1 file policy (FAQ, bảo hành, giao hàng, đổi trả).
    Chia nhỏ nếu nội dung dài.
    """
    if not text.strip():
        return []

    chunks = split_text(text)
    return [
        {
            "text": clean_text(chunk_text),
            "source": f"policy:{source_name}",
            "chunk_index": i,
        }
        for i, chunk_text in enumerate(chunks)
    ]


def chunk_policy_files(files: dict[str, str]) -> list[dict]:
    """Chunk dict {filename: content} thành list chunks."""
    all_chunks = []
    for name, content in files.items():
        all_chunks.extend(chunk_policy_file(content, name))
    return all_chunks
