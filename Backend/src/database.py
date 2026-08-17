from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from src.config import settings

# Import all models to register them with SQLModel
from src.items.models import Item  # noqa
from src.dashboard.models import DashboardMetric  # noqa
from src.external.models import ExternalAPIData, ExternalAPILog  # noqa
from src.auth.models import User  # noqa
from src.user_management.models import UserProfile  # noqa

engine = create_async_engine(settings.DATABASE_URL, echo=True, future=True)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_session() -> AsyncSession:
    """Dependency for database session."""
    async with async_session() as session:
        yield session

async def init_db():
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
