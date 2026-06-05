"""
Auth schemas — request/response models for authentication endpoints.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)
    company: Optional[str] = Field(default="", max_length=255)


class LoginRequest(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    """Schema for user profile data."""
    id: UUID
    email: str
    full_name: str
    company: Optional[str] = ""
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}


# Rebuild to resolve forward reference
TokenResponse.model_rebuild()
