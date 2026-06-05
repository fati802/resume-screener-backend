"""
Get skill gap endpoint — returns skill gap analysis for a candidate-job pair.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.job import Job
from app.models.score import Score
from app.models.candidate import Candidate
from app.schemas.ranking_schema import SkillGapResponse, SkillGapDetail

router = APIRouter()


@router.get("/skill-gap/{job_id}/{candidate_id}", response_model=SkillGapResponse)
async def get_skill_gap(
    job_id: uuid.UUID,
    candidate_id: uuid.UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Get detailed skill gap analysis for a specific candidate-job pair.
    """

    # Authenticate
    payload = decode_access_token(credentials.credentials)
    recruiter_id = uuid.UUID(payload["sub"])

    # Fetch job
    job_result = await db.execute(
        select(Job).where(
            Job.id == job_id,
            Job.recruiter_id == recruiter_id,
        )
    )
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found.",
        )

    # Fetch candidate
    candidate_result = await db.execute(
        select(Candidate).where(
            Candidate.id == candidate_id,
            Candidate.recruiter_id == recruiter_id,
        )
    )
    candidate = candidate_result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found.",
        )

    # Fetch score
    score_result = await db.execute(
        select(Score).where(
            Score.job_id == job_id,
            Score.candidate_id == candidate_id,
        )
    )
    score = score_result.scalar_one_or_none()
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No score found. Run /ranking/rank first.",
        )

    # Build recommendation
    if score.overall_score >= 80:
        recommendation = "Strong match — recommend for interview."
    elif score.overall_score >= 60:
        recommendation = "Good match — consider for interview."
    elif score.overall_score >= 40:
        recommendation = "Partial match — may need upskilling."
    else:
        recommendation = "Weak match — significant skill gaps found."

    return SkillGapResponse(
        candidate_id=candidate.id,
        candidate_name=candidate.full_name,
        job_id=job.id,
        job_title=job.title,
        skill_gap=SkillGapDetail(**score.skill_gap),
        overall_score=score.overall_score,
        recommendation=recommendation,
    )