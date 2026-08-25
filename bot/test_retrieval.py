"""
test_retrieval.py
Danh gia Retrieval Precision@K cho RAG Chatbot.
Chay: cd bot && python test_retrieval.py
"""

import sys
import os
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vector_store import load_index, search, get_index_size
from embedder import embed_query
from db_query import query_all
from pymongo import MongoClient
from config import MONGO_URI


# ── Test cases: (cau hoi, source type mong muon, keyword trong ten san pham hoac document) ──

TEST_CASES = [
    {
        "question": "Người mới nên học guitar nào?",
        "expected_source": "product",
        "expected_keyword": "Rosen G12",
    },
    {
        "question": "Dưới 7 triệu mua Organ nào?",
        "expected_source": "product",
        "expected_keyword": "PSR",
    },
    {
        "question": "Piano điện khác Organ thế nào?",
        "expected_source": "document:product_guide",
        "expected_keyword": "Piano dien va Organ",
    },
    {
        "question": "Cách bảo quản guitar acoustic?",
        "expected_source": "document:manual",
        "expected_keyword": "cham soc",
    },
    {
        "question": "Giá guitar Rosen bao nhiêu?",
        "expected_source": "product",
        "expected_keyword": "Rosen G12",
    },
    {
        "question": "Chính sách bảo hành?",
        "expected_source": "document:policy",
        "expected_keyword": "bao hanh",
    },
    {
        "question": "Giao hàng bao lâu?",
        "expected_source": "document:faq",
        "expected_keyword": "giao hang",
    },
    {
        "question": "Đắt nhất cửa hàng?",
        "expected_source": "product",
        "expected_keyword": "",
    },
]


def get_mongodb_context(question: str) -> list[dict]:
    """Query MongoDB using query_all."""
    return query_all(question)


def get_faiss_context(question: str, top_k: int = 5) -> list[dict]:
    """FAISS vector search."""
    query_vec = embed_query(question)
    return search(query_vec, top_k=top_k)


def check_match(expected_keyword: str, context_docs: list[dict]) -> tuple[bool, str]:
    """Kiem tra expected_keyword co xuat hien trong context khong."""
    if not expected_keyword:
        return True, "(no keyword check)"
    for doc in context_docs:
        text = doc.get("text", "").lower()
        product_name = doc.get("product_name", "").lower()
        source_title = doc.get("source_title", "").lower()
        keywords = expected_keyword.lower().split()
        for kw in keywords:
            if (kw in text or kw in product_name or kw in source_title):
                found_in = doc.get("product_name") or doc.get("source_title") or doc.get("source", "")
                return True, found_in
    # Debug: print what we have
    if context_docs:
        doc = context_docs[0]
        print(f"    [debug] text[:80]={doc.get('text','')[:80]}")
        print(f"    [debug] source_title={doc.get('source_title','')}")
        print(f"    [debug] product_name={doc.get('product_name','')}")
    return False, ""


def run_evaluation():
    print("=" * 80)
    print("RAG RETRIEVAL EVALUATION")
    print("=" * 80)

    # Load FAISS index
    if get_index_size() == 0:
        loaded = load_index()
        if not loaded:
            print("[ERROR] No FAISS index found. Run 'python indexer.py' first!")
            return
    print(f"[OK] FAISS index loaded: {get_index_size()} vectors\n")

    results = []

    for i, tc in enumerate(TEST_CASES):
        question = tc["question"]
        expected_source = tc["expected_source"]
        expected_keyword = tc["expected_keyword"]

        # MongoDB retrieval
        mongo_docs = get_mongodb_context(question)
        mongo_match, mongo_found = check_match(expected_keyword, mongo_docs)

        # FAISS retrieval
        faiss_docs = get_faiss_context(question, top_k=5)
        faiss_match, faiss_found = check_match(expected_keyword, faiss_docs)

        # Combined (MongoDB first, fallback FAISS)
        combined_docs = mongo_docs if mongo_docs else faiss_docs
        combined_match, combined_found = check_match(expected_keyword, combined_docs)

        results.append({
            "question": question,
            "expected_keyword": expected_keyword,
            "mongo_count": len(mongo_docs),
            "mongo_match": mongo_match,
            "mongo_found": mongo_found,
            "faiss_count": len(faiss_docs),
            "faiss_match": faiss_match,
            "faiss_found": faiss_found,
            "combined_match": combined_match,
            "combined_found": combined_found,
        })

    # Print results table
    print(f"{'Cau hoi':<35} {'Keyword':<15} {'Mongo(K/Hit)':<14} {'FAISS(K/Hit)':<14} {'Combined':<10}")
    print("-" * 90)

    mongo_hits = 0
    faiss_hits = 0
    combined_hits = 0
    total = len(results)

    for r in results:
        q = r["question"][:33]
        kw = r["expected_keyword"][:13] if r["expected_keyword"] else "-"
        mongo_str = f"{r['mongo_count']}/{'Y' if r['mongo_match'] else 'N'}"
        faiss_str = f"{r['faiss_count']}/{'Y' if r['faiss_match'] else 'N'}"
        combined_str = "Y" if r["combined_match"] else "N"

        if r["mongo_match"]: mongo_hits += 1
        if r["faiss_match"]: faiss_hits += 1
        if r["combined_match"]: combined_hits += 1

        print(f"{q:<35} {kw:<15} {mongo_str:<14} {faiss_str:<14} {combined_str:<10}")

    print("-" * 90)
    print(f"{'PRECISION':<35} {'':<15} {mongo_hits/total:.1%}{'':<9} {faiss_hits/total:.1%}{'':<9} {combined_hits/total:.1%}")
    print(f"{'HITS':<35} {'':<15} {mongo_hits}/{total}{'':<8} {faiss_hits}/{total}{'':<8} {combined_hits}/{total}")

    # Print detailed results
    print("\n" + "=" * 80)
    print("CHI TIET")
    print("=" * 80)
    for r in results:
        status = "PASS" if r["combined_match"] else "FAIL"
        print(f"\n[{status}] {r['question']}")
        print(f"  Expected keyword: '{r['expected_keyword']}'")
        print(f"  MongoDB: {r['mongo_count']} docs -> {'Found: ' + r['mongo_found'] if r['mongo_match'] else 'NOT FOUND'}")
        print(f"  FAISS:   {r['faiss_count']} docs -> {'Found: ' + r['faiss_found'] if r['faiss_match'] else 'NOT FOUND'}")
        print(f"  Combined: {'OK' if r['combined_match'] else 'MISS'} -> {r['combined_found'] if r['combined_match'] else 'No match'}")


if __name__ == "__main__":
    run_evaluation()
