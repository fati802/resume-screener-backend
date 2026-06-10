"""
Redis client module.
Provides async Redis connection and caching helpers.
Falls back gracefully if Redis is not configured.
"""

import json
from typing import Any, Optional

from app.core.config import get_settings

settings = get_settings()

_redis_client = None
_redis_available = bool(settings.REDIS_URL)


async def get_redis():
    """Get or create the Redis client singleton."""
    global _redis_client
    if not _redis_available:
        return None
    if _redis_client is None:
        import redis.asyncio as aioredis
        _redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_client


async def close_redis() -> None:
    """Close the Redis connection on shutdown."""
    global _redis_client
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None


async def get_cache(key: str) -> Optional[Any]:
    """Retrieve a cached value by key. Returns None if Redis unavailable."""
    client = await get_redis()
    if client is None:
        return None
    value = await client.get(key)
    if value is not None:
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value
    return None


async def set_cache(key: str, value: Any, ttl: Optional[int] = None) -> None:
    """Store a value in cache. Silently skips if Redis unavailable."""
    client = await get_redis()
    if client is None:
        return
    serialized = json.dumps(value, default=str)
    if ttl is None:
        ttl = settings.CACHE_TTL_SECONDS
    await client.set(key, serialized, ex=ttl)


async def invalidate_cache(pattern: str) -> int:
    """Delete all cache keys matching a pattern. Returns 0 if Redis unavailable."""
    client = await get_redis()
    if client is None:
        return 0
    keys = []
    async for key in client.scan_iter(match=pattern):
        keys.append(key)
    if keys:
        return await client.delete(*keys)
    return 0


async def invalidate_key(key: str) -> bool:
    """Delete a single cache key. Returns False if Redis unavailable."""
    client = await get_redis()
    if client is None:
        return False
    result = await client.delete(key)
    return result > 0