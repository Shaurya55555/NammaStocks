"""External data API router."""

from fastapi import APIRouter, Depends, status, Query
from src.external.schemas import (
    ExternalAPIDataCreate,
    ExternalAPIDataUpdate,
    ExternalAPIDataRead,
    ExternalAPILogCreate,
    ExternalAPILogRead,
    ExternalDataStats
)
from src.external.service import ExternalDataService
from src.external.dependencies import get_external_service
from typing import Optional
import finnhub
import os


router = APIRouter(prefix="/external", tags=["external"])


@router.get("/news-sentiment-finnhub")
async def get_news_finnhub(
    ticker: str = Query(..., description="Stock ticker symbol (e.g., AAPL)")
):
    """Get news sentiment from Finnhub API."""
    finnhub_client = finnhub.Client(api_key=os.getenv("FINNHUB_API_KEY", ""))
    return finnhub_client.news_sentiment(ticker)


@router.post(
    "/data",
    response_model=ExternalAPIDataRead,
    status_code=status.HTTP_201_CREATED
)
async def create_external_data(
    data: ExternalAPIDataCreate,
    service: ExternalDataService = Depends(get_external_service)
) -> ExternalAPIDataRead:
    """Create a new external API data record."""
    result = await service.create_data(data)
    return ExternalAPIDataRead.model_validate(result)


@router.get("/data/{data_id}", response_model=ExternalAPIDataRead)
async def get_external_data(
    data_id: int,
    service: ExternalDataService = Depends(get_external_service)
) -> ExternalAPIDataRead:
    """Get external API data by ID."""
    result = await service.get_data(data_id)
    return ExternalAPIDataRead.model_validate(result)


@router.get("/data", response_model=list[ExternalAPIDataRead])
async def list_external_data(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    source: Optional[str] = None,
    data_type: Optional[str] = None,
    status: Optional[str] = None,
    service: ExternalDataService = Depends(get_external_service)
) -> list[ExternalAPIDataRead]:
    """List all external API data with optional filtering."""
    results = await service.get_all_data(
        skip=skip,
        limit=limit,
        source=source,
        data_type=data_type,
        status=status
    )
    return [ExternalAPIDataRead.model_validate(r) for r in results]


@router.patch("/data/{data_id}", response_model=ExternalAPIDataRead)
async def update_external_data(
    data_id: int,
    data_update: ExternalAPIDataUpdate,
    service: ExternalDataService = Depends(get_external_service)
) -> ExternalAPIDataRead:
    """Update external API data."""
    result = await service.update_data(data_id, data_update)
    return ExternalAPIDataRead.model_validate(result)


@router.delete("/data/{data_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_external_data(
    data_id: int,
    service: ExternalDataService = Depends(get_external_service)
) -> None:
    """Delete external API data."""
    await service.delete_data(data_id)


@router.get("/data/expired/list", response_model=list[ExternalAPIDataRead])
async def get_expired_data(
    service: ExternalDataService = Depends(get_external_service)
) -> list[ExternalAPIDataRead]:
    """Get all expired data that needs refresh."""
    results = await service.get_expired_data()
    return [ExternalAPIDataRead.model_validate(r) for r in results]


@router.post(
    "/logs",
    response_model=ExternalAPILogRead,
    status_code=status.HTTP_201_CREATED
)
async def create_api_log(
    log: ExternalAPILogCreate,
    service: ExternalDataService = Depends(get_external_service)
) -> ExternalAPILogRead:
    """Create an API call log entry."""
    result = await service.create_log(log)
    return ExternalAPILogRead.model_validate(result)


@router.get("/logs", response_model=list[ExternalAPILogRead])
async def list_api_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    source: Optional[str] = None,
    service: ExternalDataService = Depends(get_external_service)
) -> list[ExternalAPILogRead]:
    """List API call logs with optional filtering."""
    results = await service.get_logs(skip=skip, limit=limit, source=source)
    return [ExternalAPILogRead.model_validate(r) for r in results]


@router.get("/stats", response_model=ExternalDataStats)
async def get_external_stats(
    source: Optional[str] = None,
    service: ExternalDataService = Depends(get_external_service)
) -> ExternalDataStats:
    """Get statistics about external API data."""
    return await service.get_stats(source=source)
