"""
Recommend candidates — suggests best candidates for a job based on scores.
"""

from typing import List, Dict, Any


def recommend_candidates(
    ranked_candidates: List[Dict[str, Any]],
    top_n: int = 5,
    min_score: float = 60.0,
) -> List[Dict[str, Any]]:
    """
    Filter and return top recommended candidates for a job.
    Only includes candidates above the minimum score threshold.
    """
    recommendations = [
        c for c in ranked_candidates
        if c.get("overall_score", 0) >= min_score
    ]

    return recommendations[:top_n]


def get_recommendation_label(score: float) -> str:
    """
    Get a human-readable recommendation label based on score.
    """
    if score >= 85:
        return "Highly Recommended"
    elif score >= 70:
        return "Recommended"
    elif score >= 55:
        return "Consider"
    else:
        return "Not Recommended"