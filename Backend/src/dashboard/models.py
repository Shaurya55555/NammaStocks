"""Dashboard database models."""

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class DashboardMetric(SQLModel, table=True):
    """Dashboard metric model for tracking various metrics."""
    
    __tablename__ = "dashboard_metrics"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    metric_name: str = Field(index=True, max_length=255)
    metric_value: float
    metric_type: str = Field(max_length=100)  # e.g., "count", "percentage", "currency"
    category: str = Field(max_length=100)  # e.g., "users", "revenue", "performance"
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
