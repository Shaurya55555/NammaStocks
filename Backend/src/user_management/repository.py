"""User Management repository."""

from datetime import datetime
from typing import Optional, List

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.user_management.models import UserProfile


async def get_user_profile(
    session: AsyncSession,
    user_id: int,
) -> Optional[UserProfile]:
    """Return the UserProfile for a given user_id."""
    result = await session.exec(
        select(UserProfile).where(UserProfile.user_id == user_id)
    )
    return result.first()


async def get_or_create_profile(
    session: AsyncSession,
    user_id: int,
) -> UserProfile:
    """Get the profile for a user, or create a default one if it doesn't exist."""
    profile = await get_user_profile(session, user_id)
    
    if profile is None:
        profile = UserProfile(user_id=user_id, watchlist=[])
        session.add(profile)
        await session.commit()
        await session.refresh(profile)
        
    if profile.watchlist is None:
        profile.watchlist = []
        
    return profile


async def update_user_profile(
    session: AsyncSession,
    user_id: int,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    watchlist: Optional[List[str]] = None,
) -> UserProfile:
    """Update user profile fields."""
    profile = await get_or_create_profile(session, user_id)
    
    if first_name is not None:
        profile.first_name = first_name
    if last_name is not None:
        profile.last_name = last_name
    if watchlist is not None:
        # SQLModel JSON column update: assign a new list reference
        profile.watchlist = list(watchlist)
        
    profile.updated_at = datetime.utcnow()
    
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    
    return profile
