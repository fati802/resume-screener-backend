"""
Candidate schemas — request/response models for resume/candidate endpoints.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ParsedResumeData(BaseModel):
    """Structured data extracted from a resume."""
    name: str = ""
    email: str = ""
    phone: str = ""
    skills: List[str] = Field(default_factory=list)
    education: List[Dict[str, Any]] = Field(default_factory=list)
    experience: List[Dict[str, Any]] = Field(default_factory=list)
    total_experience_years: float = 0.0


class CandidateResponse(BaseModel):
    """Full candidate response with parsed data."""
    id: UUID
    recruiter_id: UUID
    full_name: str
    email: str
    phone: Optional[str] = ""
    resume_url: str
    original_filename: str
    parsed_data: ParsedResumeData
    created_at: datetime

    model_config = {"from_attributes": True}


class CandidateListItem(BaseModel):
    """Lightweight candidate item for list views."""
    id: UUID
    full_name: str
    email: str
    original_filename: str
    skills: List[str] = Field(default_factory=list)
    total_experience_years: float = 0.0
    created_at: datetime

    model_config = {"from_attributes": True}


class CandidateListResponse(BaseModel):
    """Paginated list of candidates."""
    candidates: List[CandidateListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
