"""User Management Pydantic schemas."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserProfileRead(BaseModel):
    """Public user profile returned by the API."""
    id: int
    user_id: int
    first_name: str
    last_name: str
    watchlist: List[str] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserProfileUpdate(BaseModel):
    """Fields the user is allowed to update."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    watchlist: Optional[List[str]] = None
