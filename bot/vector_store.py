"""
vector_store.py
FAISS vector database + pickle metadata persistence.
Đồng thời ghi/đọc embedding vào MongoDB collection 'knowledge_chunks'.
"""

import faiss
import numpy as np
import pickle
import os
from pymongo import MongoClient
from config import MONGO_URI

INDEX_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_FILE = os.path.join(INDEX_DIR, "index.faiss")
META_FILE = os.path.join(INDEX_DIR, "metadata.pkl")

_index = None
_metadata: list[dict] = []


def build_index(embeddings: np.ndarray, metadata: list[dict]):
    """
    Xây FAISS index từ embeddings và lưu metadata.
    """
    global _index, _metadata

    dim = embeddings.shape[1]
    _index = faiss.IndexFlatL2(dim)
    _index.add(embeddings)
    _metadata = metadata

    faiss.write_index(_index, INDEX_FILE)
    with open(META_FILE, "wb") as f:
        pickle.dump(_metadata, f)

    print(f"[vector_store] Saved index: {_index.ntotal} vectors, dim={dim}")


def load_index() -> bool:
    """Load index từ disk. Trả về True nếu thành công."""
    global _index, _metadata

    if not os.path.exists(INDEX_FILE) or not os.path.exists(META_FILE):
        print("[vector_store] No index found.")
        return False

    _index = faiss.read_index(INDEX_FILE)
    with open(META_FILE, "rb") as f:
        _metadata = pickle.load(f)

    print(f"[vector_store] Loaded index: {_index.ntotal} vectors")
    return True


def search(query_embedding: np.ndarray, top_k: int = 5) -> list[dict]:
    """Tìm top_k vectors gần nhất với query."""
    if _index is None or _index.ntotal == 0:
        return []

    distances, indices = _index.search(query_embedding, top_k)

    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < 0 or idx >= len(_metadata):
            continue
        item = {**_metadata[idx], "score": float(dist)}
        results.append(item)

    return results


def get_index_size() -> int:
    """Trả về số lượng vectors trong index."""
    if _index is None:
        return 0
    return _index.ntotal


def save_chunks_to_mongodb(chunks: list[dict], embeddings: np.ndarray):
    """
    Ghi chunks + embeddings vào MongoDB collection 'knowledge_chunks'.
    Xóa旧 dữ liệu trước khi insert mới (full rebuild).
    """
    client = None
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()
        collection = db["knowledge_chunks"]

        collection.delete_many({})

        docs = []
        for i, chunk in enumerate(chunks):
            doc = {
                "chunk_id": f"chunk_{i}_{hash(chunk.get('text', '')[:50]) & 0xFFFFFFFF:08x}",
                "document_id": chunk.get("document_id") or None,
                "chunk_text": chunk.get("text", ""),
                "embedding": embeddings[i].tolist(),
                "metadata": {
                    "type": chunk.get("source", ""),
                    "category_ids": [],
                    "product_ids": [chunk["product_id"]] if chunk.get("product_id") else [],
                },
                "source_title": chunk.get("product_name") or chunk.get("document_title") or chunk.get("source", ""),
            }
            if doc["document_id"] is None:
                del doc["document_id"]
            docs.append(doc)

        if docs:
            collection.insert_many(docs)

        print(f"[vector_store] Saved {len(docs)} chunks to MongoDB")
    except Exception as e:
        print(f"[vector_store] MongoDB save error: {e}")
    finally:
        if client:
            client.close()


def load_chunks_from_mongodb() -> tuple[list[dict], np.ndarray | None]:
    """
    Đọc chunks + embeddings từ MongoDB collection 'knowledge_chunks'.
    Trả về (metadata_list, embeddings_array hoặc None nếu rỗng).
    """
    client = None
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()
        collection = db["knowledge_chunks"]

        cursor = collection.find({}, {"chunk_id": 1, "chunk_text": 1, "metadata": 1, "source_title": 1, "document_id": 1})
        chunks = list(cursor)

        if not chunks:
            print("[vector_store] No chunks in MongoDB")
            return [], None

        metadata_list = []
        embeddings_list = []

        for chunk in chunks:
            meta = {
                "text": chunk.get("chunk_text", ""),
                "source": chunk.get("metadata", {}).get("type", ""),
                "source_title": chunk.get("source_title", ""),
                "chunk_id": chunk.get("chunk_id", ""),
                "document_id": str(chunk.get("document_id", "")) if chunk.get("document_id") else "",
            }
            metadata_list.append(meta)

            emb = chunk.get("embedding", [])
            embeddings_list.append(emb)

        if embeddings_list and len(embeddings_list[0]) > 0:
            embeddings_arr = np.array(embeddings_list, dtype="float32")
            print(f"[vector_store] Loaded {len(metadata_list)} chunks from MongoDB")
            return metadata_list, embeddings_arr
        else:
            print("[vector_store] No embeddings found in MongoDB")
            return metadata_list, None

    except Exception as e:
        print(f"[vector_store] MongoDB load error: {e}")
        return [], None
    finally:
        if client:
            client.close()
