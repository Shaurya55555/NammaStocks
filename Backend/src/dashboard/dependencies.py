"""Dashboard dependencies for FastAPI dependency injection."""

from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from src.database import get_session
from src.dashboard.repository import DashboardRepository
from src.dashboard.service import DashboardService, YFinanceService, NseService, MfService


async def get_dashboard_service(
    session: AsyncSession = Depends(get_session)
) -> DashboardService:
    """Get dashboard service instance."""
    repository = DashboardRepository(session)
    return DashboardService(repository)


def get_yfinance_service() -> YFinanceService:
    """Get YFinance service instance."""
    return YFinanceService()


def get_nse_service() -> NseService:
    """Get NSE service instance."""
    return NseService()


def get_mf_service() -> MfService:
    """Get Mutual Fund service instance."""
    return MfService()
