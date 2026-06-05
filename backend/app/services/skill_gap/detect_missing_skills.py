"""
Detect missing skills — compares candidate skills against job requirements.
"""

from typing import List, Dict


def detect_missing_skills(
    candidate_skills: List[str],
    required_skills: List[str],
    preferred_skills: List[str],
) -> Dict[str, List[str]]:
    """
    Compare candidate skills against job requirements.
    Returns detailed breakdown of matched and missing skills.
    """
    candidate_set = set(s.lower() for s in candidate_skills)
    required_set = set(s.lower() for s in required_skills)
    preferred_set = set(s.lower() for s in preferred_skills)

    return {
        "matched_required": sorted(candidate_set & required_set),
        "missing_required": sorted(required_set - candidate_set),
        "matched_preferred": sorted(candidate_set & preferred_set),
        "missing_preferred": sorted(preferred_set - candidate_set),
        "extra_skills": sorted(candidate_set - required_set - preferred_set),
    }