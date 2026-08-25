"""
indexer.py
Script index dữ liệu từ MongoDB (products + documents + policies) vào FAISS + MongoDB knowledge_chunks.
Chạy 1 lần để tạo index, sau đó bot load lại khi khởi động.

Cách chạy:
    cd bot
    python indexer.py
"""

import os
import sys
from pymongo import MongoClient
from config import MONGO_URI
from chunker import chunk_products, chunk_documents, chunk_policy_files
from embedder import embed_texts
from vector_store import build_index, save_chunks_to_mongodb

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")


def load_policy_files() -> dict[str, str]:
    """Đọc tất cả file .txt trong thư mục data/."""
    files = {}
    if not os.path.exists(DATA_DIR):
        print(f"[indexer] Data dir not found: {DATA_DIR}")
        return files

    for fname in os.listdir(DATA_DIR):
        if fname.endswith(".txt"):
            fpath = os.path.join(DATA_DIR, fname)
            with open(fpath, "r", encoding="utf-8") as f:
                files[fname] = f.read()
            print(f"[indexer] Loaded policy: {fname} ({len(files[fname])} chars)")

    return files


def main():
    print("=" * 50)
    print("RAG INDEXER - Nam Acoustic Guitar Shop")
    print("=" * 50)

    all_chunks = []
    client = None

    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()

        # 1. Load products from MongoDB (populate brand + category)
        print("\n[1/5] Loading products from MongoDB...")
        products = list(db["products"].find({}))
        # Populate brand and category names for chunker
        brands_cache = {str(b["_id"]): b for b in db["brands"].find({})}
        cats_cache = {str(c["_id"]): c for c in db["categories"].find({})}
        for p in products:
            if isinstance(p.get("brand"), str) or (hasattr(p.get("brand"), "__class__") and p.get("brand").__class__.__name__ == "ObjectId"):
                bid = str(p["brand"]) if p.get("brand") else ""
                p["brand"] = brands_cache.get(bid, {"name": ""})
            if isinstance(p.get("category"), str) or (hasattr(p.get("category"), "__class__") and p.get("category").__class__.__name__ == "ObjectId"):
                cid = str(p["category"]) if p.get("category") else ""
                p["category"] = cats_cache.get(cid, {"name": ""})
        product_chunks = chunk_products(products)
        all_chunks.extend(product_chunks)
        print(f"[indexer] Products: {len(products)} -> chunks: {len(product_chunks)}")

        # 2. Load documents from MongoDB 'documents' collection
        print("\n[2/5] Loading documents from MongoDB...")
        documents = list(db["documents"].find({"status": "active"}))
        doc_chunks = chunk_documents(documents)
        all_chunks.extend(doc_chunks)
        print(f"[indexer] Documents: {len(documents)} -> chunks: {len(doc_chunks)}")

        # 3. Load policy files from data/ directory
        print("\n[3/5] Loading policy files...")
        policy_files = load_policy_files()
        policy_chunks = chunk_policy_files(policy_files)
        all_chunks.extend(policy_chunks)
        print(f"[indexer] Policy files: {len(policy_files)} -> chunks: {len(policy_chunks)}")

    except Exception as e:
        print(f"[indexer] MongoDB error: {e}")
        print("[indexer] Falling back to policy files only...")

        try:
            policy_files = load_policy_files()
            policy_chunks = chunk_policy_files(policy_files)
            all_chunks.extend(policy_chunks)
        except Exception:
            pass

    print(f"\n[indexer] Total chunks: {len(all_chunks)}")

    if len(all_chunks) == 0:
        print("[indexer] No data to index. Exiting.")
        return

    # 4. Embed all chunks
    print("\n[4/5] Embedding texts...")
    texts = [c["text"] for c in all_chunks]
    embeddings = embed_texts(texts)
    print(f"[indexer] Embeddings shape: {embeddings.shape}")

    # 5. Build FAISS index + save to MongoDB
    print("\n[5/5] Building FAISS index + saving to MongoDB...")
    build_index(embeddings, all_chunks)
    save_chunks_to_mongodb(all_chunks, embeddings)

    print("\n" + "=" * 50)
    print("INDEXING COMPLETE!")
    print(f"Total vectors: {len(all_chunks)}")
    print(f"Products: {len(product_chunks)}")
    print(f"Documents: {len(doc_chunks)}")
    print(f"Policies: {len(policy_chunks)}")
    print("=" * 50)

    if client:
        client.close()


if __name__ == "__main__":
    main()
