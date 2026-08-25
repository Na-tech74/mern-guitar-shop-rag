"""
service.py
RAG Pipeline: intent detection -> MongoDB query / FAISS search -> Gemini -> reply.
"""

from embedder import embed_query
from vector_store import search, load_index, get_index_size
from llm import generate_reply
from db_query import query_all


def extract_sources(reply: str, context_docs: list[dict]) -> dict | None:
    reply_lower = reply.lower()
    products = []
    documents = []
    seen_product_ids = set()
    seen_doc_titles = set()

    for doc in context_docs:
        product_name = doc.get("product_name", "")
        product_id = doc.get("product_id", "")
        source = doc.get("source", "")
        source_title = doc.get("source_title", "")

        if product_name and product_id and product_id not in seen_product_ids:
            if product_name.lower() in reply_lower:
                products.append({"name": product_name, "id": product_id})
                seen_product_ids.add(product_id)

        if source.startswith("document:") and source_title and source_title not in seen_doc_titles:
            doc_type = source.replace("document:", "")
            if any(word in reply_lower for word in source_title.lower().split()[:3]):
                documents.append({"title": source_title, "type": doc_type})
                seen_doc_titles.add(source_title)

    if not products and not documents:
        return None
    return {"products": products, "documents": documents}


def rag_chat(message: str) -> dict:
    if not message.strip():
        return {"reply": "Bạn chưa nhập nội dung, hãy gửi câu hỏi cho mình nhé!", "sources": None}

    if get_index_size() == 0:
        loaded = load_index()
        if not loaded:
            return {"reply": "Hệ thống đang khởi động, bạn vui lòng thử lại sau vài giây!", "sources": None}

    # Step 1: MongoDB intent-based query (products + documents)
    context_docs = query_all(message)

    # Step 2: FAISS vector search (fallback)
    if not context_docs:
        query_vec = embed_query(message)
        context_docs = search(query_vec, top_k=5)

    print(f"[rag_chat] Query: '{message}'")
    print(f"[rag_chat] Context docs: {len(context_docs)}")
    for i, r in enumerate(context_docs[:5]):
        print(f"  [{i}] source={r.get('source','?')} title={r.get('source_title') or r.get('product_name','?')}")
        print(f"      text: {r.get('text','')[:120]}...")

    if not context_docs:
        return {"reply": "Mình chưa tìm thấy thông tin liên quan. Bạn thử hỏi cụ thể hơn nhé!", "sources": None}

    # Step 3: Generate reply via Gemini
    reply = generate_reply(message, context_docs)

    # Step 4: Extract sources
    sources = extract_sources(reply, context_docs)

    return {"reply": reply, "sources": sources}
