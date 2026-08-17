"""Auth Pydantic schemas — request/response models for user endpoints."""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserRead(BaseModel):
    """Public user profile returned by the API."""

    id: int
    clerk_user_id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    """Fields the user is allowed to update."""

    name: Optional[str] = None
    avatar_url: Optional[str] = None
