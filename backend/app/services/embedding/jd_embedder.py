"""
Job description embedder — generates semantic embeddings for job descriptions.
"""

from typing import List
from app.services.embedding.resume_embedder import get_model


def embed_job_description(text: str) -> List[float]:
    """
    Generate a semantic embedding vector for a job description.
    Uses the same model as resume embedder for consistency.
    Returns a 384-dimensional float vector.
    """
    model = get_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


def build_jd_text(title: str, description: str, required_skills: List[str], preferred_skills: List[str]) -> str:
    """
    Build a combined text representation of a job description
    for embedding generation.
    """
    skills_text = " ".join(required_skills + preferred_skills)
    return f"{title} {description} {skills_text}".strip()