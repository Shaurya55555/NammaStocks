"""Clerk JWT verification using JWKS endpoint."""

import httpx
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from fastapi import HTTPException, status
from src.config import settings

# ---------------------------------------------------------------------------
# JWKS cache — fetched once per process, refreshed on key-miss
# ---------------------------------------------------------------------------
_jwks_cache: dict | None = None


async def _get_jwks() -> dict:
    """Fetch Clerk's JWKS (JSON Web Key Set), with in-memory caching."""
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    if not settings.CLERK_JWKS_URL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="CLERK_JWKS_URL is not configured on the server.",
        )

    async with httpx.AsyncClient() as client:
        resp = await client.get(settings.CLERK_JWKS_URL, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()

    return _jwks_cache


async def verify_clerk_token(token: str) -> dict:
    """
    Verify a Clerk-issued JWT.

    Returns the decoded payload dict on success.
    Raises HTTP 401 on any verification failure.
    """
    jwks = await _get_jwks()

    try:
        # python-jose selects the correct key from the JWKS set automatically
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            issuer=settings.CLERK_ISSUER or None,
            options={
                "verify_aud": False,  # Clerk tokens don't always set aud
            },
        )
        return payload

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as exc:
        # On a key-miss Clerk may have rotated keys — clear cache and retry once
        global _jwks_cache
        if _jwks_cache is not None:
            _jwks_cache = None
            try:
                jwks = await _get_jwks()
                payload = jwt.decode(
                    token,
                    jwks,
                    algorithms=["RS256"],
                    issuer=settings.CLERK_ISSUER or None,
                    options={"verify_aud": False},
                )
                return payload
            except JWTError:
                pass

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )
