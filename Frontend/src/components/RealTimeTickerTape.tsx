import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { stocksApi } from '../api/Stocks';

const NIFTY_50_SYMBOLS = [
  'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 
  'ICICIBANK.NS', 'BAJFINANCE.NS', 'HCLTECH.NS', 'WIPRO.NS',
  'SBIN.NS', 'BHARTIARTL.NS', 'ITC.NS', 'LT.NS'
];

interface TickerStock {
  symbol: string;
  price: string;
  change: string;
  positive: boolean;
}

const RealTimeTickerTape = () => {
  const [stocks, setStocks] = useState<TickerStock[]>([]);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const summaryMap = await stocksApi.getMarketSummary(NIFTY_50_SYMBOLS);
        const tickerData = NIFTY_50_SYMBOLS.map(sym => {
          const data = summaryMap[sym];
          if (data) {
            return {
              symbol: data.symbol.replace('.NS', ''),
              price: data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              change: `${data.change > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`,
              positive: data.change >= 0
            };
          }
          return null;
        }).filter(Boolean) as TickerStock[];
        
        if (tickerData.length > 0) {
          setStocks(tickerData);
        }
      } catch (error) {
        console.error("Failed to fetch ticker data", error);
      }
    };

    fetchTickerData();
    const intervalId = setInterval(fetchTickerData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Use a fixed height so there's no layout shift while loading
  if (stocks.length === 0) {
    return (
      <div className="bg-theme-surface border-b border-theme-border h-[41px] flex items-center justify-center">
      </div>
    );
  }

  // Duplicate the list so it can scroll infinitely without gaps
  const duplicatedStocks = [...stocks, ...stocks];

  return (
    <div className="bg-theme-surface border-b border-theme-border overflow-hidden shadow-sm flex h-[41px]">
      <motion.div
        className="flex space-x-8 py-2.5 min-w-max pr-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedStocks.map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <span className="text-content-primary font-semibold text-sm">{stock.symbol}</span>
            <span className="text-content-secondary text-sm">₹{stock.price}</span>
            <span className={`text-sm font-semibold ${stock.positive ? 'text-trade-gain' : 'text-trade-loss'}`}>
              {stock.change}
            </span>
            <span className="text-theme-border text-xs">·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default RealTimeTickerTape;