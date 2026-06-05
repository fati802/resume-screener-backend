"""
Cosine similarity — computes similarity between resume and job embeddings.
"""

import numpy as np
from typing import List


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Compute cosine similarity between two embedding vectors.
    Returns a float between 0.0 and 1.0.
    """
    a = np.array(vec1)
    b = np.array(vec2)

    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return float(np.dot(a, b) / (norm_a * norm_b))


def similarity_to_score(similarity: float) -> float:
    """
    Convert cosine similarity (0-1) to a score out of 100.
    """
    return round(similarity * 100, 2)