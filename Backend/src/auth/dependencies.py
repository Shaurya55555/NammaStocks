"""
get_current_user FastAPI dependency.

Usage in any protected route:
    from src.auth.dependencies import get_current_user
    from src.auth.models import User

    @router.get("/protected")
    async def protected(user: User = Depends(get_current_user)):
        return {"hello": user.email}
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession

from src.database import get_session
from src.auth.clerk import verify_clerk_token
from src.auth.models import User
from src.auth import repository

# HTTPBearer extracts the token from "Authorization: Bearer <token>"
_bearer = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    session: AsyncSession = Depends(get_session),
) -> User:
    """
    Verify the Clerk JWT, upsert the user into Postgres, and return
    the fully hydrated User ORM object.

    Raises HTTP 401 if the token is missing, expired, or invalid.
    Raises HTTP 403 if the account is deactivated.
    """
    token = credentials.credentials
    payload = await verify_clerk_token(token)
    print("payload", payload)

    # Extract identity claims from Clerk token
    clerk_user_id: str = payload.get("sub", "")
    email: str = (
        payload.get("email")
        or payload.get("email_address")
        or (f"{clerk_user_id}@noemail.local" if clerk_user_id else "")
    )
    # Clerk puts name in `name` or constructs it from first/last
    name: str = (
        payload.get("name")
        or f"{payload.get('first_name', '')} {payload.get('last_name', '')}".strip()
        or email.split("@")[0]
    )
    avatar_url: str | None = payload.get("image_url") or payload.get("profile_image_url")
    first_name: str = payload.get("first_name", "")
    last_name: str = payload.get("last_name", "")

    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing the 'sub' claim.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Upsert the user — creates on first login, syncs data on subsequent
    user = await repository.upsert_user(
        session=session,
        clerk_user_id=clerk_user_id,
        email=email,
        name=name,
        first_name=first_name,
        last_name=last_name,
        avatar_url=avatar_url,
    )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    return user
