"""External data repository for database operations."""

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, func
from src.external.models import ExternalAPIData, ExternalAPILog
from typing import Optional
from datetime import datetime


class ExternalDataRepository:
    """Repository for external API data access."""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get(self, data_id: int) -> Optional[ExternalAPIData]:
        """Get external data by ID."""
        result = await self.session.exec(
            select(ExternalAPIData).where(ExternalAPIData.id == data_id)
        )
        return result.first()
    
    async def get_by_external_id(
        self,
        source: str,
        external_id: str
    ) -> Optional[ExternalAPIData]:
        """Get data by external ID and source."""
        result = await self.session.exec(
            select(ExternalAPIData).where(
                ExternalAPIData.source == source,
                ExternalAPIData.external_id == external_id
            )
        )
        return result.first()
    
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        source: Optional[str] = None,
        data_type: Optional[str] = None,
        status: Optional[str] = None
    ) -> list[ExternalAPIData]:
        """Get all external data with optional filtering."""
        query = select(ExternalAPIData)
        
        if source:
            query = query.where(ExternalAPIData.source == source)
        if data_type:
            query = query.where(ExternalAPIData.data_type == data_type)
        if status:
            query = query.where(ExternalAPIData.status == status)
        
        query = query.offset(skip).limit(limit).order_by(ExternalAPIData.created_at.desc())
        result = await self.session.exec(query)
        return list(result.all())
    
    async def get_expired(self) -> list[ExternalAPIData]:
        """Get all expired data that needs refresh."""
        now = datetime.utcnow()
        result = await self.session.exec(
            select(ExternalAPIData).where(
                ExternalAPIData.expires_at.isnot(None),
                ExternalAPIData.expires_at <= now,
                ExternalAPIData.status == "active"
            )
        )
        return list(result.all())
    
    async def get_sources(self) -> list[str]:
        """Get all unique sources."""
        result = await self.session.exec(
            select(ExternalAPIData.source).distinct()
        )
        return list(result.all())
    
    async def get_data_types(self) -> list[str]:
        """Get all unique data types."""
        result = await self.session.exec(
            select(ExternalAPIData.data_type).distinct()
        )
        return list(result.all())
    
    async def count(self, source: Optional[str] = None) -> int:
        """Count total records."""
        query = select(func.count()).select_from(ExternalAPIData)
        if source:
            query = query.where(ExternalAPIData.source == source)
        result = await self.session.exec(query)
        return result.one()
    
    async def create(self, data: ExternalAPIData) -> ExternalAPIData:
        """Create new external data record."""
        self.session.add(data)
        await self.session.commit()
        await self.session.refresh(data)
        return data
    
    async def update(self, data: ExternalAPIData) -> ExternalAPIData:
        """Update existing external data."""
        data.updated_at = datetime.utcnow()
        self.session.add(data)
        await self.session.commit()
        await self.session.refresh(data)
        return data
    
    async def delete(self, data_id: int) -> bool:
        """Delete external data record."""
        data = await self.get(data_id)
        if data:
            await self.session.delete(data)
            await self.session.commit()
            return True
        return False
    
    # API Log methods
    async def create_log(self, log: ExternalAPILog) -> ExternalAPILog:
        """Create API call log entry."""
        self.session.add(log)
        await self.session.commit()
        await self.session.refresh(log)
        return log
    
    async def get_logs(
        self,
        skip: int = 0,
        limit: int = 100,
        source: Optional[str] = None
    ) -> list[ExternalAPILog]:
        """Get API logs with optional filtering."""
        query = select(ExternalAPILog)
        
        if source:
            query = query.where(ExternalAPILog.source == source)
        
        query = query.offset(skip).limit(limit).order_by(ExternalAPILog.created_at.desc())
        result = await self.session.exec(query)
        return list(result.all())
    
    async def get_success_rate(self, source: Optional[str] = None) -> float:
        """Calculate API success rate."""
        query = select(func.count()).select_from(ExternalAPILog)
        if source:
            query = query.where(ExternalAPILog.source == source)
        
        total_result = await self.session.exec(query)
        total = total_result.one()
        
        if total == 0:
            return 100.0
        
        success_query = select(func.count()).select_from(ExternalAPILog).where(
            ExternalAPILog.success == True
        )
        if source:
            success_query = success_query.where(ExternalAPILog.source == source)
        
        success_result = await self.session.exec(success_query)
        success = success_result.one()
        
        return (success / total) * 100
    
    async def get_avg_response_time(self, source: Optional[str] = None) -> float:
        """Get average response time."""
        query = select(func.avg(ExternalAPILog.response_time_ms)).select_from(ExternalAPILog)
        if source:
            query = query.where(ExternalAPILog.source == source)
        
        result = await self.session.exec(query)
        avg = result.one()
        return avg if avg else 0.0
