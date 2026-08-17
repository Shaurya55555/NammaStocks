import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { stocksApi } from '../../api/Stocks';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface StockMiniCardProps {
  stock: Stock;
}

const StockMiniCard: React.FC<StockMiniCardProps> = ({ stock }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const periodMap: Record<string, string> = {
    '1D': '1d',
    '1W': '5d',
    '1M': '1mo',
    '1Y': '1y',
    '5Y': '5y'
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const period = periodMap[activeTimeframe] || '1mo';
        const querySymbol = stock.symbol.includes('.') ? stock.symbol : `${stock.symbol}.NS`;
        const res = await stocksApi.getStockHistory(querySymbol, period);
        if (res && res.history) {
          const formatted = Object.entries(res.history).map(([dateStr, values]: [string, any]) => {
            const d = new Date(dateStr);
            const timeLabel = activeTimeframe === '1D' || activeTimeframe === '1W' 
              ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : d.toLocaleDateString([], { month: 'short', day: 'numeric', year: activeTimeframe === '5Y' ? 'numeric' : undefined });
              
            return {
              time: timeLabel,
              fullDate: dateStr,
              price: values.Close,
            };
          });
          setChartData(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch history for mini card", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [stock.symbol, activeTimeframe]);

  const isPositive = stock.change >= 0;
  
  // Compute overall trend from actual data if available for accurate chart coloring
  const firstData = chartData[0];
  const lastData = chartData[chartData.length - 1];
  const isOverallUp = chartData.length > 0 ? ((lastData?.price || 0) >= (firstData?.price || 0)) : isPositive;
  const trendColor = isOverallUp ? '#10B981' : '#EF4444'; // trade-gain : trade-loss

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-theme-surface border border-theme-border p-2 rounded-lg shadow-lg text-xs">
          <p className="text-content-primary font-bold mb-1">{data.fullDate ? new Date(data.fullDate).toLocaleString() : label}</p>
          <p className="text-content-secondary">Price: <span className="text-content-primary font-bold">₹{data.price?.toFixed(2)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-theme-surface rounded-xl border border-theme-border hover:border-trade-action/30 hover:shadow-surface overflow-hidden transition-all h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-theme-border bg-theme-canvas flex-shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-content-primary">{stock.symbol}</h3>
            <p className="text-sm text-content-secondary">{stock.sector}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-content-primary">₹{stock.price.toFixed(2)}</p>
            <div className={`flex items-center justify-end space-x-1 ${isPositive ? 'text-trade-gain' : 'text-trade-loss'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-content-secondary mt-1">{stock.name}</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-1 p-3 bg-theme-canvas border-b border-theme-border overflow-x-auto flex-shrink-0">
        {['1D', '1W', '1M', '1Y', '5Y'].map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
              activeTimeframe === tf
                ? 'bg-trade-action text-white shadow-sm'
                : 'text-content-secondary hover:text-content-primary hover:bg-theme-surface'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="p-4 bg-theme-surface flex-grow flex items-center justify-center min-h-[200px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-content-secondary">
            <Loader2 className="w-6 h-6 animate-spin text-trade-action" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading Data</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`colorPrice-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={trendColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={trendColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} opacity={0.2} />
              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                style={{ fontSize: '11px', fontWeight: 600 }}
                tick={{ fill: '#6B7280' }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '11px', fontWeight: 600 }}
                tick={{ fill: '#6B7280' }}
                width={50}
                domain={['dataMin', 'dataMax']}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={trendColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#colorPrice-${stock.symbol})`}
                isAnimationActive={true}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-3 bg-theme-canvas border-t border-theme-border text-xs text-content-secondary space-y-1 flex-shrink-0">
        <div className="flex justify-between">
          <span>Daily Change</span>
          <span className={isPositive ? 'text-trade-gain font-semibold' : 'text-trade-loss font-semibold'}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StockMiniCard;
