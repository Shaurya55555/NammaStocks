"""Stocks API router."""

from fastapi import APIRouter, Depends, Query
from src.stocks.schemas import (
    StockInfoResponse,
    StockHistoryResponse
)
from src.stocks.service import StocksService
from src.stocks.dependencies import get_stocks_service

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("/info/{symbol}", response_model=StockInfoResponse)
def get_stock_info(
    symbol: str,
    service: StocksService = Depends(get_stocks_service)
):
    """Get stock info."""
    info = service.get_ticker_info(symbol)
    return StockInfoResponse(symbol=symbol, info=info)


@router.get("/history/{symbol}", response_model=StockHistoryResponse)
def get_stock_history(
    symbol: str,
    period: str = Query("1mo", description="Time period, e.g., 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max"),
    service: StocksService = Depends(get_stocks_service)
):
    """Get historical stock data."""
    history = service.get_ticker_history(symbol, period)
    return StockHistoryResponse(symbol=symbol, history=history)


@router.get("/market-summary")
def get_market_summary(
    symbols: str = Query(..., description="Comma separated symbols, e.g., AAPL,MSFT"),
    service: StocksService = Depends(get_stocks_service)
):
    """Get market summary for multiple symbols."""
    symbol_list = [s.strip() for s in symbols.split(",") if s.strip()]
    return service.get_market_summary(symbol_list)
