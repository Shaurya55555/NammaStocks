"""External data service layer for business logic."""

from src.external.repository import ExternalDataRepository
from src.external.models import ExternalAPIData, ExternalAPILog
from src.external.schemas import (
    ExternalAPIDataCreate,
    ExternalAPIDataUpdate,
    ExternalAPIDataRead,
    ExternalAPILogCreate,
    ExternalAPILogRead,
    ExternalDataStats
)
from src.external.exceptions import (
    ExternalDataNotFoundException,
    ExternalDataAlreadyExistsException
)


class ExternalDataService:
    """Service layer for external API data business logic."""
    
    def __init__(self, repo: ExternalDataRepository):
        self.repo = repo
    
    async def create_data(self, data_create: ExternalAPIDataCreate) -> ExternalAPIData:
        """Create new external API data record."""
        # Check if data with same external_id already exists
        if data_create.external_id:
            existing = await self.repo.get_by_external_id(
                data_create.source,
                data_create.external_id
            )
            if existing:
                raise ExternalDataAlreadyExistsException(
                    f"Data from {data_create.source} with ID {data_create.external_id} already exists"
                )
        
        data = ExternalAPIData.model_validate(data_create)
        return await self.repo.create(data)
    
    async def get_data(self, data_id: int) -> ExternalAPIData:
        """Get external data by ID."""
        data = await self.repo.get(data_id)
        if not data:
            raise ExternalDataNotFoundException(f"External data {data_id} not found")
        return data
    
    async def get_all_data(
        self,
        skip: int = 0,
        limit: int = 100,
        source: str | None = None,
        data_type: str | None = None,
        status: str | None = None
    ) -> list[ExternalAPIData]:
        """Get all external data with optional filtering."""
        return await self.repo.get_all(
            skip=skip,
            limit=limit,
            source=source,
            data_type=data_type,
            status=status
        )
    
    async def update_data(
        self,
        data_id: int,
        data_update: ExternalAPIDataUpdate
    ) -> ExternalAPIData:
        """Update external API data."""
        data = await self.get_data(data_id)
        
        # Update only provided fields
        update_dict = data_update.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(data, field, value)
        
        return await self.repo.update(data)
    
    async def delete_data(self, data_id: int) -> bool:
        """Delete external API data."""
        data = await self.get_data(data_id)
        return await self.repo.delete(data_id)
    
    async def get_expired_data(self) -> list[ExternalAPIData]:
        """Get all expired data that needs refresh."""
        return await self.repo.get_expired()
    
    async def create_log(self, log_create: ExternalAPILogCreate) -> ExternalAPILog:
        """Create API call log entry."""
        log = ExternalAPILog.model_validate(log_create)
        return await self.repo.create_log(log)
    
    async def get_logs(
        self,
        skip: int = 0,
        limit: int = 100,
        source: str | None = None
    ) -> list[ExternalAPILog]:
        """Get API logs with optional filtering."""
        return await self.repo.get_logs(skip=skip, limit=limit, source=source)
    
    async def get_stats(self, source: str | None = None) -> ExternalDataStats:
        """Get statistics about external API data."""
        total = await self.repo.count(source=source)
        sources = await self.repo.get_sources()
        data_types = await self.repo.get_data_types()
        success_rate = await self.repo.get_success_rate(source=source)
        avg_response_time = await self.repo.get_avg_response_time(source=source)
        
        return ExternalDataStats(
            total_records=total,
            sources=sources,
            data_types=data_types,
            success_rate=success_rate,
            avg_response_time_ms=avg_response_time
        )
