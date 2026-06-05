"""
Get resume endpoint — retrieves a single candidate by ID.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.candidate import Candidate
from app.schemas.candidate_schema import CandidateResponse

router = APIRouter()


@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_resume(
    candidate_id: uuid.UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a single candidate profile by ID.
    Only the recruiter who uploaded it can view it.
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

    return candidate