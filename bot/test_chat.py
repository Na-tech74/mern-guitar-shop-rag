"""
test_chat.py
Test RAG chatbot truc tiep tu console.
Chay: .venv\Scripts\python.exe test_chat.py
"""

import sys
import os
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vector_store import load_index, get_index_size
from service import rag_chat

print("=" * 50)
print("RAG CHATBOT TEST - Nam Acoustic Guitar Shop")
print("=" * 50)

loaded = load_index()
if not loaded:
    print("ERROR: Chua tim thay index. Chay 'python indexer.py' truoc!")
    sys.exit(1)

print(f"Index loaded: {get_index_size()} vectors")
print("Nhap 'quit' de thoat\n")

while True:
    try:
        question = input("Ban: ").strip()
    except (EOFError, KeyboardInterrupt):
        print("\nTam biet!")
        break

    if not question or question.lower() in ("quit", "exit", "q"):
        print("Tam biet!")
        break

    reply = rag_chat(question)
    print(f"Bot: {reply}\n")
