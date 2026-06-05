"""
Learning to rank — XGBoost-based ranking model for advanced candidate scoring.
"""

import numpy as np
from typing import List, Dict, Any


def build_feature_vector(scores: Dict[str, float]) -> List[float]:
    """
    Build a feature vector from candidate scores for the ranking model.
    """
    return [
        scores.get("skill_match_score", 0.0),
        scores.get("semantic_score", 0.0),
        scores.get("experience_score", 0.0),
        scores.get("education_score", 0.0),
        scores.get("preferred_skills_score", 0.0),
    ]


def rerank_with_model(
    scored_candidates: List[tuple],
    model_path: str = None,
) -> List[tuple]:
    """
    Optionally rerank candidates using a trained XGBoost ranker.
    Falls back to weighted score ranking if no model is available.
    """
    if model_path is None:
        # No model available — return as is (already sorted by weighted score)
        return scored_candidates

    try:
        import xgboost as xgb
        import joblib

        model = joblib.load(model_path)
        features = np.array([
            build_feature_vector(scores)
            for _, scores, _ in scored_candidates
        ])

        predictions = model.predict(features)
        reranked = sorted(
            zip(predictions, scored_candidates),
            key=lambda x: x[0],
            reverse=True,
        )
        return [item for _, item in reranked]

    except Exception:
        return scored_candidates