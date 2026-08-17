import yfinance as yf
import time
from concurrent.futures import ThreadPoolExecutor

symbols = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "WIPRO.NS", "BAJFINANCE.NS", "^NSEI", "^BSESN", "^NSEBANK", "^INDIAVIX"]

start = time.time()
def get_fast_info(sym):
    try:
        t = yf.Ticker(sym)
        return sym, t.fast_info.last_price, t.fast_info.previous_close
    except Exception as e:
        return sym, 0, 0

with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(get_fast_info, symbols))

print("Time fast_info:", time.time() - start)
print(results)
