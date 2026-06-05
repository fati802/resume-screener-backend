"""
Rank candidates endpoint — scores and ranks all candidates for a job.
"""

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import decode_access_token, security_scheme
from app.models.job import Job
from app.models.candidate import Candidate
from app.models.score import Score
from app.schemas.ranking_schema import RankRequest, RankingResponse, RankedCandidate, ScoreDetail, SkillGapDetail

router = APIRouter()


@router.post("/rank", response_model=RankingResponse)
async def rank_candidates(
    request: RankRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Score and rank all candidates against a job description.
    Stores results in the scores table.
    """

    # Authenticate
    payload = decode_access_token(credentials.credentials)
    recruiter_id = uuid.UUID(payload["sub"])

    # Fetch job
    job_result = await db.execute(
        select(Job).where(
            Job.id == request.job_id,
            Job.recruiter_id == recruiter_id,
        )
    )
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found.",
        )

    # Fetch candidates
    query = select(Candidate).where(Candidate.recruiter_id == recruiter_id)
    if request.candidate_ids:
        query = query.where(Candidate.id.in_(request.candidate_ids))
    candidates_result = await db.execute(query)
    candidates = candidates_result.scalars().all()

    if not candidates:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No candidates found.",
        )

    # Import scoring service
    from app.services.ranking.score_candidate import score_candidate

    # Score each candidate
    scored = []
    for candidate in candidates:
        scores, skill_gap = await score_candidate(candidate, job)
        scored.append((candidate, scores, skill_gap))

    # Sort by overall score descending
    scored.sort(key=lambda x: x[1]["overall_score"], reverse=True)

    # Save scores to database
    ranked_candidates = []
    for rank, (candidate, scores, skill_gap) in enumerate(scored, start=1):
        score_record = Score(
            candidate_id=candidate.id,
            job_id=job.id,
            overall_score=scores["overall_score"],
            skill_match_score=scores["skill_match_score"],
            experience_score=scores["experience_score"],
            education_score=scores["education_score"],
            semantic_score=scores["semantic_score"],
            preferred_skills_score=scores["preferred_skills_score"],
            skill_gap=skill_gap,
            ranking_position=rank,
        )
        db.add(score_record)

        ranked_candidates.append(RankedCandidate(
            rank=rank,
            candidate_id=candidate.id,
            full_name=candidate.full_name,
            email=candidate.email,
            resume_url=candidate.resume_url,
            scores=ScoreDetail(**scores),
            skill_gap=SkillGapDetail(**skill_gap),
        ))

    await db.flush()

    return RankingResponse(
        job_id=job.id,
        job_title=job.title,
        total_candidates=len(ranked_candidates),
        ranked_candidates=ranked_candidates,
        created_at=datetime.now(timezone.utc),
    )