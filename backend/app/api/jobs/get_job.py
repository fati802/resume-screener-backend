"""
Get job endpoint — retrieves a single job description by ID.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.job import Job
from app.models.score import Score
from app.schemas.job_schema import JobResponse

router = APIRouter()


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: uuid.UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a single job description by ID.
    Only the recruiter who created it can view it.
    """

    # Authenticate
    payload = decode_access_token(credentials.credentials)
    recruiter_id = uuid.UUID(payload["sub"])

    # Fetch job
    result = await db.execute(
        select(Job).where(
            Job.id == job_id,
            Job.recruiter_id == recruiter_id,
        )
    )
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found.",
        )

    # Count candidates ranked for this job
    count_result = await db.execute(
        select(func.count(Score.id)).where(Score.job_id == job_id)
    )
    candidate_count = count_result.scalar_one()

    return JobResponse(
        id=job.id,
        recruiter_id=job.recruiter_id,
        title=job.title,
        company=job.company,
        description=job.description,
        required_skills=job.required_skills,
        preferred_skills=job.preferred_skills,
        min_experience_years=job.min_experience_years,
        is_active=job.is_active,
        candidate_count=candidate_count,
        created_at=job.created_at,
    )