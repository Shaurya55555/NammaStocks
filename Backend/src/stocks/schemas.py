"""Stocks Pydantic schemas for validation."""

from pydantic import BaseModel
from typing import Dict, Any

class StockInfoResponse(BaseModel):
    """Schema for stock info response."""
    symbol: str
    info: Dict[str, Any]

class StockHistoryResponse(BaseModel):
    """Schema for stock history response."""
    symbol: str
    history: Dict[str, Any]
