"""Dashboard API router."""

import finnhub
import requests
from fastapi import APIRouter, Depends, status, Query
from src.dashboard.schemas import (
    DashboardMetricCreate,
    DashboardMetricUpdate,
    DashboardMetricRead,
    DashboardOverview,
    NewsSentimentResponse,
    YFinanceTickerInfoResponse,
    YFinanceHistoryResponse,
    NseHistoryResponse,
    MfSchemeInfoResponse,
    MfSchemeHistoryResponse
)
from src.dashboard.service import DashboardService, YFinanceService, NseService, MfService
from src.dashboard.dependencies import get_dashboard_service, get_yfinance_service, get_nse_service, get_mf_service
from src.config import settings
from src.dashboard.config import ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_BASE_URL
from typing import Optional

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/news-sentiment-finnhub")
async def get_news_finnhub(
    ticker: str = Query(..., description="Stock ticker symbol (e.g., AAPL)")
):
    """Get news sentiment from Finnhub API."""
    finnhub_client = finnhub.Client(api_key=settings.FINNHUB_API_KEY)
    return finnhub_client.news_sentiment(ticker)

@router.get("/top-gainers-losers-direct")
async def get_top_gainers_losers_direct():
    """Get top gainers, losers, and most actively traded stocks directly from AlphaVantage."""
    params = {
        "function": "TOP_GAINERS_LOSERS",
        "apikey": ALPHA_VANTAGE_API_KEY
    }
    response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
    response.raise_for_status()
    return response.json()

@router.get("/company-overview-direct")
async def get_company_overview_direct(
    symbol: str = Query(..., description="Stock ticker symbol (e.g., IBM)")
):
    """Get company overview directly from AlphaVantage API."""
    params = {
        "function": "OVERVIEW",
        "symbol": symbol.upper(),
        "apikey": ALPHA_VANTAGE_API_KEY
    }
    response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
    response.raise_for_status()
    return response.json()

@router.get("/news-sentiment", response_model=dict)
async def get_news_sentiment(
    topics: str = Query(..., description="Stock ticker symbol (e.g., AAPL)"),
    service: DashboardService = Depends(get_dashboard_service)
) -> dict:
    """Get news sentiment for a specific stock ticker."""
    return await service.get_news_sentiment(topics)


@router.get("/yfinance/info/{symbol}", response_model=YFinanceTickerInfoResponse)
def get_yfinance_ticker_info(
    symbol: str,
    service: YFinanceService = Depends(get_yfinance_service)
):
    """Get ticker info using yfinance for experimentation."""
    info = service.get_ticker_info(symbol)
    return YFinanceTickerInfoResponse(symbol=symbol, info=info)


@router.get("/yfinance/history/{symbol}", response_model=YFinanceHistoryResponse)
def get_yfinance_ticker_history(
    symbol: str,
    period: str = Query("1mo", description="Time period, e.g., 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max"),
    service: YFinanceService = Depends(get_yfinance_service)
):
    """Get historical data using yfinance for experimentation."""
    history = service.get_ticker_history(symbol, period)
    return YFinanceHistoryResponse(symbol=symbol, history=history)


@router.get("/yfinance/market-summary")
def get_yfinance_market_summary(
    symbols: str = Query(..., description="Comma separated symbols, e.g., AAPL,MSFT"),
    service: YFinanceService = Depends(get_yfinance_service)
):
    """Get market summary for multiple symbols."""
    symbol_list = [s.strip() for s in symbols.split(",") if s.strip()]
    return service.get_market_summary(symbol_list)


@router.get("/yfinance/top-gainers-losers")
def get_nse_top_gainers_losers(
    service: YFinanceService = Depends(get_yfinance_service)
):
    """Get NSE top gainers and losers via nselib."""
    return service.get_top_gainers_losers()



@router.get("/yfinance/global-markets")
def get_yfinance_global_markets(
    service: YFinanceService = Depends(get_yfinance_service)
):
    """Get global markets data."""
    return service.get_global_markets()


@router.get("/yfinance/sector-heatmap")
def get_yfinance_sector_heatmap(
    service: YFinanceService = Depends(get_yfinance_service)
):
    """Get sector heatmap data."""
    return service.get_sector_heatmap()


@router.get("/nse/history/{symbol}", response_model=NseHistoryResponse)
def get_nse_ticker_history(
    symbol: str,
    period: str = Query("1M", description="Time period, e.g., 1W, 1M, 3M, 6M, 1Y"),
    service: NseService = Depends(get_nse_service)
):
    """Get historical data using nselib for experimentation."""
    history = service.get_price_volume_data(symbol, period)
    return NseHistoryResponse(symbol=symbol, history=history)


@router.get("/mf/info/{code}", response_model=MfSchemeInfoResponse)
def get_mf_scheme_info(
    code: str,
    service: MfService = Depends(get_mf_service)
):
    """Get scheme quote using mftool for experimentation."""
    info = service.get_scheme_info(code)
    return MfSchemeInfoResponse(code=code, info=info)


@router.get("/mf/history/{code}", response_model=MfSchemeHistoryResponse)
def get_mf_scheme_history(
    code: str,
    service: MfService = Depends(get_mf_service)
):
    """Get historical NAV using mftool for experimentation."""
    history = service.get_scheme_history(code)
    return MfSchemeHistoryResponse(code=code, history=history)
