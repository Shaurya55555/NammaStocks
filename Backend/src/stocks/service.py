"""Stocks service layer for dedicated stock data fetching."""

import yfinance as yf
from src.shared.market_data import fetch_batch_summary


class StocksService:
    """Service layer for fetching core stock data using yfinance."""

    def get_ticker_info(self, symbol: str) -> dict:
        """Get ticker info."""
        ticker = yf.Ticker(symbol)
        return ticker.info

    def get_ticker_history(self, symbol: str, period: str = "1mo") -> dict:
        """Get historical data."""
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
            # astype(str) preserves the raw UTC offset, which causes different stocks
            # to emit different YYYY-MM-DD prefixes for the same trading day when their
            # timezone offsets differ. Always convert to IST first, then format:
            #   - daily/weekly → plain "YYYY-MM-DD"
            #   - intraday     → "YYYY-MM-DD HH:MM:SS" in IST
            if hasattr(history_df.index, 'tz') and history_df.index.tz is not None:
                history_df.index = history_df.index.tz_convert('Asia/Kolkata')

            if interval in ("1d", "1wk"):
                history_df.index = history_df.index.strftime('%Y-%m-%d')
            else:
                history_df.index = history_df.index.strftime('%Y-%m-%d %H:%M:%S')

        return history_df.to_dict(orient="index")

    def get_market_summary(self, symbols: list[str]) -> dict:
        """
        Get market summary (current price, % change, sparkline) for multiple symbols.
        Uses a single batched yf.download() call instead of per-symbol requests.
        """
        return fetch_batch_summary(symbols)
