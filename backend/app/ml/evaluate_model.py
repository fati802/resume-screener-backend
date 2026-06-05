"""
Evaluate model — evaluates classifier and ranker performance.
"""

import numpy as np
from typing import List, Dict
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
)


def evaluate_classifier(
    y_true: List[int],
    y_pred: List[int],
) -> Dict[str, float]:
    """
    Evaluate binary classifier performance.
    Returns accuracy, precision, recall, and F1 score.
    """
    return {
        "accuracy": round(accuracy_score(y_true, y_pred), 4),
        "precision": round(precision_score(y_true, y_pred, zero_division=0), 4),
        "recall": round(recall_score(y_true, y_pred, zero_division=0), 4),
        "f1_score": round(f1_score(y_true, y_pred, zero_division=0), 4),
    }


def evaluate_ranking(
    predicted_ranks: List[int],
    true_ranks: List[int],
) -> Dict[str, float]:
    """
    Evaluate ranking model using Spearman correlation.
    """
    from scipy.stats import spearmanr
    correlation, pvalue = spearmanr(predicted_ranks, true_ranks)
    return {
        "spearman_correlation": round(float(correlation), 4),
        "p_value": round(float(pvalue), 4),
    }