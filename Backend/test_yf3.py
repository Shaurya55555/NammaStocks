import yfinance as yf
import pandas as pd

sym = "RELIANCE.NS"
df = yf.download(sym, period="1d", interval="1m", progress=False)
print("Latest 1m close:", df["Close"].dropna().iloc[-1].item() if not df["Close"].dropna().empty else "Empty")
