import { get } from '../http';

export interface MarketSummaryItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  positive: boolean;
  spark: number[];
}

export interface StockInfoResponse {
  symbol: string;
  info: any;
}

export interface StockHistoryResponse {
  symbol: string;
  history: any;
}

export const stocksApi = {
  /**
   * Get stock info
   * Endpoint: GET /stocks/info/{symbol}
   */
  async getStockInfo(symbol: string): Promise<StockInfoResponse> {
    return get<StockInfoResponse>(`/stocks/info/${encodeURIComponent(symbol)}`);
  },

  /**
   * Get historical data
   * Endpoint: GET /stocks/history/{symbol}?period={period}
   */
  async getStockHistory(symbol: string, period: string = '1mo'): Promise<StockHistoryResponse> {
    return get<StockHistoryResponse>(`/stocks/history/${encodeURIComponent(symbol)}?period=${period}`);
  },

  /**
   * Get market summary for multiple symbols
   * Endpoint: GET /stocks/market-summary?symbols={symbols}
   */
  async getMarketSummary(symbols: string[]): Promise<Record<string, MarketSummaryItem>> {
    const query = symbols.join(',');
    return get<Record<string, MarketSummaryItem>>(`/stocks/market-summary?symbols=${query}`);
  },
};
