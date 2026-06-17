import google.generativeai as genai   # pyright: ignore[reportMissingImports]
from pymongo import MongoClient # pyright: ignore[reportMissingImports]
from sentence_transformers import SentenceTransformer # pyright: ignore[reportMissingImports]
import faiss # pyright: ignore[reportMissingImports]
import numpy as np # pyright: ignore[reportMissingImports]
import pickle
import os
from config import MONGO_URI, GEMINI_API_KEY, EMBEDDING_MODEL

# connect MongoDB
client = MongoClient(MONGO_URI)
db = client.get_database()

products_colection =db["products"] 
