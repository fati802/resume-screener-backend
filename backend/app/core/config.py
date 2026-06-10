"""
Core configuration module.
Loads settings from environment variables using pydantic-settings.
"""

from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import List, Any
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from .env file."""

    # --- App ---
    APP_NAME: str = "AI Resume Screener"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # --- Server ---
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # --- Database ---
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres.nkuipwenddmkchhxeqpj:DBqMSzO47zKEFQY7@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres",
        description="Async PostgreSQL connection string",
    )

    # --- Redis ---
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection string",
    )
    CACHE_TTL_SECONDS: int = 3600  # 1 hour

    # --- JWT Auth ---
    JWT_SECRET_KEY: str = Field(
        default="change-me-in-production-use-a-long-random-string",
        description="Secret key for JWT signing",
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # --- CORS ---
    CORS_ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://resume-screener-frontend-brown.vercel.app",
    "https://resume-screener-frontend-git-main-fati802s-projects.vercel.app",
    "https://resume-screener-frontend-6hnlupj7u-fati802s-projects.vercel.app",
]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if v.startswith("["):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # --- File Storage ---
    STORAGE_BACKEND: str = Field(
        default="local",
        description="Storage backend: 'local' or 's3'",
    )
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10

    # --- AWS S3 (optional) ---
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: str = "resume-screener-uploads"

    # --- AI / Gemini ---
    GEMINI_API_KEY: str = Field(
        default="",
        description="Google Gemini API key for AI features",
    )
    GEMINI_MODEL: str = "gemini-2.0-flash"

    # --- NLP / Embedding ---
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    SPACY_MODEL: str = "en_core_web_sm"

    # --- Ranking Weights (defaults) ---
    WEIGHT_SKILL_MATCH: float = 0.35
    WEIGHT_SEMANTIC: float = 0.25
    WEIGHT_EXPERIENCE: float = 0.20
    WEIGHT_EDUCATION: float = 0.10
    WEIGHT_PREFERRED_SKILLS: float = 0.10

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }


@lru_cache()
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
