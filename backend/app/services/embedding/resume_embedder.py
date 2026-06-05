"""
Resume embedder — generates semantic embeddings for resume text.
"""

from typing import List
from sentence_transformers import SentenceTransformer
from app.core.config import get_settings

settings = get_settings()

# Load model once at module level
_model = None


def get_model() -> SentenceTransformer:
    """Get or load the sentence transformer model."""
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model


def embed_resume(text: str) -> List[float]:
    """
    Generate a semantic embedding vector for resume text.
    Returns a 384-dimensional float vector.
    """
    model = get_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


def embed_batch(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for multiple texts at once.
    More efficient than calling embed_resume in a loop.
    """
    model = get_model()
    embeddings = model.encode(texts, normalize_embeddings=True, batch_size=32)
    return [e.tolist() for e in embeddings]