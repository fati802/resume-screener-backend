"""
Delete job endpoint — removes a job description and its scores.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.job import Job
from app.models.score import Score

router = APIRouter()


@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
async def delete_job(
    job_id: uuid.UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a job description and all its associated scores.
    Only the recruiter who created it can delete it.
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

    # Delete associated scores first
    await db.execute(delete(Score).where(Score.job_id == job_id))

    # Delete job
    await db.delete(job)

    return {"message": "Job and all associated scores deleted successfully."}