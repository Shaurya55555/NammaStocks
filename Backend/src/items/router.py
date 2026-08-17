from fastapi import APIRouter, Depends, status, Query
from src.items.schemas import ItemCreate, ItemUpdate, ItemRead
from src.items.service import ItemService
from src.items.dependencies import get_item_service
from typing import List

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
async def create_item(
    item: ItemCreate,
    service: ItemService = Depends(get_item_service)
) -> ItemRead:
    """Create a new item."""
    return await service.create_item(item)

@router.get("/", response_model=List[ItemRead])
async def read_items(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of items to return"),
    service: ItemService = Depends(get_item_service)
) -> List[ItemRead]:
    """Get all items with pagination."""
    return await service.get_items(skip=skip, limit=limit)

@router.get("/{item_id}", response_model=ItemRead)
async def read_item(
    item_id: int,
    service: ItemService = Depends(get_item_service)
) -> ItemRead:
    """Get item by ID."""
    return await service.get_item(item_id)

@router.patch("/{item_id}", response_model=ItemRead)
async def update_item(
    item_id: int,
    item_update: ItemUpdate,
    service: ItemService = Depends(get_item_service)
) -> ItemRead:
    """Update an existing item."""
    return await service.update_item(item_id, item_update)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: int,
    service: ItemService = Depends(get_item_service)
) -> None:
    """Delete an item."""
    await service.delete_item(item_id)
