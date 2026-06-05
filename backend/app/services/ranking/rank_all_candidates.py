"""
Rank all candidates — scores and sorts all candidates for a job.
"""

from typing import List, Tuple, Any
from app.services.ranking.score_candidate import score_candidate


async def rank_all_candidates(candidates: List[Any], job: Any) -> List[Tuple]:
    """
    Score all candidates against a job and return sorted ranking.
    Returns list of (candidate, scores, skill_gap) tuples sorted by overall_score.
    """
    scored = []

    for candidate in candidates:
        scores, skill_gap = await score_candidate(candidate, job)
        scored.append((candidate, scores, skill_gap))

    # Sort by overall score descending
    scored.sort(key=lambda x: x[1]["overall_score"], reverse=True)

    return scored