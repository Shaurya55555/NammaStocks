from src.shared.market_data import fetch_batch_summary
import json

data = fetch_batch_summary(["RELIANCE.NS"])
print(json.dumps(data, indent=2))
