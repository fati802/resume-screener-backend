"""
Login endpoint — authenticates a recruiter and returns a JWT token.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.recruiter import Recruiter
from app.schemas.auth_schema import LoginRequest, TokenResponse, UserResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Login with email and password.
    Returns a JWT access token on success.
    """

    # Find recruiter by email
    result = await db.execute(
        select(Recruiter).where(Recruiter.email == request.email)
    )
    recruiter = result.scalar_one_or_none()

    # Check email and password
    if not recruiter or not verify_password(request.password, recruiter.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if account is active
    if not recruiter.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    # Generate token
    token = create_access_token(subject=str(recruiter.id))

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=recruiter.id,
            email=recruiter.email,
            full_name=recruiter.full_name,
            company=recruiter.company,
            is_active=recruiter.is_active,
            created_at=recruiter.created_at,
        ),
    )
