"""
List resumes endpoint — returns paginated list of candidates for a recruiter.
"""

import uuid
from fastapi import APIRouter, Depends, Query, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.candidate import Candidate
from app.schemas.candidate_schema import CandidateListResponse, CandidateListItem

router = APIRouter()


@router.get("/", response_model=CandidateListResponse)
async def list_resumes(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    List all candidates uploaded by the current recruiter.
    Supports pagination via page and page_size query params.
    """

    # Authenticate
    payload = decode_access_token(credentials.credentials)
    recruiter_id = uuid.UUID(payload["sub"])

    # Count total
    count_result = await db.execute(
        select(func.count(Candidate.id)).where(
            Candidate.recruiter_id == recruiter_id
        )
    )
    total = count_result.scalar_one()

    # Fetch paginated candidates
    offset = (page - 1) * page_size
    result = await db.execute(
        select(Candidate)
        .where(Candidate.recruiter_id == recruiter_id)
        .order_by(Candidate.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    candidates = result.scalars().all()

    # Build list items
    items = []
    for c in candidates:
        skills = c.parsed_data.get("skills", []) if c.parsed_data else []
        exp = c.parsed_data.get("total_experience_years", 0.0) if c.parsed_data else 0.0
        items.append(CandidateListItem(
            id=c.id,
            full_name=c.full_name,
            email=c.email,
            original_filename=c.original_filename,
            skills=skills,
            total_experience_years=exp,
            created_at=c.created_at,
        ))

    total_pages = (total + page_size - 1) // page_size

    return CandidateListResponse(
        candidates=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )