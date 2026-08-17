"""Dashboard repository for database operations."""

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, func
from src.dashboard.models import DashboardMetric
from typing import Optional


class DashboardRepository:
    """Repository for dashboard data access."""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get(self, metric_id: int) -> Optional[DashboardMetric]:
        """Get a dashboard metric by ID."""
        result = await self.session.exec(
            select(DashboardMetric).where(DashboardMetric.id == metric_id)
        )
        return result.first()
    
    async def get_by_name(self, metric_name: str) -> Optional[DashboardMetric]:
        """Get a dashboard metric by name."""
        result = await self.session.exec(
            select(DashboardMetric).where(DashboardMetric.metric_name == metric_name)
        )
        return result.first()
    
    async def get_all(
        self, 
        skip: int = 0, 
        limit: int = 100,
        category: Optional[str] = None
    ) -> list[DashboardMetric]:
        """Get all dashboard metrics with optional filtering."""
        query = select(DashboardMetric)
        
        if category:
            query = query.where(DashboardMetric.category == category)
        
        query = query.offset(skip).limit(limit).order_by(DashboardMetric.updated_at.desc())
        result = await self.session.exec(query)
        return list(result.all())
    
    async def get_latest(self, limit: int = 10) -> list[DashboardMetric]:
        """Get latest updated metrics."""
        result = await self.session.exec(
            select(DashboardMetric)
            .order_by(DashboardMetric.updated_at.desc())
            .limit(limit)
        )
        return list(result.all())
    
    async def get_categories(self) -> list[str]:
        """Get all unique categories."""
        result = await self.session.exec(
            select(DashboardMetric.category).distinct()
        )
        return list(result.all())
    
    async def count(self) -> int:
        """Count total metrics."""
        result = await self.session.exec(
            select(func.count()).select_from(DashboardMetric)
        )
        return result.one()
    
    async def create(self, metric: DashboardMetric) -> DashboardMetric:
        """Create a new dashboard metric."""
        self.session.add(metric)
        await self.session.commit()
        await self.session.refresh(metric)
        return metric
    
    async def update(self, metric: DashboardMetric) -> DashboardMetric:
        """Update an existing dashboard metric."""
        from datetime import datetime
        metric.updated_at = datetime.utcnow()
        self.session.add(metric)
        await self.session.commit()
        await self.session.refresh(metric)
        return metric
    
    async def delete(self, metric_id: int) -> bool:
        """Delete a dashboard metric."""
        metric = await self.get(metric_id)
        if metric:
            await self.session.delete(metric)
            await self.session.commit()
            return True
        return False
