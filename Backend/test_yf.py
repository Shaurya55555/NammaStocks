import yfinance as yf
import pandas as pd

sym = "RELIANCE.NS"

# Test download
df = yf.download(sym, period="1mo", interval="1d", auto_adjust=True, progress=False)
try:
    close_val = df["Close"].iloc[-1]
    if isinstance(close_val, pd.Series):
        close_val = close_val.item()
    print("Download latest close:", close_val)
except Exception as e:
    print("Download error:", e)

# Test info
try:
    info = yf.Ticker(sym).info
    print("Info currentPrice:", info.get("currentPrice"))
    print("Info regularMarketPrice:", info.get("regularMarketPrice"))
    print("Info previousClose:", info.get("previousClose"))
except Exception as e:
    print("Info error:", e)
