from src.items.repository import ItemRepository
from src.items.models import Item
from src.items.schemas import ItemCreate, ItemUpdate
from src.items.exceptions import ItemNotFoundException
from typing import List, Optional

class ItemService:
    """Service layer for Item business logic."""
    
    def __init__(self, repo: ItemRepository):
        self.repo = repo

    async def get_item(self, item_id: int) -> Item:
        """Get item by ID or raise exception."""
        item = await self.repo.get(item_id)
        if not item:
            raise ItemNotFoundException(f"Item with id {item_id} not found")
        return item

    async def get_items(self, skip: int = 0, limit: int = 100) -> List[Item]:
        """Get all items with pagination."""
        return await self.repo.get_all(skip=skip, limit=limit)

    async def create_item(self, item_create: ItemCreate) -> Item:
        """Create a new item."""
        item = Item.model_validate(item_create)
        return await self.repo.create(item)

    async def update_item(self, item_id: int, item_update: ItemUpdate) -> Item:
        """Update an existing item."""
        item = await self.get_item(item_id)
        
        # Update only provided fields
        update_data = item_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)
        
        return await self.repo.update(item)

    async def delete_item(self, item_id: int) -> None:
        """Delete an item."""
        item = await self.get_item(item_id)
        await self.repo.delete(item)
