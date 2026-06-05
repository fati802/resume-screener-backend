"""
Create job endpoint — creates a new job description.
"""

import uuid
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.job import Job
from app.schemas.job_schema import JobCreate, JobResponse

router = APIRouter()


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    request: JobCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new job description.
    The current recruiter is set as the owner.
    """

    # Authenticate
    payload = decode_access_token(credentials.credentials)
    recruiter_id = uuid.UUID(payload["sub"])

    # Create job
    job = Job(
        recruiter_id=recruiter_id,
        title=request.title,
        company=request.company or "",
        description=request.description,
        required_skills=request.required_skills,
        preferred_skills=request.preferred_skills,
        min_experience_years=request.min_experience_years,
    )
    db.add(job)
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