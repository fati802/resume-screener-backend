"""
Job model — represents a job description / posting.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    recruiter_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("recruiters.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    company: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
        default="",
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Full job description text",
    )
    required_skills: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list,
        comment="List of required skill strings",
    )
    preferred_skills: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list,
        comment="List of preferred/nice-to-have skill strings",
    )
    min_experience_years: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    embedding: Mapped[list] = mapped_column(
        JSON,
        nullable=True,
        default=None,
        comment="384-dim float vector from sentence-transformers",
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    recruiter = relationship("Recruiter", back_populates="jobs")
    scores = relationship("Score", back_populates="job", lazy="selectin", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Job {self.title} @ {self.company}>"
