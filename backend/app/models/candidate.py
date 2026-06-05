"""
Candidate model — represents a parsed resume / candidate profile.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

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
    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="Unknown",
    )
    email: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
        default="",
    )
    phone: Mapped[str] = mapped_column(
        String(50),
        nullable=True,
        default="",
    )
    resume_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="File path or S3 URL of the original resume",
    )
    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="resume.pdf",
    )
    raw_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
        comment="Full extracted text from resume",
    )
    parsed_data: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
        comment="Structured extraction: skills, education, experience, etc.",
    )
    embedding: Mapped[list] = mapped_column(
        JSON,
        nullable=True,
        default=None,
        comment="384-dim float vector from sentence-transformers",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    recruiter = relationship("Recruiter", back_populates="candidates")
    scores = relationship("Score", back_populates="candidate", lazy="selectin", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Candidate {self.full_name} ({self.email})>"
