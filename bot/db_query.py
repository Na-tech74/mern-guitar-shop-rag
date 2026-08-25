"""
db_query.py
Truy vấn MongoDB trực tiếp: products + documents.
"""

import re
import unicodedata
from pymongo import MongoClient
from config import MONGO_URI


def _remove_diacritics(text: str) -> str:
    """Remove Vietnamese diacritics: 'bảo quản' -> 'bao quan'."""
    text = unicodedata.normalize("NFD", text)
    result = []
    for char in text:
        cat = unicodedata.category(char)
        if cat != "Mn":
            result.append(char)
    return "".join(result)


def _normalize(text: str) -> str:
    """Lowercase + remove diacritics for matching."""
    return _remove_diacritics(text).lower()


def _get_db():
    client = MongoClient(MONGO_URI)
    return client, client.get_database()


# ── Pattern detection ──────────────────────────────────────────────

SUPERLATIVE_PATTERNS = [
    (r"đắt\s*(nhất|Quá|qua)", "max"),
    (r"mắc\s*(nhất|Quá|qua)", "max"),
    (r"cao\s*cấp\s*(nhất|Quá|qua)?", "max"),
    (r"giá\s*cao\s*(nhất)?", "max"),
    (r"đắt\s*tiền\s*(nhất)?", "max"),
    (r"rẻ\s*(nhất|Quá|qua)", "min"),
    (r"giá\s*rẻ\s*(nhất)?", "min"),
    (r"giá\s*thấp\s*(nhất)?", "min"),
    (r"phổ\s*thông\s*(nhất)?", "min"),
]

PRICE_RANGE_PATTERN = re.compile(
    r"(?:dưới|không quá|tối đa|còn|chỉ)\s*(\d+)\s*(tr|[Tt]riệu|triệu)",
    re.IGNORECASE,
)

BEGINNER_KEYWORDS = [
    "nguoi moi", "moi hoc", "moi bat dau", "tap choi", "hoc choi",
    "nguoi hoc", "biet choi", "chua biet", "moi tap", "sinh vien",
    "nen mua", "nen chon", "nen hoc", "phu hop", "goi y",
]

CATEGORY_KEYWORDS = {
    "guitar": ["guitar", "đàn guitar", "ghi-ta", "ghita", "acoustic", "classic", "electric"],
    "organ": ["organ", "đàn organ", "keyboard", "psr"],
    "piano": ["piano", "đàn piano", "piano điện", "digital piano"],
    "ukulele": ["ukulele", "ulelê"],
}

DOCUMENT_KEYWORDS = {
    "bao hanh": ["bảo hành", "bao hanh", "warranty"],
    "giao hang": ["giao hàng", "giao hang", "ship", "vận chuyển"],
    "doi tra": ["đổi trả", "doi tra", "return", "hoàn tiền"],
    "thanh toan": ["thanh toán", "thanh toan", "payment", "cod", "chuyển khoản"],
    "bao quan": ["cham soc", "bao quan", "ve sinh", "chăm sóc"],
    "piano vs organ": ["piano khác organ", "phan biet piano", "piano vs organ", "khác organ"],
    "chon guitar": ["chọn guitar", "chon guitar", "mua guitar", "người mới"],
}


# ── Intent detection ───────────────────────────────────────────────

def detect_superlative(message: str) -> str | None:
    msg = message.lower()
    for pattern, direction in SUPERLATIVE_PATTERNS:
        if re.search(pattern, msg):
            return direction
    return None


def detect_price_range(message: str) -> dict | None:
    match = PRICE_RANGE_PATTERN.search(message.lower())
    if match:
        num = int(match.group(1))
        unit = match.group(2).lower()
        if "tr" in unit or "triệu" in unit:
            max_price = num * 1_000_000
        else:
            max_price = num
        return {"max_price": max_price}
    return None


def detect_category(message: str) -> str | None:
    msg = _normalize(message)
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in msg:
                return cat
    return None


def detect_beginner(message: str) -> bool:
    msg = _normalize(message)
    return any(kw in msg for kw in BEGINNER_KEYWORDS)


def detect_document_type(message: str) -> str | None:
    """Phát hiện câu hỏi cần tìm document (policy, faq, manual)."""
    msg = _normalize(message)
    for doc_type, keywords in DOCUMENT_KEYWORDS.items():
        for kw in keywords:
            if kw in msg:
                return doc_type
    return None


# ── MongoDB queries ────────────────────────────────────────────────

def query_products_by_filter(query: dict, sort_by: str = None, sort_order: int = 1, limit: int = 5) -> list[dict]:
    """Query products từ MongoDB với filter tùy chỉnh."""
    client = None
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()
        if sort_by:
            products = list(db["products"].find(query).sort(sort_by, sort_order).limit(limit))
        else:
            products = list(db["products"].find(query).limit(limit))
        return _format_products(products, db)
    except Exception as e:
        print(f"[db_query] query_products error: {e}")
        return []
    finally:
        if client:
            client.close()


def query_documents_by_keyword(keyword: str) -> list[dict]:
    """Query documents collection theo tu khoan."""
    client = None
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()
        regex = {"$regex": keyword, "$options": "i"}
        docs = list(db["documents"].find({
            "status": "active",
            "$or": [{"title": regex}, {"content": regex}],
        }).limit(3))

        print(f"[db_query] query_documents('{keyword}'): found {len(docs)} docs")
        for d in docs:
            print(f"  -> title={d.get('title','?')[:60]}")

        results = []
        for doc in docs:
            content = doc.get("content", "")
            if len(content) > 500:
                content = content[:500] + "..."
            results.append({
                "text": content,
                "source": f"document:{doc.get('type', 'unknown')}",
                "source_title": doc.get("title", ""),
                "document_id": str(doc.get("_id", "")),
            })
        return results
    except Exception as e:
        print(f"[db_query] query_documents error: {e}")
        return []
    finally:
        if client:
            client.close()


def query_extreme_price(direction: str = "max") -> list[dict]:
    query = {"price": {"$gt": 0}}
    sort_order = -1 if direction == "max" else 1
    return query_products_by_filter(query, sort_by="price", sort_order=sort_order, limit=3)


def query_price_range(max_price: float, category: str = None) -> list[dict]:
    query = {"price": {"$gt": 0, "$lte": max_price}}
    if category:
        client = None
        try:
            client = MongoClient(MONGO_URI)
            db = client.get_database()
            cat_doc = db["categories"].find_one({"name": {"$regex": category, "$options": "i"}})
            if cat_doc:
                query["category"] = cat_doc["_id"]
        except Exception:
            pass
        finally:
            if client:
                client.close()
    return query_products_by_filter(query, sort_by="price", sort_order=1, limit=5)


def query_beginner_products(category: str = None) -> list[dict]:
    """Tim san pham phu hop nguoi moi: gia <= 5tr."""
    query = {"price": {"$gt": 0, "$lte": 5_000_000}}
    if category:
        client = None
        try:
            client = MongoClient(MONGO_URI)
            db = client.get_database()
            cat_doc = db["categories"].find_one({"name": {"$regex": category, "$options": "i"}})
            if cat_doc:
                query["category"] = cat_doc["_id"]
        except Exception:
            pass
        finally:
            if client:
                client.close()
    return query_products_by_filter(query, sort_by="price", sort_order=1, limit=5)


def query_by_keyword(keyword: str, category: str = None) -> list[dict]:
    """Tim san pham theo tu khoan trong ten/mo ta."""
    regex = {"$regex": keyword, "$options": "i"}
    query = {
        "price": {"$gt": 0},
        "$or": [{"name": regex}, {"description": regex}],
    }
    if category:
        client = None
        try:
            client = MongoClient(MONGO_URI)
            db = client.get_database()
            cat_doc = db["categories"].find_one({"name": {"$regex": category, "$options": "i"}})
            if cat_doc:
                query["category"] = cat_doc["_id"]
        except Exception:
            pass
        finally:
            if client:
                client.close()
    return query_products_by_filter(query, limit=5)


# ── Combined query (products + documents) ──────────────────────────

def query_all(message: str) -> list[dict]:
    """
    Query MongoDB: products + documents.
    Tra ve list context_docs hop nhat.
    """
    results = []

    # 1. Superlative
    direction = detect_superlative(message)
    if direction:
        results.extend(query_extreme_price(direction))
        return results

    # 2. Price range
    price_range = detect_price_range(message)
    if price_range:
        category = detect_category(message)
        results.extend(query_price_range(price_range["max_price"], category))
        return results

    # 3. Document keyword (uu tien truoc products)
    doc_keyword = detect_document_type(message)
    if doc_keyword:
        search_map = {
            "bao hanh": "bảo hành",
            "giao hang": "giao hàng",
            "doi tra": "đổi trả",
            "thanh toan": "thanh toán",
            "bao quan": "cham soc",
            "piano vs organ": "Piano dien va Organ",
            "chon guitar": "Rosen G12",
        }
        search_term = search_map.get(doc_keyword, doc_keyword)
        results.extend(query_documents_by_keyword(search_term))
        if results:
            return results

    # 3b. Price + product name: "giá Rosen", "Rosen bao nhiêu"
    if "rosen" in _normalize(message):
        results.extend(query_by_keyword("Rosen"))
        if results:
            return results

    # 3c. Beginner + guitar -> specifically recommend Rosen G12
    if detect_beginner(message) and detect_category(message) == "guitar":
        results.extend(query_documents_by_keyword("Rosen G12"))
        if results:
            return results

    # 4. Beginner
    if detect_beginner(message):
        category = detect_category(message)
        results.extend(query_beginner_products(category))

    # 5. Category keyword (products)
    category = detect_category(message)
    if category:
        results.extend(query_by_keyword(category, category))

    # 6. Fallback: tim documents neu chua co ket qua
    if not results:
        results.extend(query_documents_by_keyword(message[:30]))

    return results


# ── Format helpers ─────────────────────────────────────────────────

def _format_products(products: list[dict], db=None) -> list[dict]:
    brands_cache = {}
    cats_cache = {}
    if db is not None:
        brands_cache = {str(b["_id"]): b for b in db["brands"].find({})}
        cats_cache = {str(c["_id"]): c for c in db["categories"].find({})}

    results = []
    for p in products:
        brand = p.get("brand", {})
        if not isinstance(brand, dict):
            bid = str(brand) if brand else ""
            brand = brands_cache.get(bid, {"name": ""})

        category_obj = p.get("category", {})
        if not isinstance(category_obj, dict):
            cid = str(category_obj) if category_obj else ""
            category_obj = cats_cache.get(cid, {"name": ""})

        name = p.get("name", "")
        description = p.get("description", "")
        price = p.get("price", 0)
        original_price = p.get("originalPrice", 0)
        brand_name = brand.get("name", "") if isinstance(brand, dict) else ""
        category_name = category_obj.get("name", "") if isinstance(category_obj, dict) else ""

        price_text = f"{price:,}đ".replace(",", ".")
        discount_text = ""
        if original_price and original_price > price:
            discount_text = f", giá gốc {original_price:,}đ".replace(",", ".")

        text = (
            f"Sản phẩm: {name}\n"
            f"Danh mục: {category_name}\n"
            f"Thương hiệu: {brand_name}\n"
            f"Giá: {price_text}{discount_text}\n"
            f"Mô tả: {description}"
        )

        results.append({
            "text": text,
            "source": "product",
            "product_id": str(p.get("_id", "")),
            "product_name": name,
            "category": category_name,
            "brand": brand_name,
            "price": price,
        })

    return results
