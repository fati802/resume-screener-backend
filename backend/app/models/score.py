"""
Score model — represents a candidate's ranking score against a job.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    overall_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="Weighted total score 0-100",
    )
    skill_match_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="Percentage of required skills matched 0-100",
    )
    experience_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="Experience relevance score 0-100",
    )
    education_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="Education match score 0-100",
    )
    semantic_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="Cosine similarity score 0-100",
    )
    preferred_skills_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="Preferred skills match score 0-100",
    )
    skill_gap: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
        comment="Detailed skill gap analysis: missing_required, missing_preferred, extra",
    )
    ranking_position: Mapped[int] = mapped_column(
        Integer,
        nullable=True,
        default=None,
        comment="Rank among candidates for this job (1 = best)",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    candidate = relationship("Candidate", back_populates="scores")
    job = relationship("Job", back_populates="scores")

    def __repr__(self) -> str:
        return f"<Score candidate={self.candidate_id} job={self.job_id} score={self.overall_score}>"
