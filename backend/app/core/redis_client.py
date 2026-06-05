"""
Redis client module.
Provides async Redis connection and caching helpers.
"""

import json
from typing import Any, Optional

import redis.asyncio as aioredis

from app.core.config import get_settings

settings = get_settings()

# --- Redis Client Singleton ---
_redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    """Get or create the Redis client singleton."""
    global _redis_client
    if _redis_client is None:
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


# --- Cache Helpers ---
async def get_cache(key: str) -> Optional[Any]:
    """
    Retrieve a cached value by key.
    Returns deserialized JSON or None if not found.
    """
    client = await get_redis()
    value = await client.get(key)
    if value is not None:
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value
    return None


async def set_cache(
    key: str,
    value: Any,
    ttl: Optional[int] = None,
) -> None:
    """
    Store a value in cache with optional TTL.
    Values are serialized as JSON.
    """
    client = await get_redis()
    serialized = json.dumps(value, default=str)
    if ttl is None:
        ttl = settings.CACHE_TTL_SECONDS
    await client.set(key, serialized, ex=ttl)


async def invalidate_cache(pattern: str) -> int:
    """
    Delete all cache keys matching a pattern.
    Returns the number of keys deleted.
    """
    client = await get_redis()
    keys = []
    async for key in client.scan_iter(match=pattern):
        keys.append(key)
    if keys:
        return await client.delete(*keys)
    return 0


async def invalidate_key(key: str) -> bool:
    """Delete a single cache key. Returns True if key existed."""
    client = await get_redis()
    result = await client.delete(key)
    return result > 0
