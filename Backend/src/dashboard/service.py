"""Dashboard service layer for business logic."""

import requests
import yfinance as yf
from nselib import capital_market
from mftool import Mftool
from src.shared.market_data import fetch_batch_summary
from src.dashboard.repository import DashboardRepository
from src.dashboard.models import DashboardMetric
from src.dashboard.schemas import (
    DashboardMetricCreate,
    DashboardMetricUpdate,
    DashboardMetricRead,
    DashboardOverview,
    NewsSentimentResponse
)
from src.dashboard.exceptions import (
    DashboardMetricNotFoundException,
    DashboardMetricAlreadyExistsException
)
from src.dashboard.config import ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_BASE_URL


class DashboardService:
    """Service layer for dashboard business logic."""
    
    def __init__(self, repo: DashboardRepository):
        self.repo = repo
    
    async def create_metric(self, metric_create: DashboardMetricCreate) -> DashboardMetric:
        """Create a new dashboard metric."""
        # Check if metric with same name already exists
        existing = await self.repo.get_by_name(metric_create.metric_name)
        if existing:
            raise DashboardMetricAlreadyExistsException(
                f"Metric '{metric_create.metric_name}' already exists"
            )
        
        metric = DashboardMetric.model_validate(metric_create)
        return await self.repo.create(metric)
    
    async def get_metric(self, metric_id: int) -> DashboardMetric:
        """Get a dashboard metric by ID."""
        metric = await self.repo.get(metric_id)
        if not metric:
            raise DashboardMetricNotFoundException(
                f"Dashboard metric {metric_id} not found"
            )
        return metric
    
    async def get_news_sentiment(self, ticker: str) -> dict:
        """Get news sentiment for a specific ticker from Alpha Vantage."""
        params = {
            "function": "NEWS_SENTIMENT",
            "tickers": ticker.upper(),
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
        response.raise_for_status()
        return response.json()
    
    async def get_metrics(
        self,
        skip: int = 0,
        limit: int = 100,
        category: str | None = None
    ) -> list[DashboardMetric]:
        """Get all dashboard metrics with optional filtering."""
        return await self.repo.get_all(skip=skip, limit=limit, category=category)
    
    async def update_metric(
        self,
        metric_id: int,
        metric_update: DashboardMetricUpdate
    ) -> DashboardMetric:
        """Update a dashboard metric."""
        metric = await self.get_metric(metric_id)
        
        # Update only provided fields
        update_data = metric_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(metric, field, value)
        
        return await self.repo.update(metric)
    
    async def delete_metric(self, metric_id: int) -> bool:
        """Delete a dashboard metric."""
        metric = await self.get_metric(metric_id)
        return await self.repo.delete(metric_id)
    
    async def get_overview(self) -> DashboardOverview:
        """Get dashboard overview with aggregated data."""
        total = await self.repo.count()
        categories = await self.repo.get_categories()
        latest = await self.repo.get_latest(limit=10)
        
        return DashboardOverview(
            total_metrics=total,
            categories=categories,
            latest_metrics=[DashboardMetricRead.model_validate(m) for m in latest]
        )


class YFinanceService:
    """Service layer for yfinance temporary API experimentation."""
    
    def get_ticker_info(self, symbol: str) -> dict:
        """Get ticker info using yfinance."""
        ticker = yf.Ticker(symbol)
        return ticker.info

    def get_ticker_history(self, symbol: str, period: str = "1mo") -> dict:
        """Get historical data using yfinance."""
        ticker = yf.Ticker(symbol)
        
        # Automatically adjust data interval based on the chosen period
        interval = "1d"
        if period == "1d":
            interval = "5m"
        elif period == "5d":
            interval = "15m"
        elif period in ["1mo", "3mo", "6mo", "1y", "ytd"]:
            interval = "1d"
        elif period in ["2y", "5y", "10y", "max"]:
            interval = "1wk"
            
        history_df = ticker.history(period=period, interval=interval)
        
        if not history_df.empty:
            # Normalize the DatetimeIndex to a consistent string format.
            #
            # ROOT CAUSE: astype(str) preserves the raw UTC offset of each ticker's
            # index (e.g. SBIN.NS → "+05:30", another stock → "+00:00"). The same
            # trading day then serialises to different YYYY-MM-DD prefixes ("2025-07-09"
            # vs "2025-07-08"), so the frontend cannot merge them into the same slot.
            #
            # Fix: always convert to IST (Asia/Kolkata) first, then format:
            #   - daily/weekly → plain "YYYY-MM-DD"  (no time, no tz ambiguity)
            #   - intraday     → "YYYY-MM-DD HH:MM:SS" in IST
            if hasattr(history_df.index, 'tz') and history_df.index.tz is not None:
                history_df.index = history_df.index.tz_convert('Asia/Kolkata')
            
            if interval in ("1d", "1wk"):
                history_df.index = history_df.index.strftime('%Y-%m-%d')
            else:
                history_df.index = history_df.index.strftime('%Y-%m-%d %H:%M:%S')
            
        return history_df.to_dict(orient="index")

    def _get_market_summary_data(self, symbols: list[str]) -> dict:
        """
        Get market summary for multiple symbols.
        Delegates to shared batch utility — one HTTP request for all symbols.
        """
        return fetch_batch_summary(symbols)

    def get_global_markets(self) -> dict:
        """Get structured global markets data."""
        global_symbols = {
            "USA": [
                {"symbol": "^IXIC", "name": "NASDAQ"},
                {"symbol": "^GSPC", "name": "S&P 500"},
                {"symbol": "^DJI", "name": "DOW JONES"},
            ],
            "Asia": [
                {"symbol": "^N225", "name": "Nikkei 225"},
                {"symbol": "^HSI", "name": "Hang Seng"},
                {"symbol": "000001.SS", "name": "Shanghai Comp"},
            ],
            "Europe": [
                {"symbol": "^FTSE", "name": "FTSE 100"},
                {"symbol": "^GDAXI", "name": "DAX"},
                {"symbol": "^FCHI", "name": "CAC 40"},
            ],
            "Commodities": [
                {"symbol": "CL=F", "name": "Crude Oil"},
                {"symbol": "GC=F", "name": "Gold"},
                {"symbol": "SI=F", "name": "Silver"},
            ],
            "Crypto": [
                {"symbol": "BTC-USD", "name": "Bitcoin"},
                {"symbol": "ETH-USD", "name": "Ethereum"},
                {"symbol": "BNB-USD", "name": "BNB"},
            ]
        }
        
        flat_symbols = [item["symbol"] for group in global_symbols.values() for item in group]
        summary = self._get_market_summary_data(flat_symbols)
        
        result = {}
        for region, items in global_symbols.items():
            region_data = []
            for item in items:
                data = summary.get(item["symbol"])
                if data:
                    region_data.append({
                        "name": item["name"],
                        "value": f"{data['price']:,.2f}",
                        "change": f"{'+' if data['positive'] else ''}{data['changePercent']:.2f}%",
                        "positive": data["positive"]
                    })
            result[region] = region_data
            
        return result

    def get_sector_heatmap(self) -> list[dict]:
        """Get structured sector heatmap data."""
        sector_symbols = [
            {"symbol": "^CNXIT", "name": "IT", "size": "large", "mcap": "₹32.4T"},
            {"symbol": "^NSEBANK", "name": "Banking", "size": "large", "mcap": "₹41.2T"},
            {"symbol": "^CNXAUTO", "name": "Auto", "size": "medium", "mcap": "₹14.5T"},
            {"symbol": "^CNXPHARMA", "name": "Pharma", "size": "medium", "mcap": "₹12.1T"},
            {"symbol": "^CNXFMCG", "name": "FMCG", "size": "medium", "mcap": "₹18.8T"},
            {"symbol": "^CNXMETAL", "name": "Metals", "size": "small", "mcap": "₹8.4T"},
            {"symbol": "^CNXENERGY", "name": "Energy", "size": "small", "mcap": "₹19.3T"},
            {"symbol": "^CNXREALTY", "name": "Realty", "size": "small", "mcap": "₹4.5T"},
            {"symbol": "^CNXINFRA", "name": "Infra", "size": "small", "mcap": "₹7.6T"},
            {"symbol": "^CNXCONSUM", "name": "Consumption", "size": "small", "mcap": "₹15.2T"},
        ]
        
        flat_symbols = [item["symbol"] for item in sector_symbols]
        summary = self._get_market_summary_data(flat_symbols)
        
        result = []
        for item in sector_symbols:
            data = summary.get(item["symbol"])
            if data:
                result.append({
                    "name": item["name"],
                    "change": data["changePercent"],
                    "size": item["size"],
                    "mcap": item["mcap"]
                })
            else:
                result.append({
                    "name": item["name"],
                    "change": 0.0,
                    "size": item["size"],
                    "mcap": item["mcap"]
                })
        return result

    def get_top_gainers_losers(self) -> dict:
        """
        Fetch NSE top gainers and losers via nselib.
        Returns { top_gainers: [...], top_losers: [...] }
        """
        result: dict = {"top_gainers": [], "top_losers": []}

        try:
            gainers_df = capital_market.top_gainers_or_losers(to_get='gainers')
            if gainers_df is not None and not gainers_df.empty:
                for _, row in gainers_df.head(10).iterrows():
                    per_change = str(row.get('perChange', 0)).replace('%', '').strip()
                    result['top_gainers'].append({
                        "ticker": str(row.get('symbol', '')),
                        "price": str(row.get('ltp', 0)),
                        "change_percentage": f"{per_change}%",
                    })
        except Exception as e:
            print(f"[YFinanceService] Error fetching gainers via nselib: {e}")

        try:
            # Note: nselib uses 'losers' (not 'loosers')
            losers_df = capital_market.top_gainers_or_losers(to_get='loosers')
            if losers_df is not None and not losers_df.empty:
                for _, row in losers_df.head(10).iterrows():
                    per_change = str(row.get('perChange', 0)).replace('%', '').strip()
                    result['top_losers'].append({
                        "ticker": str(row.get('symbol', '')),
                        "price": str(row.get('ltp', 0)),
                        "change_percentage": f"{per_change}%",
                    })
        except Exception as e:
            print(f"[YFinanceService] Error fetching losers via nselib: {e}")

        return result

    def get_market_summary(self, symbols: list[str]) -> dict:
        """Get aggregated dashboard data using market summary API."""
        summary_data = self._get_market_summary_data(symbols)
        heatmap_data = self.get_sector_heatmap()
        global_markets_data = self.get_global_markets()
        top_gainers_losers = self.get_top_gainers_losers()

        return {
            "summary": summary_data,
            "heatmap": heatmap_data,
            "globalMarkets": global_markets_data,
            "topGainersLosers": top_gainers_losers,
        }


class NseService:
    """Service layer for nselib temporary API experimentation."""
    
    def get_price_volume_data(self, symbol: str, period: str = "1M") -> list[dict]:
        """Get price volume data using nselib."""
        df = capital_market.price_volume_data(symbol=symbol.upper(), period=period)
        if df is not None and not df.empty:
            return df.fillna("").to_dict(orient="records")
        return []


class MfService:
    """Service layer for mftool temporary API experimentation."""
    
    def __init__(self):
        self.mf = Mftool()
        
    def get_scheme_info(self, code: str) -> dict:
        """Get mutual fund scheme quote."""
        try:
            return self.mf.get_scheme_quote(code) or {}
        except Exception as e:
            return {"error": str(e)}
        
    def get_scheme_history(self, code: str) -> dict:
        """Get mutual fund scheme historical nav."""
        import json
        try:
            data = self.mf.get_scheme_historical_nav(code, as_json=True)
            if isinstance(data, str):
                try:
                    return json.loads(data)
                except:
                    return {"error": "Invalid data returned", "data": data}
            return data or {}
        except Exception as e:
            return {"error": str(e)}
