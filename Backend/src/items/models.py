from sqlmodel import SQLModel, Field
from typing import Optional

class Item(SQLModel, table=True):
    """Item database model."""
    __tablename__ = "items"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
