"""
Train classifier — trains a binary classifier to predict candidate suitability.
"""

import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from typing import List, Dict, Any


def build_features(scores: List[Dict[str, float]]) -> np.ndarray:
    """
    Build feature matrix from candidate scores.
    """
    return np.array([
        [
            s.get("skill_match_score", 0.0),
            s.get("semantic_score", 0.0),
            s.get("experience_score", 0.0),
            s.get("education_score", 0.0),
            s.get("preferred_skills_score", 0.0),
        ]
        for s in scores
    ])


def train_classifier(
    scores: List[Dict[str, float]],
    labels: List[int],
    save_path: str = "app/ml/models/classifier.joblib",
) -> RandomForestClassifier:
    """
    Train a Random Forest classifier on candidate scores.
    Labels: 1 = suitable, 0 = not suitable.
    """
    X = build_features(scores)
    y = np.array(labels)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=5,
        random_state=42,
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))

    # Save model
    import os
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    joblib.dump(model, save_path)
    print(f"Model saved to {save_path}")

    return model