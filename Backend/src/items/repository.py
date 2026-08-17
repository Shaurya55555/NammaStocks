from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.items.models import Item
from typing import List, Optional

class ItemRepository:
    """Repository for Item database operations."""
    
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, item_id: int) -> Optional[Item]:
        """Get item by ID."""
        result = await self.session.exec(select(Item).where(Item.id == item_id))
        return result.first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Item]:
        """Get all items with pagination."""
        result = await self.session.exec(select(Item).offset(skip).limit(limit))
        return result.all()

    async def create(self, item: Item) -> Item:
        """Create a new item."""
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def update(self, item: Item) -> Item:
        """Update an existing item."""
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def delete(self, item: Item) -> None:
        """Delete an item."""
        await self.session.delete(item)
        await self.session.commit()
