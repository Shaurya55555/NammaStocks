"""Auth API router — user profile endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from src.database import get_session
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.auth.schemas import UserRead, UserUpdate
from src.auth import repository

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=UserRead, summary="Get current user profile")
async def get_me(
    current_user: User = Depends(get_current_user),
) -> UserRead:
    """
    Return the authenticated user's profile as stored in Postgres.
    The record is always up-to-date because it's upserted on every request.
    """
    return current_user


@router.patch("/me", response_model=UserRead, summary="Update current user profile")
async def update_me(
    body: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> UserRead:
    """
    Update the authenticated user's display name and/or avatar URL.
    Fields not supplied in the request body are left unchanged.
    """
    updated = await repository.update_user(
        session=session,
        user=current_user,
        name=body.name,
        avatar_url=body.avatar_url,
    )
    return updated


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deactivate current user account",
)
async def delete_me(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> None:
    """
    Soft-deactivate the authenticated user's account (sets is_active=False).
    The Clerk identity is not affected — the user can still sign in to Clerk,
    but API access will be blocked with HTTP 403 until reactivated.
    """
    await repository.deactivate_user(session=session, user=current_user)
