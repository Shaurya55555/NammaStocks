import yfinance as yf
import pandas as pd

sym = "RELIANCE.NS"

df = yf.download(sym, period="5d", interval="1d", auto_adjust=True, progress=False)
print("Close column:")
print(df["Close"])
