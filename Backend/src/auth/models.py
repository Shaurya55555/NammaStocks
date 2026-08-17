"""Auth database models — User table synced from Clerk identities."""

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class User(SQLModel, table=True):
    """
    Local mirror of a Clerk user identity.
    Created/updated on every authenticated request via upsert.
    """

    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)

    # Clerk's user ID (the `sub` claim in the JWT)
    clerk_user_id: str = Field(unique=True, index=True, max_length=255)

    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(default="", max_length=255)
    avatar_url: Optional[str] = Field(default=None, max_length=1024)

    # Soft-delete / admin disable
    is_active: bool = Field(default=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
