"""Stocks dependencies for dependency injection."""

from src.stocks.service import StocksService

def get_stocks_service() -> StocksService:
    """Get stocks service instance."""
    return StocksService()
