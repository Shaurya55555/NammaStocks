import yfinance as yf
import time
from concurrent.futures import ThreadPoolExecutor

symbols = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "WIPRO.NS", "BAJFINANCE.NS", "^NSEI", "^BSESN", "^NSEBANK", "^INDIAVIX"]

start = time.time()
def get_info(sym):
    try:
        t = yf.Ticker(sym)
        return t.info.get("regularMarketPrice", t.info.get("previousClose", 0))
    except:
        return 0

with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(get_info, symbols))

print("Time:", time.time() - start)
print(results)
