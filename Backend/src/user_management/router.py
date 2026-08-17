"""User Management router."""

from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from src.database import get_session
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.user_management.schemas import UserProfileRead, UserProfileUpdate
from src.user_management import repository

router = APIRouter(prefix="/user-management", tags=["user_management"])


@router.get("/profile", response_model=UserProfileRead, summary="Get current user profile details")
async def get_profile(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> UserProfileRead:
    """
    Return the authenticated user's extended profile (first name, last name, watchlist).
    Creates a default profile if one does not exist yet.
    """
    profile = await repository.get_or_create_profile(session, current_user.id)
    return profile


@router.put("/profile", response_model=UserProfileRead, summary="Update current user profile")
async def update_profile(
    body: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> UserProfileRead:
    """
    Update the authenticated user's first name, last name, or watchlist.
    Fields not supplied in the request body are left unchanged.
    """
    profile = await repository.update_user_profile(
        session=session,
        user_id=current_user.id,
        first_name=body.first_name,
        last_name=body.last_name,
        watchlist=body.watchlist,
    )
    return profile
