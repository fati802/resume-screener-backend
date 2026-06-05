"""
Logout endpoint — invalidates the current JWT token using Redis blacklist.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.core.redis_client import set_cache, get_cache

router = APIRouter()
security_scheme = HTTPBearer()


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Logout the current user.
    Blacklists the JWT token in Redis so it can't be reused.
    """

    token = credentials.credentials

    # Decode token to get expiry
    payload = decode_access_token(token)

    # Check if already blacklisted
    blacklisted = await get_cache(f"blacklist:{token}")
    if blacklisted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is already invalidated.",
        )

    # Blacklist the token until it expires
    from datetime import datetime, timezone
    exp = payload.get("exp")
    now = int(datetime.now(timezone.utc).timestamp())
    ttl = max(exp - now, 1) if exp else 3600

    await set_cache(f"blacklist:{token}", "true", ttl=ttl)

    return {"message": "Successfully logged out."}
