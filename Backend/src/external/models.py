"""External data database models."""

from sqlmodel import SQLModel, Field, Column, JSON
from typing import Optional, Any
from datetime import datetime


class ExternalAPIData(SQLModel, table=True):
    """Model for storing data from external/third-party APIs."""
    
    __tablename__ = "external_api_data"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    source: str = Field(index=True, max_length=255)  # e.g., "twitter", "weather", "stock_api"
    data_type: str = Field(index=True, max_length=100)  # e.g., "tweet", "forecast", "quote"
    external_id: Optional[str] = Field(index=True, max_length=255)  # ID from external source
    data: dict[str, Any] = Field(default={}, sa_column=Column(JSON))  # JSON data from API
    status: str = Field(default="active", max_length=50)  # active, archived, failed
    fetch_url: Optional[str] = None  # Original API URL
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None  # When this data should be refreshed


class ExternalAPILog(SQLModel, table=True):
    """Model for logging external API calls."""
    
    __tablename__ = "external_api_logs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    source: str = Field(index=True, max_length=255)
    endpoint: str
    method: str = Field(max_length=10)  # GET, POST, etc.
    status_code: Optional[int] = None
    response_time_ms: Optional[float] = None
    success: bool = Field(default=True)
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
