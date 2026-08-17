from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from src.database import get_session
from src.items.repository import ItemRepository
from src.items.service import ItemService

async def get_item_service(
    session: AsyncSession = Depends(get_session)
) -> ItemService:
    """Dependency to get ItemService instance."""
    repository = ItemRepository(session)
    return ItemService(repository)
