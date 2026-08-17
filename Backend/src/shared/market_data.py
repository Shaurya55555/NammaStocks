"""
Shared batch market data fetching using yf.download().

Uses yfinance's batch download API to fetch all symbols in a single HTTP
request instead of one request per symbol. This is the primary performance
fix for the dashboard and stocks summary endpoints.

Usage:
    from src.shared.market_data import fetch_batch_summary
    results = fetch_batch_summary(["RELIANCE.NS", "TCS.NS", "^NSEI"])
"""

import math
import pandas as pd
import yfinance as yf

# Simple in-memory TTL cache to avoid re-hitting Yahoo on rapid refreshes
import time
from typing import Any

_cache: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 60  # seconds


def _cache_get(key: str) -> Any | None:
    entry = _cache.get(key)
    if entry and (time.time() - entry[0]) < _CACHE_TTL:
        return entry[1]
    return None


def _cache_set(key: str, value: Any) -> None:
    _cache[key] = (time.time(), value)


def fetch_batch_summary(symbols: list[str], period: str = "1mo") -> dict:
    """
    Fetch price summary for multiple symbols in a single batched yfinance download.

    Returns a dict keyed by symbol:
        {
            "symbol": str,
            "name": str,
            "price": float,
            "change": float,
            "changePercent": float,
            "positive": bool,
            "spark": list[float],   # last 10 close prices
        }

    Symbols not found or with insufficient data are silently omitted.
    Names are derived from the symbol string (no extra ticker.info call).
    """
    if not symbols:
        return {}

    cache_key = f"{','.join(sorted(symbols))}:{period}"
    cached = _cache_get(cache_key)
    if cached is not None:
        print(f"[market_data] Cache hit for {len(symbols)} symbols")
        return cached

    print(f"[market_data] Batch downloading {len(symbols)} symbols via yf.download()")

    try:
        # Single HTTP request for all symbols — yfinance batches internally
        df = yf.download(
            tickers=symbols,
            period=period,
            interval="1d",
            auto_adjust=True,
            progress=False,
            threads=True,
        )
    except Exception as e:
        print(f"[market_data] yf.download() failed: {e}")
        return {}

    if df.empty:
        return {}

    # Fetch live prices concurrently to ensure we have the latest real-time quote
    from concurrent.futures import ThreadPoolExecutor
    live_data = {}
    def get_live(sym):
        try:
            info = yf.Ticker(sym).info
            price = info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose") or 0
            prev = info.get("previousClose") or price
            return sym, price, prev
        except:
            return sym, None, None

    with ThreadPoolExecutor(max_workers=min(20, max(1, len(symbols)))) as executor:
        for sym, price, prev in executor.map(get_live, symbols):
            live_data[sym] = (price, prev)

    results = {}

    # yfinance returns different DataFrame shapes depending on symbol count:
    #   - 1 symbol:  flat columns (Open, High, Low, Close, Volume)
    #   - N symbols: MultiIndex columns (metric, symbol) or (symbol, metric)
    if len(symbols) == 1:
        sym = symbols[0]
        close_col = df.get("Close")
        # yfinance may return a DataFrame instead of a Series for a single
        # symbol — squeeze it down to a 1-D Series before processing.
        if isinstance(close_col, pd.DataFrame):
            close_col = close_col.squeeze(axis=1)
        closes = _safe_series(close_col)
        if closes is not None and len(closes) >= 2:
            l_price, l_prev = live_data.get(sym, (None, None))
            results[sym] = _build_row(sym, closes, l_price, l_prev)
    else:
        # Try to access df["Close"] which should be a DataFrame of shape (dates, symbols)
        try:
            close_df = df["Close"]
        except KeyError:
            print("[market_data] Could not find 'Close' in downloaded data")
            return {}

        for sym in symbols:
            try:
                if sym not in close_df.columns:
                    continue
                closes = _safe_series(close_df[sym])
                if closes is None or len(closes) < 2:
                    continue
                l_price, l_prev = live_data.get(sym, (None, None))
                results[sym] = _build_row(sym, closes, l_price, l_prev)
            except Exception as e:
                print(f"[market_data] Error processing {sym}: {e}")

    _cache_set(cache_key, results)
    print(f"[market_data] Returning data for {len(results)}/{len(symbols)} symbols")
    return results


def _safe_series(series: pd.Series | None) -> list[float] | None:
    """Drop NaN values and return as a float list, or None if empty."""
    if series is None:
        return None
    # Guard: yfinance sometimes returns a 1-column DataFrame instead of a Series
    if isinstance(series, pd.DataFrame):
        series = series.squeeze(axis=1)
    if not isinstance(series, pd.Series):
        return None
    clean = series.dropna().tolist()
    return clean if clean else None


def _build_row(symbol: str, closes: list[float], live_price: float | None = None, live_prev: float | None = None) -> dict:
    """Build a market summary row from a list of closing prices and live data."""
    if live_price is not None and live_price > 0:
        last_price = live_price
        prev_price = live_prev if (live_prev and live_prev > 0) else closes[-2]
    else:
        last_price = closes[-1]
        prev_price = closes[-2]

    change = last_price - prev_price
    change_pct = (change / prev_price) * 100 if prev_price else 0.0

    spark = closes[-10:] if len(closes) >= 10 else closes
    spark_clean = [round(p, 2) for p in spark if not math.isnan(p)]

    # Derive a human-readable name without a separate ticker.info call
    name = (
        symbol
        .replace(".NS", "")
        .replace(".BO", "")
        .replace("^", "")
        .replace("-USD", "")
        .replace("=F", "")
    )

    return {
        "symbol": symbol,
        "name": name,
        "price": round(last_price, 2),
        "change": round(change, 2),
        "changePercent": round(change_pct, 2),
        "positive": change >= 0,
        "spark": spark_clean,
    }
