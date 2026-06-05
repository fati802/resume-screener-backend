"""
Score candidate — computes weighted scores for a candidate against a job.
"""

from typing import Dict, Any, Tuple, List
import numpy as np

from app.core.config import get_settings
from app.services.embedding.resume_embedder import embed_resume
from app.services.embedding.jd_embedder import embed_job_description, build_jd_text
from app.services.embedding.cosine_similarity import cosine_similarity, similarity_to_score

settings = get_settings()


async def score_candidate(candidate, job) -> Tuple[Dict[str, float], Dict[str, Any]]:
    """
    Compute all scores for a candidate against a job description.
    Returns (scores_dict, skill_gap_dict).
    """

    # --- Skill Match Score ---
    candidate_skills = set(s.lower() for s in (candidate.parsed_data.get("skills", []) or []))
    required_skills = set(s.lower() for s in (job.required_skills or []))
    preferred_skills = set(s.lower() for s in (job.preferred_skills or []))

    matched_required = candidate_skills & required_skills
    matched_preferred = candidate_skills & preferred_skills
    missing_required = required_skills - candidate_skills
    missing_preferred = preferred_skills - candidate_skills
    extra_skills = candidate_skills - required_skills - preferred_skills

    skill_match_score = (
        (len(matched_required) / len(required_skills) * 100)
        if required_skills else 100.0
    )

    preferred_skills_score = (
        (len(matched_preferred) / len(preferred_skills) * 100)
        if preferred_skills else 100.0
    )

    # --- Experience Score ---
    candidate_years = candidate.parsed_data.get("total_experience_years", 0.0) or 0.0
    required_years = job.min_experience_years or 0

    if required_years == 0:
        experience_score = 100.0
    elif candidate_years >= required_years:
        experience_score = 100.0
    else:
        experience_score = (candidate_years / required_years) * 100

    # --- Education Score ---
    education = candidate.parsed_data.get("education", []) or []
    education_score = 100.0 if education else 50.0

    # --- Semantic Score ---
    resume_text = candidate.raw_text or ""
    jd_text = build_jd_text(
        job.title,
        job.description,
        job.required_skills or [],
        job.preferred_skills or [],
    )

    resume_emb = candidate.embedding or embed_resume(resume_text)
    job_emb = job.embedding or embed_job_description(jd_text)

    semantic_similarity = cosine_similarity(resume_emb, job_emb)
    semantic_score = similarity_to_score(semantic_similarity)

    # --- Weighted Overall Score ---
    overall_score = (
        skill_match_score * settings.WEIGHT_SKILL_MATCH
        + semantic_score * settings.WEIGHT_SEMANTIC
        + experience_score * settings.WEIGHT_EXPERIENCE
        + education_score * settings.WEIGHT_EDUCATION
        + preferred_skills_score * settings.WEIGHT_PREFERRED_SKILLS
    )

    scores = {
        "overall_score": round(overall_score, 2),
        "skill_match_score": round(skill_match_score, 2),
        "semantic_score": round(semantic_score, 2),
        "experience_score": round(experience_score, 2),
        "education_score": round(education_score, 2),
        "preferred_skills_score": round(preferred_skills_score, 2),
    }

    skill_gap = {
        "missing_required": list(missing_required),
        "missing_preferred": list(missing_preferred),
        "matched_required": list(matched_required),
        "matched_preferred": list(matched_preferred),
        "extra_skills": list(extra_skills),
    }

    return scores, skill_gap