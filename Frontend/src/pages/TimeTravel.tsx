import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Clock, Play, AlertCircle, RefreshCw, BarChart2, Briefcase, TrendingUp, TrendingDown, Loader2,
} from 'lucide-react';
import GhostCursor from '../components/GhostCursor';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChartPoint {
  label: string;       // human-readable date label
  sym1: number;        // normalised to % return since start (index-100)
  sym2: number;
  sym1Price: number;   // raw price for tooltip
  sym2Price: number;
}

interface StockMeta {
  symbol: string;
  name: string;
  startPrice: number;
  currentPrice: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a yfinance history record into chart-friendly points.
 *  Normalises both series to 100 at inception so they're comparable. */
function buildChartData(
  sym1: string, hist1: Record<string, any>,
  sym2: string, hist2: Record<string, any>,
): ChartPoint[] {
  const dates1 = Object.keys(hist1).sort();
  const dates2 = Object.keys(hist2).sort();

  // Use the union of available dates (outer-join fills with last known)
  const allDates = Array.from(new Set([...dates1, ...dates2])).sort();

  // Get baseline prices (first trading day each appears); guard against null Close
  const base1 = (hist1[dates1[0]]?.Close ?? null) !== null ? hist1[dates1[0]].Close : 1;
  const base2 = (hist2[dates2[0]]?.Close ?? null) !== null ? hist2[dates2[0]].Close : 1;

  let last1: number = base1;
  let last2: number = base2;

  const points: ChartPoint[] = [];

  for (const date of allDates) {
    // Only update last known price when Close is a real number (not null/undefined)
    if (hist1[date]?.Close != null) last1 = hist1[date].Close as number;
    if (hist2[date]?.Close != null) last2 = hist2[date].Close as number;

    // Protect against division-by-zero and null before calling .toFixed()
    const safeBase1 = base1 || 1;
    const safeBase2 = base2 || 1;
    const safeLast1 = last1 ?? 0;
    const safeLast2 = last2 ?? 0;

    points.push({
      label: formatDateLabel(date),
      sym1: parseFloat(((safeLast1 / safeBase1) * 100).toFixed(2)),
      sym2: parseFloat(((safeLast2 / safeBase2) * 100).toFixed(2)),
      sym1Price: parseFloat(safeLast1.toFixed(2)),
      sym2Price: parseFloat(safeLast2.toFixed(2)),
    });
  }

  // Downsample to ~24 points maximum (monthly for multi-year data)
  return downsample(points, 24);
}

function downsample(points: ChartPoint[], target: number): ChartPoint[] {
  if (points.length <= target) return points;
  const step = Math.floor(points.length / target);
  const sampled = points.filter((_, i) => i % step === 0);
  // Always include the last point
  if (sampled[sampled.length - 1] !== points[points.length - 1]) {
    sampled.push(points[points.length - 1]);
  }
  return sampled;
}

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

function roi(points: ChartPoint[], key: 'sym1' | 'sym2'): number {
  if (!points.length) return 0;
  return parseFloat((points[points.length - 1][key] - 100).toFixed(2));
}

// ---------------------------------------------------------------------------
// Custom Recharts tooltip
// ---------------------------------------------------------------------------

const CustomTooltip = ({
  active, payload, label, sym1Name, sym2Name,
}: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-theme-canvas border border-theme-border rounded-xl px-4 py-3 shadow-surface text-[12px]">
      <p className="text-content-secondary font-mono mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-content-secondary">{p.dataKey === 'sym1' ? sym1Name : sym2Name}</span>
          <span className="ml-auto font-semibold text-content-primary">{p.value.toFixed(1)}%</span>
          <span className="text-content-secondary/60 text-[11px]">
            ₹{p.payload[p.dataKey === 'sym1' ? 'sym1Price' : 'sym2Price']?.toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

const StatCard = ({
  meta, roi: roiVal, color, dataIndex, chartData,
}: {
  meta: StockMeta; roi: number; color: string; dataIndex: number; chartData: ChartPoint[];
}) => {
  const isPositive = roiVal >= 0;
  const currentPct = dataIndex < chartData.length
    ? chartData[dataIndex][color === '#8b5cf6' ? 'sym1' : 'sym2'] - 100
    : roiVal;

  return (
    <motion.div
      className="bg-theme-surface border border-theme-border rounded-3xl p-6 hover:border-trade-action/30 hover:shadow-surface transition-all"
      animate={{ borderColor: isPositive ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)' }}
      transition={{ duration: 1 }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
        style={{ background: `${color}20` }}>
        <Briefcase className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-content-secondary text-[11px] font-bold tracking-widest uppercase truncate">{meta.name}</p>
      <p className="text-content-secondary/50 text-[10px] font-mono mb-1">{meta.symbol}</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={dataIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-content-primary mt-1"
        >
          ₹{(chartData[dataIndex]?.[color === '#8b5cf6' ? 'sym1Price' : 'sym2Price'] ?? meta.currentPrice)
            ?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </motion.p>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.p
          key={`roi-${dataIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm font-bold mt-2 flex items-center gap-1 ${isPositive ? 'text-trade-gain' : 'text-trade-loss'}`}
        >
          {currentPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {currentPct >= 0 ? '+' : ''}{currentPct.toFixed(1)}% ROI
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const DEFAULT_SYMBOLS = ['TATAMOTORS', 'HDFCBANK'];
const PERIOD = '3y';

const TimeTravel = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDriving = searchParams.get('drive') === 'true';

  // Parse symbols from URL, e.g. ?symbols=TCS,INFY
  const rawSymbols = searchParams.get('symbols');
  const urlSymbols = rawSymbols
    ? rawSymbols.split(',').map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 2)
    : [];
  const [sym1, sym2] = urlSymbols.length === 2 ? urlSymbols : DEFAULT_SYMBOLS;

  // Data state
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [meta1, setMeta1] = useState<StockMeta | null>(null);
  const [meta2, setMeta2] = useState<StockMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Playback state
  const [dataIndex, setDataIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retroMode, setRetroMode] = useState(false);
  const [showCursor, setShowCursor] = useState(isDriving);

  // ---------------------------------------------------------------------------
  // Fetch real historical data from backend
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    setChartData([]);
    setDataIndex(0);
    setIsPlaying(false);
    setRetroMode(false);

    try {
      const [r1, r2] = await Promise.all([
        fetch(`${API_BASE}/v1/stocks/history/${encodeURIComponent(sym1 + '.NS')}?period=${PERIOD}`),
        fetch(`${API_BASE}/v1/stocks/history/${encodeURIComponent(sym2 + '.NS')}?period=${PERIOD}`),
      ]);

      if (!r1.ok || !r2.ok) throw new Error('Failed to fetch historical data');

      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);

      const hist1: Record<string, any> = d1.history ?? {};
      const hist2: Record<string, any> = d2.history ?? {};

      if (!Object.keys(hist1).length || !Object.keys(hist2).length) {
        throw new Error(`No historical data found for ${sym1} or ${sym2}`);
      }

      const points = buildChartData(sym1, hist1, sym2, hist2);
      setChartData(points);
      setDataIndex(points.length - 1); // start at full view; resets on Run

      // Build lightweight meta
      const dates1 = Object.keys(hist1).sort();
      const dates2 = Object.keys(hist2).sort();
      setMeta1({
        symbol: sym1,
        name: sym1,   // enriched below via info endpoint if available
        startPrice: hist1[dates1[0]]?.Close ?? 0,
        currentPrice: hist1[dates1[dates1.length - 1]]?.Close ?? 0,
      });
      setMeta2({
        symbol: sym2,
        name: sym2,
        startPrice: hist2[dates2[0]]?.Close ?? 0,
        currentPrice: hist2[dates2[dates2.length - 1]]?.Close ?? 0,
      });

      // Enrich names from info endpoint (best-effort, no failure if slow)
      enrichNames(sym1, sym2, setMeta1, setMeta2);
    } catch (err: any) {
      console.error('[TimeTravel] fetch error:', err);
      setFetchError(err.message ?? 'Failed to load historical data');
    } finally {
      setLoading(false);
    }
  }, [sym1, sym2]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ---------------------------------------------------------------------------
  // Playback ticker
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isPlaying) return;
    if (dataIndex >= chartData.length - 1) {
      setIsPlaying(false);
      return;
    }
    const t = setTimeout(() => setDataIndex(prev => prev + 1), 900);
    return () => clearTimeout(t);
  }, [isPlaying, dataIndex, chartData.length]);

  const startBacktest = () => {
    setRetroMode(true);
    setDataIndex(0);
    setTimeout(() => setIsPlaying(true), 600);
  };

  // Ghost cursor steps for agentic drive mode
  const cursorSteps = [
    { targetId: 'tt-year-slider', action: 'click' as const, delayBefore: 1500, onComplete: () => setRetroMode(true) },
    { targetId: 'tt-start-btn', action: 'click' as const, delayBefore: 1500, onComplete: startBacktest },
  ];

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const roi1 = roi(chartData, 'sym1');
  const roi2 = roi(chartData, 'sym2');
  const winner = roi1 > roi2 ? sym1 : sym2;
  const winnerRoi = Math.max(roi1, roi2).toFixed(1);
  const loserName = roi1 > roi2 ? sym2 : sym1;
  const isComplete = !isPlaying && dataIndex === chartData.length - 1 && chartData.length > 0;
  const simYear = chartData.length > 0 && retroMode
    ? new Date(Date.now() - ((chartData.length - 1 - dataIndex) * 30 * 24 * 60 * 60 * 1000 * (PERIOD === '3y' ? 1 : 1))).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 bg-theme-canvas text-content-primary flex flex-col">
      {showCursor && (
        <GhostCursor steps={cursorSteps} onAllComplete={() => setShowCursor(false)} />
      )}

      <div className="max-w-6xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent flex items-center gap-3">
              <Clock className="w-8 h-8 text-violet-500" />
              Time-Travel Backtesting
            </h1>
            <p className="text-content-secondary text-sm mt-1">
              Visualizing {sym1} vs {sym2} over the last 3 years
            </p>
          </div>

          <div
            className="flex items-center gap-4 bg-theme-surface border border-theme-border p-3 rounded-2xl"
            id="tt-year-slider"
          >
            <span className="text-content-secondary font-mono text-sm">3Y ago</span>
            <div className="w-48 h-2 bg-theme-border rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-violet-500 rounded-full"
                animate={{
                  width: chartData.length > 0
                    ? `${((dataIndex + 1) / chartData.length) * 100}%`
                    : '100%',
                }}
                transition={{ duration: 0.25 }}
              />
            </div>
            <span className="text-content-primary font-mono font-bold min-w-[4ch]">
              {chartData.length > 0 && retroMode
                ? chartData[dataIndex]?.label?.slice(-2) ? `'${chartData[dataIndex]?.label?.slice(-2)}` : 'Now'
                : 'Now'}
            </span>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-content-secondary">
            <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
            <p className="text-sm font-medium">
              Fetching {sym1} &amp; {sym2} historical data...
            </p>
          </div>
        )}

        {/* Error state */}
        {fetchError && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="bg-trade-loss/10 border border-trade-loss/30 rounded-2xl p-6 max-w-md text-center">
              <AlertCircle className="w-8 h-8 text-trade-loss mx-auto mb-3" />
              <p className="text-content-primary font-medium mb-1">Failed to load data</p>
              <p className="text-content-secondary text-sm mb-4">{fetchError}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-trade-loss/10 hover:bg-trade-loss/20 border border-trade-loss/30 text-trade-loss rounded-xl text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Dashboard grid */}
        {!loading && !fetchError && chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
            {/* Main Chart */}
            <div className="col-span-3 bg-theme-surface border border-theme-border rounded-3xl p-6 relative overflow-hidden flex flex-col shadow-surface hover:border-trade-action/20 transition-all">
              {retroMode && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)',
                  }}
                />
              )}

              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-bold text-content-primary flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-content-secondary" />
                  <span>{sym1}</span>
                  <span className="text-content-secondary">vs</span>
                  <span>{sym2}</span>
                  <span className="text-content-secondary text-sm font-normal ml-1">(% return, 3Y)</span>
                </h2>
                <button
                  id="tt-start-btn"
                  onClick={startBacktest}
                  disabled={isPlaying}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPlaying
                    ? <RefreshCw className="w-4 h-4 animate-spin" />
                    : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Simulating...' : 'Run Simulation'}
                </button>
              </div>

              <div className="flex-1 min-h-[400px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.slice(0, dataIndex + 1)}>
                    <XAxis
                      dataKey="label"
                      stroke="var(--color-border, #e5e7eb)"
                      tick={{ fill: 'var(--color-secondary, #6b7280)', fontSize: 11 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="var(--color-border, #e5e7eb)"
                      tick={{ fill: 'var(--color-secondary, #6b7280)', fontSize: 11 }}
                      tickFormatter={v => `${v}%`}
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip content={<CustomTooltip sym1Name={sym1} sym2Name={sym2} />} />
                    <ReferenceLine y={100} stroke="var(--color-border, #e5e7eb)" strokeDasharray="3 3" label={{ value: 'Baseline', fill: 'var(--color-secondary, #6b7280)', fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="sym1"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="sym2"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-4 relative z-10">
                <div className="flex items-center gap-2 text-[12px] text-content-secondary">
                  <span className="w-6 h-0.5 bg-violet-500 rounded-full inline-block" />
                  {sym1}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-content-secondary">
                  <span className="w-6 h-0.5 bg-red-500 rounded-full inline-block" />
                  {sym2}
                </div>
              </div>
            </div>

            {/* Stats panel */}
            <div className="col-span-1 space-y-4">
              {meta1 && (
                <StatCard
                  meta={meta1}
                  roi={roi1}
                  color="#8b5cf6"
                  dataIndex={dataIndex}
                  chartData={chartData}
                />
              )}
              {meta2 && (
                <StatCard
                  meta={meta2}
                  roi={roi2}
                  color="#ef4444"
                  dataIndex={dataIndex}
                  chartData={chartData}
                />
              )}

              {/* Conclusion */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-trade-gain/10 border border-trade-gain/30 rounded-3xl p-5"
                >
                  <div className="flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-trade-gain shrink-0 mt-0.5" />
                    <p className="text-sm text-content-primary leading-relaxed">
                      <strong>Conclusion:</strong>{' '}
                      <span className="text-trade-action font-semibold">{winner}</span> outperformed{' '}
                      <span className="font-semibold">{loserName}</span> over 3 years.{' '}
                      Switching to {winner} at the start would have returned{' '}
                      <span className="text-trade-gain font-bold">+{winnerRoi}%</span>.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Best-effort name enrichment (async, non-blocking)
// ---------------------------------------------------------------------------

async function enrichNames(
  sym1: string,
  sym2: string,
  setMeta1: React.Dispatch<React.SetStateAction<StockMeta | null>>,
  setMeta2: React.Dispatch<React.SetStateAction<StockMeta | null>>,
) {
  try {
    const [r1, r2] = await Promise.allSettled([
      fetch(`${API_BASE}/v1/stocks/info/${encodeURIComponent(sym1 + '.NS')}`),
      fetch(`${API_BASE}/v1/stocks/info/${encodeURIComponent(sym2 + '.NS')}`),
    ]);

    if (r1.status === 'fulfilled' && r1.value.ok) {
      const d = await r1.value.json();
      const name = d.info?.shortName || d.info?.longName || sym1;
      setMeta1(prev => prev ? { ...prev, name } : prev);
    }
    if (r2.status === 'fulfilled' && r2.value.ok) {
      const d = await r2.value.json();
      const name = d.info?.shortName || d.info?.longName || sym2;
      setMeta2(prev => prev ? { ...prev, name } : prev);
    }
  } catch {
    // non-critical, ignore
  }
}

export default TimeTravel;
