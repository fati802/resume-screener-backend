"""
Train ranker — trains an XGBoost ranking model for candidate ranking.
"""

import numpy as np
import joblib
from typing import List, Dict


def train_ranker(
    scores: List[Dict[str, float]],
    relevance_labels: List[float],
    save_path: str = "app/ml/models/ranker.joblib",
) -> None:
    """
    Train an XGBoost ranking model.
    relevance_labels: float scores indicating how relevant each candidate is.
    """
    try:
        import xgboost as xgb

        X = np.array([
            [
                s.get("skill_match_score", 0.0),
                s.get("semantic_score", 0.0),
                s.get("experience_score", 0.0),
                s.get("education_score", 0.0),
                s.get("preferred_skills_score", 0.0),
            ]
            for s in scores
        ])
        y = np.array(relevance_labels)

        model = xgb.XGBRanker(
            objective="rank:pairwise",
            learning_rate=0.1,
            n_estimators=100,
            max_depth=4,
        )

        group = [len(X)]
        model.fit(X, y, group=group)

        import os
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        joblib.dump(model, save_path)
        print(f"Ranker saved to {save_path}")

    except ImportError:
        print("XGBoost not available. Skipping ranker training.")