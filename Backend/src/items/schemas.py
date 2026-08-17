from pydantic import BaseModel, Field
from typing import Optional

class ItemBase(BaseModel):
    """Base schema for Item."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class ItemCreate(ItemBase):
    """Schema for creating an item."""
    pass

class ItemUpdate(BaseModel):
    """Schema for updating an item."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class ItemRead(ItemBase):
    """Schema for reading an item."""
    id: int

    class Config:
        from_attributes = True
