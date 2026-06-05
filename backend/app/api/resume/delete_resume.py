"""
Delete resume endpoint — removes a candidate and their resume file.
"""

import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.candidate import Candidate

router = APIRouter()


@router.delete("/{candidate_id}", status_code=status.HTTP_200_OK)
async def delete_resume(
    candidate_id: uuid.UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a candidate and their resume file.
    Only the recruiter who uploaded it can delete it.
    """

    # Authenticate
    payload = decode_access_token(credentials.credentials)
    recruiter_id = uuid.UUID(payload["sub"])

    # Fetch candidate
    result = await db.execute(
        select(Candidate).where(
            Candidate.id == candidate_id,
            Candidate.recruiter_id == recruiter_id,
        )
    )
    candidate = result.scalar_one_or_none()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found.",
        )

    # Delete file from disk if it exists
    if candidate.resume_url and os.path.exists(candidate.resume_url):
        try:
            os.remove(candidate.resume_url)
        except OSError:
            pass

    # Delete from database
    await db.delete(candidate)

    return {"message": "Candidate and resume deleted successfully."}