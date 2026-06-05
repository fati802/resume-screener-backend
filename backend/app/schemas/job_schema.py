"""
Job schemas — request/response models for job description endpoints.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    """Schema for creating a new job description."""
    title: str = Field(min_length=1, max_length=255)
    company: Optional[str] = Field(default="", max_length=255)
    description: str = Field(min_length=10)
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    min_experience_years: int = Field(default=0, ge=0)


class JobUpdate(BaseModel):
    """Schema for partially updating a job description."""
    title: Optional[str] = Field(default=None, max_length=255)
    company: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    min_experience_years: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None


class JobResponse(BaseModel):
    """Full job response."""
    id: UUID
    recruiter_id: UUID
    title: str
    company: str
    description: str
    required_skills: List[str]
    preferred_skills: List[str]
    min_experience_years: int
    is_active: bool
    candidate_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class JobListItem(BaseModel):
    """Lightweight job item for list views."""
    id: UUID
    title: str
    company: str
    required_skills: List[str]
    min_experience_years: int
    is_active: bool
    candidate_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class JobListResponse(BaseModel):
    """Paginated list of jobs."""
    jobs: List[JobListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
