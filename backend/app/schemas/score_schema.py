"""
Score and ranking schemas — request/response models for ranking endpoints.
"""

from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class SkillGapDetail(BaseModel):
    """Detailed skill gap breakdown."""
    missing_required: List[str] = Field(default_factory=list)
    missing_preferred: List[str] = Field(default_factory=list)
    matched_required: List[str] = Field(default_factory=list)
    matched_preferred: List[str] = Field(default_factory=list)
    extra_skills: List[str] = Field(default_factory=list)


class ScoreResponse(BaseModel):
    """Full score response for a candidate-job pair."""
    id: UUID
    candidate_id: UUID
    job_id: UUID
    overall_score: float
    skill_match_score: float
    experience_score: float
    education_score: float
    semantic_score: float
    preferred_skills_score: float
    skill_gap: SkillGapDetail
    ranking_position: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class RankedCandidate(BaseModel):
    """A candidate with their score for a specific job."""
    rank: int
    candidate_id: UUID
    full_name: str
    email: str
    overall_score: float
    skill_match_score: float
    semantic_score: float
    experience_score: float
    missing_required_skills: List[str] = Field(default_factory=list)
    resume_url: str


class RankingResponse(BaseModel):
    """Full ranking response for a job."""
    job_id: UUID
    job_title: str
    total_candidates: int
    ranked_candidates: List[RankedCandidate]


class RankRequest(BaseModel):
    """Request to rank candidates against a job."""
    job_id: UUID
    candidate_ids: Optional[List[UUID]] = None