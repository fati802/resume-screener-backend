"""
Register endpoint — creates a new recruiter account.
"""

import traceback
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import hash_password, create_access_token
from app.models.recruiter import Recruiter
from app.schemas.auth_schema import RegisterRequest, TokenResponse, UserResponse

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        # Check if email already exists
        result = await db.execute(
            select(Recruiter).where(Recruiter.email == request.email)
        )
        existing = result.scalar_one_or_none()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered.",
            )

        # Create new recruiter
        recruiter = Recruiter(
            email=request.email,
            hashed_password=hash_password(request.password),
            full_name=request.full_name,
            company=request.company or "",
        )
        db.add(recruiter)
        await db.flush()

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
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))