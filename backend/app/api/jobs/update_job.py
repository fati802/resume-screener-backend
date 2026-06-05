"""
Update job endpoint — partially updates a job description.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.job import Job
from app.schemas.job_schema import JobUpdate, JobResponse

router = APIRouter()


@router.patch("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: uuid.UUID,
    request: JobUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Partially update a job description.
    Only the recruiter who created it can update it.
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

    # Apply updates
    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)

    await db.flush()

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
        candidate_count=0,
        created_at=job.created_at,
    )