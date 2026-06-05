"""
List jobs endpoint — returns paginated list of jobs for a recruiter.
"""

import uuid
from fastapi import APIRouter, Depends, Query
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.job import Job
from app.models.score import Score
from app.schemas.job_schema import JobListResponse, JobListItem

router = APIRouter()


@router.get("/", response_model=JobListResponse)
async def list_jobs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    List all jobs created by the current recruiter.
    Supports pagination via page and page_size query params.
    """

    # Authenticate
    payload = decode_access_token(credentials.credentials)
    recruiter_id = uuid.UUID(payload["sub"])

    # Count total
    count_result = await db.execute(
        select(func.count(Job.id)).where(Job.recruiter_id == recruiter_id)
    )
    total = count_result.scalar_one()

    # Fetch paginated jobs
    offset = (page - 1) * page_size
    result = await db.execute(
        select(Job)
        .where(Job.recruiter_id == recruiter_id)
        .order_by(Job.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    jobs = result.scalars().all()

    # Build list items
    items = []
    for j in jobs:
        count_result = await db.execute(
            select(func.count(Score.id)).where(Score.job_id == j.id)
        )
        candidate_count = count_result.scalar_one()
        items.append(JobListItem(
            id=j.id,
            title=j.title,
            company=j.company,
            required_skills=j.required_skills,
            min_experience_years=j.min_experience_years,
            is_active=j.is_active,
            candidate_count=candidate_count,
            created_at=j.created_at,
        ))

    total_pages = (total + page_size - 1) // page_size

    return JobListResponse(
        jobs=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )