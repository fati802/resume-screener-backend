"""
Ranking schemas — request/response models for ranking and skill gap endpoints.
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


class RankRequest(BaseModel):
    """Request to trigger ranking for a job."""
    job_id: UUID
    candidate_ids: Optional[List[UUID]] = None


class ScoreDetail(BaseModel):
    """Individual score breakdown for a candidate."""
    overall_score: float = Field(ge=0.0, le=100.0)
    skill_match_score: float = Field(ge=0.0, le=100.0)
    semantic_score: float = Field(ge=0.0, le=100.0)
    experience_score: float = Field(ge=0.0, le=100.0)
    education_score: float = Field(ge=0.0, le=100.0)
    preferred_skills_score: float = Field(ge=0.0, le=100.0)


class RankedCandidate(BaseModel):
    """A single ranked candidate with scores."""
    rank: int
    candidate_id: UUID
    full_name: str
    email: str
    resume_url: str
    scores: ScoreDetail
    skill_gap: SkillGapDetail


class RankingResponse(BaseModel):
    """Full ranking result for a job."""
    job_id: UUID
    job_title: str
    total_candidates: int
    ranked_candidates: List[RankedCandidate]
    created_at: datetime


class SkillGapResponse(BaseModel):
    """Skill gap response for a single candidate-job pair."""
    candidate_id: UUID
    candidate_name: str
    job_id: UUID
    job_title: str
    skill_gap: SkillGapDetail
    overall_score: float
    recommendation: str