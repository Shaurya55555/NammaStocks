"""External data dependencies for FastAPI dependency injection."""

from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from src.database import get_session
from src.external.repository import ExternalDataRepository
from src.external.service import ExternalDataService


async def get_external_service(
    session: AsyncSession = Depends(get_session)
) -> ExternalDataService:
    """Get external data service instance."""
    repository = ExternalDataRepository(session)
    return ExternalDataService(repository)
