from pydantic import BaseModel
from typing import Optional

class NewsItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    publisher: Optional[str] = None
    link: str
    published_at: Optional[str] = None
    thumbnail_url: Optional[str] = None
