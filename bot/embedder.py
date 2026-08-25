"""
embedder.py
SentenceTransformer embedding model - chuyển text thành vector 384 chiều.
Dùng model multilingual-e5-small hỗ trợ tiếng Việt tốt.
"""

from sentence_transformers import SentenceTransformer
import numpy as np
from config import EMBEDDING_MODEL

_model = None


def get_model() -> SentenceTransformer:
    """Lazy load model chỉ 1 lần."""
    global _model
    if _model is None:
        print(f"[embedder] Loading model {EMBEDDING_MODEL}...")
        _model = SentenceTransformer(EMBEDDING_MODEL)
        print("[embedder] Model loaded.")
    return _model


def embed_texts(texts: list[str]) -> np.ndarray:
    """
    Embed list texts thành numpy array (n, 384).
    """
    model = get_model()
    embeddings = model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
    return np.array(embeddings, dtype="float32")


def embed_query(text: str) -> np.ndarray:
    """
    Embed 1 câu query thành vector (1, 384).
    """
    return embed_texts([text])
