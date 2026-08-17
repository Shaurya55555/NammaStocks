import { get } from '../http';

// Types
export interface NewsSentimentResponse {
  [key: string]: unknown;
}

export interface CompanyOverview {
  [key: string]: unknown;
}

export interface MarketSummaryItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  positive: boolean;
  spark: number[];
}

export interface MarketSummaryResponse {
  summary: Record<string, MarketSummaryItem>;
  heatmap: any[];
  globalMarkets: Record<string, any[]>;
  topGainersLosers: TopGainersLosers;
}

export interface YFinanceTickerInfoResponse {
  symbol: string;
  info: any;
}

export interface YFinanceHistoryResponse {
  symbol: string;
  history: any;
}

export interface TopGainersLosers {
  metadata?: {
    last_updated: string;
  };
  top_gainers?: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
  }>;
  top_losers?: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
  }>;
  most_actively_traded?: Array<{
    ticker: string;
    price: string;
    volume: string;
  }>;
  [key: string]: unknown;
}

// API Calls
export const dashboardApi = {
  /**
   * Get news sentiment from Finnhub for a specific ticker
   * Endpoint: GET /dashboard/news-sentiment-finnhub?ticker={ticker}
   */
  async getNewsSentimentFinnhub(ticker: string): Promise<NewsSentimentResponse> {
    return get<NewsSentimentResponse>(`/dashboard/news-sentiment-finnhub?ticker=${encodeURIComponent(ticker)}`);
  },

  /**
   * Get top gainers, losers, and most actively traded stocks
   * Endpoint: GET /dashboard/top-gainers-losers-direct
   */
  async getTopGainersLosers(): Promise<TopGainersLosers> {
    return get<TopGainersLosers>('/dashboard/yfinance/top-gainers-losers');
  },

  /**
   * Get company overview for a specific symbol
   * Endpoint: GET /dashboard/company-overview-direct?symbol={symbol}
   */
  async getCompanyOverview(symbol: string): Promise<CompanyOverview> {
    return get<CompanyOverview>(`/dashboard/company-overview-direct?symbol=${encodeURIComponent(symbol.toUpperCase())}`);
  },

  /**
   * Get news sentiment for a specific topic
   * Endpoint: GET /dashboard/news-sentiment?topics={topics}
   */
  async getNewsSentiment(topics: string): Promise<NewsSentimentResponse> {
    return get<NewsSentimentResponse>(`/dashboard/news-sentiment?topics=${encodeURIComponent(topics)}`);
  },

  /**
   * Get market summary for multiple symbols using yfinance
   * Endpoint: GET /dashboard/yfinance/market-summary?symbols={symbols}
   */
  async getMarketSummary(symbols: string[]): Promise<MarketSummaryResponse> {
    const query = symbols.join(',');
    return get<MarketSummaryResponse>(`/dashboard/yfinance/market-summary?symbols=${query}`);
  },

  /**
   * Get global markets structured data
   * Endpoint: GET /dashboard/yfinance/global-markets
   */
  async getGlobalMarkets(): Promise<Record<string, any[]>> {
    return get<Record<string, any[]>>('/dashboard/yfinance/global-markets');
  },

  /**
   * Get sector heatmap structured data
   * Endpoint: GET /dashboard/yfinance/sector-heatmap
   */
  async getSectorHeatmap(): Promise<any[]> {
    return get<any[]>('/dashboard/yfinance/sector-heatmap');
  },

  /**
   * Get ticker info using yfinance
   * Endpoint: GET /dashboard/yfinance/info/{symbol}
   */
  async getYFinanceInfo(symbol: string): Promise<YFinanceTickerInfoResponse> {
    return get<YFinanceTickerInfoResponse>(`/dashboard/yfinance/info/${encodeURIComponent(symbol)}`);
  },

  /**
   * Get historical data using yfinance
   * Endpoint: GET /dashboard/yfinance/history/{symbol}?period={period}
   */
  async getYFinanceHistory(symbol: string, period: string = '1mo'): Promise<YFinanceHistoryResponse> {
    return get<YFinanceHistoryResponse>(`/dashboard/yfinance/history/${encodeURIComponent(symbol)}?period=${period}`);
  },
};
