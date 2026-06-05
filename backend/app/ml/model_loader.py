"""
Model loader — loads trained ML models from disk.
"""

import os
import joblib
from typing import Optional


CLASSIFIER_PATH = "app/ml/models/classifier.joblib"
RANKER_PATH = "app/ml/models/ranker.joblib"

_classifier = None
_ranker = None


def load_classifier():
    """Load the trained classifier model."""
    global _classifier
    if _classifier is None and os.path.exists(CLASSIFIER_PATH):
        _classifier = joblib.load(CLASSIFIER_PATH)
    return _classifier


def load_ranker():
    """Load the trained ranker model."""
    global _ranker
    if _ranker is None and os.path.exists(RANKER_PATH):
        _ranker = joblib.load(RANKER_PATH)
    return _ranker


def models_available() -> bool:
    """Check if trained models exist on disk."""
    return (
        os.path.exists(CLASSIFIER_PATH) and
        os.path.exists(RANKER_PATH)
    )