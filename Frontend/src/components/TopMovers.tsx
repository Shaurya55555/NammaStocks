import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

import { TopGainersLosers } from '../api/Dashboard';

const TopMovers = ({ data }: { data?: TopGainersLosers | null }) => {
  const gainers = data?.top_gainers?.slice(0, 5).map(g => ({
    symbol: g.ticker,
    price: parseFloat(g.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    change: g.change_percentage
  })) || [];

  const losers = data?.top_losers?.slice(0, 5).map(l => ({
    symbol: l.ticker,
    price: parseFloat(l.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    change: l.change_percentage
  })) || [];

  return (
    <div className="space-y-8">
      {/* Gainers */}
      <div>
        <div className="flex items-center space-x-2 mb-4 bg-trade-gain/10 w-max px-3 py-1.5 rounded-lg border border-trade-gain/20">
          <TrendingUp className="w-4 h-4 text-trade-gain" />
          <h3 className="text-sm font-bold text-trade-gain tracking-wide uppercase">Top Gainers</h3>
        </div>
        <div className="space-y-2">
          {gainers.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center justify-between p-3.5 bg-theme-canvas border border-theme-border rounded-2xl hover:border-trade-gain/30 hover:bg-green-50/50 transition-all cursor-pointer group"
            >
              <div>
                <p className="text-content-primary font-bold text-sm group-hover:text-trade-gain transition-colors">{stock.symbol}</p>
                <p className="text-content-secondary text-xs font-medium mt-0.5">₹{stock.price}</p>
              </div>
              <div className="bg-trade-gain/10 px-3 py-1.5 rounded-lg border border-trade-gain/20">
                <span className="text-trade-gain font-bold text-sm">
                  {stock.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Losers */}
      <div>
        <div className="flex items-center space-x-2 mb-4 bg-trade-loss/10 w-max px-3 py-1.5 rounded-lg border border-trade-loss/20">
          <TrendingDown className="w-4 h-4 text-trade-loss" />
          <h3 className="text-sm font-bold text-trade-loss tracking-wide uppercase">Top Losers</h3>
        </div>
        <div className="space-y-2">
          {losers.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center justify-between p-3.5 bg-theme-canvas border border-theme-border rounded-2xl hover:border-trade-loss/30 hover:bg-red-50/50 transition-all cursor-pointer group"
            >
              <div>
                <p className="text-content-primary font-bold text-sm group-hover:text-trade-loss transition-colors">{stock.symbol}</p>
                <p className="text-content-secondary text-xs font-medium mt-0.5">₹{stock.price}</p>
              </div>
              <div className="bg-trade-loss/10 px-3 py-1.5 rounded-lg border border-trade-loss/20">
                <span className="text-trade-loss font-bold text-sm">
                  {stock.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;