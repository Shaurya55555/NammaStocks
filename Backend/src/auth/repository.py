"""Auth repository — async DB operations for the User model."""

from datetime import datetime
from typing import Optional

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.auth.models import User
from src.user_management.repository import update_user_profile


async def get_user_by_clerk_id(
    session: AsyncSession,
    clerk_user_id: str,
) -> Optional[User]:
    """Return the User row matching the given Clerk user ID, or None."""
    result = await session.exec(
        select(User).where(User.clerk_user_id == clerk_user_id)
    )
    return result.first()


async def upsert_user(
    session: AsyncSession,
    clerk_user_id: str,
    email: str,
    name: str,
    first_name: str,
    last_name: str,
    avatar_url: Optional[str] = None,
) -> User:
    """
    Create or update the local User record for a given Clerk identity.
    Called on every authenticated request to keep data in sync.
    """
    user = await get_user_by_clerk_id(session, clerk_user_id)

    if user is None:
        user = User(
            clerk_user_id=clerk_user_id,
            email=email,
            name=name,
            avatar_url=avatar_url,
        )
        session.add(user)
    else:
        # Sync latest identity data from Clerk token
        user.email = email
        user.name = name
        user.avatar_url = avatar_url
        user.updated_at = datetime.utcnow()
        session.add(user)

    await session.commit()
    await session.refresh(user)

    await update_user_profile(
        session=session,
        user_id=user.id,
        first_name=first_name,
        last_name=last_name,
    )

    return user


async def update_user(
    session: AsyncSession,
    user: User,
    name: Optional[str] = None,
    avatar_url: Optional[str] = None,
) -> User:
    """Apply user-supplied profile updates."""
    if name is not None:
        user.name = name
    if avatar_url is not None:
        user.avatar_url = avatar_url
    user.updated_at = datetime.utcnow()
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def deactivate_user(session: AsyncSession, user: User) -> User:
    """Soft-deactivate a user account (sets is_active=False)."""
    user.is_active = False
    user.updated_at = datetime.utcnow()
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
