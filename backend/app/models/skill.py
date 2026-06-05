"""
Skill model — represents a skill in the taxonomy.
"""

import uuid

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="general",
        comment="Category: programming, framework, database, tool, cloud, soft_skill",
    )
    aliases: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list,
        comment='Alternative names, e.g. ["js", "javascript", "JS"]',
    )

    def __repr__(self) -> str:
        return f"<Skill {self.name} ({self.category})>"
