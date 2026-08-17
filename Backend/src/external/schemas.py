"""External data Pydantic schemas for validation."""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Any
from datetime import datetime


class ExternalAPIDataCreate(BaseModel):
    """Schema for creating external API data."""
    
    source: str = Field(..., min_length=1, max_length=255)
    data_type: str = Field(..., min_length=1, max_length=100)
    external_id: Optional[str] = Field(None, max_length=255)
    data: dict[str, Any]
    status: str = Field(default="active", max_length=50)
    fetch_url: Optional[str] = None
    expires_at: Optional[datetime] = None


class ExternalAPIDataUpdate(BaseModel):
    """Schema for updating external API data."""
    
    data: Optional[dict[str, Any]] = None
    status: Optional[str] = Field(None, max_length=50)
    expires_at: Optional[datetime] = None


class ExternalAPIDataRead(BaseModel):
    """Schema for reading external API data."""
    
    id: int
    source: str
    data_type: str
    external_id: Optional[str]
    data: dict[str, Any]
    status: str
    fetch_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    expires_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ExternalAPILogCreate(BaseModel):
    """Schema for creating API log."""
    
    source: str = Field(..., min_length=1, max_length=255)
    endpoint: str
    method: str = Field(..., max_length=10)
    status_code: Optional[int] = None
    response_time_ms: Optional[float] = None
    success: bool = True
    error_message: Optional[str] = None


class ExternalAPILogRead(BaseModel):
    """Schema for reading API log."""
    
    id: int
    source: str
    endpoint: str
    method: str
    status_code: Optional[int]
    response_time_ms: Optional[float]
    success: bool
    error_message: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class ExternalDataStats(BaseModel):
    """Schema for external data statistics."""
    
    total_records: int
    sources: list[str]
    data_types: list[str]
    success_rate: float
    avg_response_time_ms: float
