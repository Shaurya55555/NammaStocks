"""User Management database models."""

from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, JSON

class UserProfile(SQLModel, table=True):
    """
    Profile for a user containing extended information like first name, last name, and watchlist.
    """
    __tablename__ = "user_profiles"

    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Link to the User model (clerk identity)
    user_id: int = Field(foreign_key="users.id", unique=True, index=True)

    first_name: str = Field(default="", max_length=255)
    last_name: str = Field(default="", max_length=255)
    
    # Watchlist stored as a JSON array of strings
    watchlist: List[str] = Field(default=[], sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
