"""
Get ranking endpoint — retrieves stored ranking results for a job.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.job import Job
from app.models.score import Score
from app.models.candidate import Candidate
from app.schemas.ranking_schema import RankingResponse, RankedCandidate, ScoreDetail, SkillGapDetail

router = APIRouter()


@router.get("/{job_id}", response_model=RankingResponse)
async def get_ranking(
    job_id: uuid.UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Get stored ranking results for a job.
    Returns candidates sorted by rank.
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

    # Fetch scores with candidates
    scores_result = await db.execute(
        select(Score)
        .where(Score.job_id == job_id)
        .order_by(Score.ranking_position.asc())
    )
    scores = scores_result.scalars().all()

    if not scores:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No ranking found for this job. Run /ranking/rank first.",
        )

    # Build ranked candidates list
    ranked_candidates = []
    for score in scores:
        candidate_result = await db.execute(
            select(Candidate).where(Candidate.id == score.candidate_id)
        )
        candidate = candidate_result.scalar_one_or_none()
        if not candidate:
            continue

        ranked_candidates.append(RankedCandidate(
            rank=score.ranking_position,
            candidate_id=candidate.id,
            full_name=candidate.full_name,
            email=candidate.email,
            resume_url=candidate.resume_url,
            scores=ScoreDetail(
                overall_score=score.overall_score,
                skill_match_score=score.skill_match_score,
                semantic_score=score.semantic_score,
                experience_score=score.experience_score,
                education_score=score.education_score,
                preferred_skills_score=score.preferred_skills_score,
            ),
            skill_gap=SkillGapDetail(**score.skill_gap),
        ))

    return RankingResponse(
        job_id=job.id,
        job_title=job.title,
        total_candidates=len(ranked_candidates),
        ranked_candidates=ranked_candidates,
        created_at=datetime.now(timezone.utc),
    )