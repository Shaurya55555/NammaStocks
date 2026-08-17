"""
RAG (Retrieval-Augmented Generation) context builder for the AI agent.

Before calling the LLM, this module:
1. Extracts stock symbols mentioned in the user's message
2. Fetches real-time price data via yfinance
3. Fetches recent news headlines for those symbols
4. Formats everything into a compact context block injected into the system prompt

This replaces hallucinated LLM answers with grounded, current market data.
"""

import re
import asyncio
from typing import List, Optional
import yfinance as yf

from src.config import settings


# ---------------------------------------------------------------------------
# Symbol extraction — simple but effective regex for NSE tickers
# ---------------------------------------------------------------------------

# Common NSE ticker patterns: uppercase words 2-15 chars, optionally with hyphens
# Also handles common aliases like "Reliance" → "RELIANCE"
_TICKER_PATTERN = re.compile(r'\b([A-Z][A-Z0-9\-]{1,14})\b')

# Words that look like tickers but aren't (filter noise)
_STOP_WORDS = {
    "I", "A", "AN", "THE", "AND", "OR", "VS", "FOR", "IN", "OF",
    "AT", "TO", "BY", "MY", "IS", "IT", "ON", "BE", "DO", "IF",
    "ME", "WE", "US", "HI", "OK", "CAN", "GET", "SET", "HOW",
    "WHY", "WHO", "NSE", "BSE", "IPO", "ETF", "SIP", "NAV",
    "PE", "PB", "ROE", "EPS", "TTM", "YOY", "QOQ", "LTP", "ATP",
    "NIFTY", "SENSEX",  # indices, not individual stocks
}

# Name-to-symbol mapping for common conversational references
_NAME_TO_SYMBOL = {
    "RELIANCE": "RELIANCE",
    "TCS": "TCS",
    "INFOSYS": "INFY",
    "INFY": "INFY",
    "HDFC": "HDFCBANK",
    "HDFCBANK": "HDFCBANK",
    "WIPRO": "WIPRO",
    "ICICI": "ICICIBANK",
    "ICICIBANK": "ICICIBANK",
    "AXIS": "AXISBANK",
    "AXISBANK": "AXISBANK",
    "SBI": "SBIN",
    "SBIN": "SBIN",
    "BAJAJ": "BAJAJ-AUTO",
    "MARUTI": "MARUTI",
    "TATAMOTORS": "TATAMOTORS",
    "TATAPOWER": "TATAPOWER",
    "ADANI": "ADANIENT",
    "ADANIENT": "ADANIENT",
    "ONGC": "ONGC",
    "NTPC": "NTPC",
    "POWERGRID": "POWERGRID",
    "COALINDIA": "COALINDIA",
    "HINDALCO": "HINDALCO",
    "JSWSTEEL": "JSWSTEEL",
    "SAIL": "SAIL",
    "BHARTIARTL": "BHARTIARTL",
    "AIRTEL": "BHARTIARTL",
    "ZOMATO": "ZOMATO",
    "NYKAA": "NYKAA",
    "PAYTM": "PAYTM",
    "LT": "LT",
    "LTIM": "LTIM",
    "MINDTREE": "LTIM",
    "HCLTECH": "HCLTECH",
    "TECHM": "TECHM",
    "MPHASIS": "MPHASIS",
    "PERSISTENT": "PERSISTENT",
}


def extract_symbols(text: str) -> List[str]:
    """
    Extract NSE stock ticker symbols from a natural-language query.
    Returns a deduplicated list of resolved ticker symbols (without .NS suffix).
    """
    # Uppercase the text for matching
    upper_text = text.upper()

    found: List[str] = []

    # 1. Check known name → symbol mappings first (highest confidence)
    for name, sym in _NAME_TO_SYMBOL.items():
        if re.search(r'\b' + re.escape(name) + r'\b', upper_text):
            if sym not in found:
                found.append(sym)

    # 2. Regex for uppercase ticker patterns not already found
    for match in _TICKER_PATTERN.finditer(upper_text):
        token = match.group(1)
        if token in _STOP_WORDS:
            continue
        if token in _NAME_TO_SYMBOL:
            sym = _NAME_TO_SYMBOL[token]
            if sym not in found:
                found.append(sym)
        elif len(token) >= 2 and token not in found:
            found.append(token)

    return found[:5]  # Cap at 5 symbols to avoid slow RAG fetches


# ---------------------------------------------------------------------------
# Data fetching — sync wrappers run in thread pool to stay async-safe
# ---------------------------------------------------------------------------

def _fetch_stock_snapshot(symbol: str) -> Optional[dict]:
    """Fetch a compact price snapshot for one NSE symbol using yfinance."""
    try:
        ns_symbol = f"{symbol}.NS"
        ticker = yf.Ticker(ns_symbol)
        info = ticker.info

        # Fast path: use regularMarketPrice from info dict
        price = info.get("regularMarketPrice") or info.get("currentPrice")
        prev_close = info.get("regularMarketPreviousClose") or info.get("previousClose")
        pe = info.get("trailingPE") or info.get("forwardPE")
        week_high = info.get("fiftyTwoWeekHigh")
        week_low = info.get("fiftyTwoWeekLow")
        market_cap = info.get("marketCap")
        name = info.get("shortName") or info.get("longName") or symbol
        sector = info.get("sector", "Unknown")

        if not price:
            return None

        change_pct = None
        if price and prev_close:
            change_pct = round(((price - prev_close) / prev_close) * 100, 2)

        mc_str = ""
        if market_cap:
            if market_cap >= 1_00_00_00_00_000:  # 1 lakh crore
                mc_str = f"₹{market_cap / 1_00_00_00_00_000:.1f}L Cr"
            elif market_cap >= 1_00_00_00_000:  # 1000 crore
                mc_str = f"₹{market_cap / 1_00_00_00_000:.0f} Cr"

        return {
            "symbol": symbol,
            "name": name,
            "sector": sector,
            "price": round(price, 2),
            "change_pct": change_pct,
            "pe": round(pe, 1) if pe else None,
            "week_high": round(week_high, 2) if week_high else None,
            "week_low": round(week_low, 2) if week_low else None,
            "market_cap": mc_str,
        }
    except Exception as e:
        print(f"[RAG] Error fetching snapshot for {symbol}: {e}")
        return None


def _fetch_news_headlines(symbol: str, limit: int = 3) -> List[str]:
    """Fetch recent news headlines for a symbol via yfinance."""
    try:
        ticker = yf.Ticker(f"{symbol}.NS")
        news_items = ticker.get_news(count=limit, tab="news")
        headlines = []
        for item in news_items:
            content = item.get("content", {})
            title = content.get("title", "")
            if title:
                headlines.append(title)
        return headlines[:limit]
    except Exception as e:
        print(f"[RAG] Error fetching news for {symbol}: {e}")
        return []


async def _fetch_symbol_context(symbol: str, news_limit: int) -> str:
    """Async wrapper: fetch snapshot + news for one symbol concurrently."""
    loop = asyncio.get_event_loop()

    snapshot_task = loop.run_in_executor(None, _fetch_stock_snapshot, symbol)
    news_task = loop.run_in_executor(None, _fetch_news_headlines, symbol, news_limit)

    snapshot, headlines = await asyncio.gather(snapshot_task, news_task)

    if not snapshot:
        return f"### {symbol}\n(Data unavailable)\n"

    lines = [
        f"### {snapshot['name']} ({symbol})",
        f"Sector: {snapshot['sector']}",
        f"Price: ₹{snapshot['price']}" + (f" ({snapshot['change_pct']:+.2f}%)" if snapshot['change_pct'] is not None else ""),
    ]
    if snapshot['pe']:
        lines.append(f"P/E: {snapshot['pe']}")
    if snapshot['week_high'] and snapshot['week_low']:
        lines.append(f"52W Range: ₹{snapshot['week_low']} – ₹{snapshot['week_high']}")
    if snapshot['market_cap']:
        lines.append(f"Market Cap: {snapshot['market_cap']}")
    if headlines:
        lines.append("Recent News:")
        for h in headlines:
            lines.append(f"  - {h}")

    return "\n".join(lines)


async def build_rag_context(user_query: str) -> str:
    """
    Main entry point: given a user query, return a formatted market data block
    to inject as context into the LLM system prompt.

    Returns empty string if RAG is disabled or no symbols found.
    """
    if not settings.RAG_ENABLED:
        return ""

    symbols = extract_symbols(user_query)
    if not symbols:
        return ""

    # Fetch all symbols concurrently
    tasks = [_fetch_symbol_context(sym, settings.RAG_NEWS_LIMIT) for sym in symbols]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    valid = [r for r in results if isinstance(r, str)]
    if not valid:
        return ""

    header = "## Live Market Data (as of now — use this to answer accurately)\n"
    return header + "\n\n".join(valid)
