import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip, Brush } from 'recharts';
import { stocksApi } from '../api/Stocks';

const StockHistoryCharts = ({ symbol }: { symbol: string }) => {
  const [timeframe, setTimeframe] = useState('1mo');
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const timeframes = [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1mo' },
    { label: '3M', value: '3mo' },
    { label: '6M', value: '6mo' },
    { label: '1Y', value: '1y' }
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const querySymbol = symbol?.includes('.') ? symbol : `${symbol}.NS`;
        const res = await stocksApi.getStockHistory(querySymbol, timeframe);
        if (res && res.history) {
          const formatted = Object.entries(res.history).map(([dateStr, values]: [string, any]) => {
            const d = new Date(dateStr);
            const timeLabel = timeframe === '1d' || timeframe === '5d' 
              ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
              
            return {
              time: timeLabel,
              fullDate: dateStr,
              open: values.Open,
              high: values.High,
              low: values.Low,
              close: values.Close,
              volume: values.Volume,
              body: [values.Open, values.Close], // For recharts candlestick body
            };
          });
          setChartData(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [symbol, timeframe]);

  // Compute overall trend for the Line Chart color
  const firstData = chartData[0];
  const lastData = chartData[chartData.length - 1];
  const isOverallUp = (lastData?.close ?? 0) >= (firstData?.close ?? 0);
  const trendColor = isOverallUp ? '#10B981' : '#EF4444'; // trade-gain : trade-loss

  // Custom shape for candlestick body
  const CandlestickShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    const isGrowing = payload.close >= payload.open;
    const color = isGrowing ? '#10B981' : '#EF4444'; // trade-gain : trade-loss
    
    return (
      <g>
        <rect x={x} y={y} width={width} height={Math.max(height, 2)} fill={color} rx={2} />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-theme-surface border border-theme-border p-3 rounded-xl shadow-xl">
          <p className="text-content-primary font-bold mb-2">{data.fullDate ? new Date(data.fullDate).toLocaleString() : label}</p>
          <div className="space-y-1 text-sm font-medium">
            <p className="text-content-secondary">Open: <span className="text-content-primary font-bold">₹{data.open?.toFixed(2)}</span></p>
            <p className="text-content-secondary">High: <span className="text-content-primary font-bold">₹{data.high?.toFixed(2)}</span></p>
            <p className="text-content-secondary">Low: <span className="text-content-primary font-bold">₹{data.low?.toFixed(2)}</span></p>
            <p className="text-content-secondary">Close: <span className="text-content-primary font-bold">₹{data.close?.toFixed(2)}</span></p>
            <p className="text-content-secondary">Volume: <span className="text-content-primary font-bold">{data.volume?.toLocaleString()}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-theme-surface rounded-3xl p-4 border border-theme-border shadow-surface flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
        <h2 className="text-xl font-bold text-content-primary">{symbol} Chart</h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-theme-canvas rounded-xl p-1 border border-theme-border">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                disabled={loading}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  timeframe === tf.value
                    ? 'bg-trade-action text-white shadow-md'
                    : 'text-content-secondary hover:text-content-primary'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-theme-canvas border border-theme-border text-content-primary px-3 py-2 rounded-xl focus:border-trade-action focus:ring-1 focus:ring-trade-action focus:outline-none font-semibold text-sm"
          >
            <option value="line">Line</option>
            <option value="candlestick">Candlestick</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-content-secondary font-semibold bg-theme-surface rounded-3xl border border-theme-border">
          Loading chart data...
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-surface rounded-3xl p-6 border border-theme-border shadow-surface"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={trendColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={trendColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Brush 
                    dataKey="time" 
                    height={24} 
                    stroke={trendColor} 
                    fill="transparent" 
                    travellerWidth={10} 
                    tickFormatter={() => ''} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="close" 
                    stroke={trendColor} 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorClose)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                  <Brush 
                    dataKey="time" 
                    height={24} 
                    stroke="#3B82F6" 
                    fill="transparent" 
                    travellerWidth={10} 
                    tickFormatter={() => ''} 
                  />
                  <Bar dataKey="body" shape={<CandlestickShape />} isAnimationActive={false} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Technical Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-theme-border">
        {[
          { label: 'RSI (14)', value: '68.45', color: 'text-amber-500' },
          { label: 'MACD', value: '+12.34', color: 'text-emerald-500' },
          { label: '20 DMA', value: '2,834.56', color: 'text-blue-500' },
          { label: '50 DMA', value: '2,789.23', color: 'text-violet-500' },
        ].map((indicator, index) => (
          <motion.div
            key={indicator.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center bg-theme-surface rounded-2xl py-4 border border-theme-border shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-content-secondary text-xs font-bold uppercase tracking-wider">{indicator.label}</p>
            <p className={`font-black text-lg mt-1 ${indicator.color}`}>{indicator.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StockHistoryCharts;