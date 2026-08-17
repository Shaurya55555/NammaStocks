import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Check, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StockGridView from '../components/StockComparison/StockGridView';
import ComparisonChart from '../components/StockComparison/ComparisonChart';
import GhostCursor from '../components/GhostCursor';
import { stocksApi } from '../api/Stocks';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

const DEFAULT_SYMBOLS = [
  { sym: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Oil & Gas' },
  { sym: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
  { sym: 'HDFCBANK', name: 'HDFC Bank Limited', sector: 'Banking' },
  { sym: 'INFY', name: 'Infosys Limited', sector: 'IT' },
  { sym: 'WIPRO', name: 'Wipro Limited', sector: 'IT' },
  { sym: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited', sector: 'Automobile' },
  { sym: 'MARUTI', name: 'Maruti Suzuki India Limited', sector: 'Automobile' },
  { sym: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  { sym: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking' },
  { sym: 'AXISBANK', name: 'Axis Bank Limited', sector: 'Banking' },
];

const ScreenerCompare = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isAgentDriving, setIsAgentDriving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const symbolsParam = searchParams.get('symbols');
  const isDriveMode = searchParams.get('drive') === 'true';
  const symbolsToClick = symbolsParam ? symbolsParam.split(',') : [];

  useEffect(() => {
    let mounted = true;
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const querySymbols = DEFAULT_SYMBOLS.map(s => `${s.sym}.NS`);
        const res = await stocksApi.getMarketSummary(querySymbols);
        if (!mounted) return;
        
        const fetchedStocks: Stock[] = [];
        
        DEFAULT_SYMBOLS.forEach((defStock, index) => {
          const querySymbol = `${defStock.sym}.NS`;
          const summary = res?.[querySymbol];
          
          fetchedStocks.push({
            symbol: defStock.sym,
            name: summary?.name || defStock.name,
            price: summary?.price || 0,
            change: summary?.change || 0,
            changePercent: summary?.changePercent || 0,
            sector: defStock.sector
          });
        });
        
        setAvailableStocks(fetchedStocks);
        
        // Auto select from params after load
        if (symbolsParam && !isDriveMode) {
          const initialSelected = fetchedStocks.filter(s => symbolsToClick.includes(s.symbol));
          if (initialSelected.length > 0) {
            setSelectedStocks(initialSelected);
            if (initialSelected.length > 1) setViewMode('compare');
          }
        }
      } catch (err) {
        console.error("Failed to fetch market summary", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchStocks();
    
    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array so it only runs once on mount

  const cursorSteps = isDriveMode ? [
    ...symbolsToClick.map((symbol, index) => ({
      targetId: 'compare-search-input',
      action: 'click' as const,
      delayBefore: index === 0 ? 1500 : 800,
      onComplete: async () => {
        // Typing effect
        for (let i = 0; i <= symbol.length; i++) {
          setSearchInput(symbol.slice(0, i));
          await new Promise(r => setTimeout(r, 100));
        }
        await new Promise(r => setTimeout(r, 300));
        
        // Fetch API
        setSearchLoading(true);
        try {
          const searchSymbol = symbol.toUpperCase().trim();
          const querySymbol = searchSymbol.includes('.') ? searchSymbol : `${searchSymbol}.NS`;
          const res = await stocksApi.getMarketSummary([querySymbol]);
          const summary = res?.[querySymbol];
          
          if (summary) {
            const newStock: Stock = {
              symbol: symbol,
              name: summary.name || symbol,
              price: summary.price || 0,
              change: summary.change || 0,
              changePercent: summary.changePercent || 0,
              sector: 'Unknown',
            };
            
            setAvailableStocks(prev => {
              if (!prev.find(s => s.symbol === symbol)) return [...prev, newStock];
              return prev;
            });
            setSelectedStocks(prev => {
              if (!prev.find(s => s.symbol === symbol)) return [...prev, newStock];
              return prev;
            });
          }
        } catch (err) {
          console.error("Search failed in drive mode", err);
        } finally {
          setSearchLoading(false);
          setSearchInput('');
        }
      }
    })),
    {
      targetId: 'view-compare-btn',
      action: 'click' as const,
      delayBefore: 1200,
      onComplete: () => setViewMode('compare')
    }
  ] : [];

  const handleSelectStock = (stock: Stock) => {
    if (!selectedStocks.find(s => s.symbol === stock.symbol)) {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  const handleDeselectStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s.symbol !== symbol));
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      const symbol = searchInput.trim().toUpperCase();
      // Check if already in availableStocks
      const existing = availableStocks.find(s => s.symbol === symbol);
      if (existing) {
        handleSelectStock(existing);
        setSearchInput('');
        return;
      }

      // Fetch from API
      setSearchLoading(true);
      try {
        const searchSymbol = searchInput.toUpperCase().trim();
        const querySymbol = searchSymbol.includes('.') ? searchSymbol : `${searchSymbol}.NS`;
        const res = await stocksApi.getMarketSummary([querySymbol]);
        const summary = res?.[querySymbol];
        
        if (summary) {
          const newStock: Stock = {
            symbol: symbol,
            name: summary.name || symbol,
            price: summary.price || 0,
            change: summary.change || 0,
            changePercent: summary.changePercent || 0,
            sector: 'Unknown',
          };
          setAvailableStocks(prev => [...prev, newStock]);
          handleSelectStock(newStock);
          setSearchInput('');
        } else {
          console.error("Stock not found");
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-canvas flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-trade-action animate-spin" />
        <span className="ml-3 text-content-primary font-bold">Loading stocks...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-canvas">
      {isDriveMode && availableStocks.length > 0 && (
        <GhostCursor
          steps={cursorSteps}
          onAllComplete={() => {
            setIsAgentDriving(false);
            navigate(`/screener/compare?symbols=${symbolsParam}`, { replace: true });
          }}
        />
      )}

      {/* Agent Driving Toast */}
      {isDriveMode && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-theme-surface border border-trade-action/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-surface"
        >
          <div className="w-2 h-2 rounded-full bg-trade-action animate-ping absolute left-6" />
          <div className="w-2 h-2 rounded-full bg-trade-action" />
          <span className="text-trade-action text-sm font-semibold tracking-wide ml-2">Agent is driving the UI...</span>
        </motion.div>
      )}

      <div className="max-w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-0">

          {/* Sticky Control Bar */}
          <div className="sticky top-0 z-30 bg-theme-surface/90 backdrop-blur-xl border-b border-theme-border shadow-surface">
            {/* Header & Controls Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
              {/* Left: Title & Back */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/screener')}
                  className="p-2 hover:bg-theme-canvas rounded-lg transition-colors text-content-secondary hover:text-content-primary"
                  title="Back to Screener"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-content-primary">Compare Stocks</h1>
              </div>

              {/* Center: Search & Filter */}
              <div className="flex-1 flex max-w-2xl gap-2">
                <div className="relative flex-1">
                  {searchLoading ? (
                    <Loader2 className="absolute left-3 top-2.5 w-4 h-4 text-trade-action animate-spin" />
                  ) : (
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-content-secondary" />
                  )}
                  <input
                    id="compare-search-input"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search stock and press Enter..."
                    disabled={searchLoading}
                    className="w-full pl-9 pr-4 py-2 bg-theme-canvas border border-theme-border rounded-xl focus:border-trade-action focus:ring-1 focus:ring-trade-action/20 focus:outline-none text-content-primary placeholder:text-content-secondary/60 text-sm transition-all"
                  />
                </div>
                <select className="px-4 py-2 bg-theme-canvas border border-theme-border rounded-xl focus:border-trade-action focus:outline-none text-content-primary text-sm cursor-pointer hover:border-trade-action/30 transition-colors">
                  <option value="">All Sectors</option>
                  <option value="IT">IT</option>
                  <option value="Banking">Banking</option>
                  <option value="Oil & Gas">Oil & Gas</option>
                  <option value="Automobile">Automobile</option>
                </select>
              </div>

              {/* Right: View Mode */}
              <div className="flex items-center gap-4">
                <div className="text-sm hidden xl:block">
                  <span className="text-content-secondary">Selected: </span>
                  <span className="text-trade-action font-bold">{selectedStocks.length}</span>
                </div>
                {selectedStocks.length > 0 && (
                  <div className="flex gap-1 bg-theme-canvas p-1 rounded-xl border border-theme-border">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                        viewMode === 'grid'
                          ? 'bg-theme-surface text-trade-action shadow-sm border border-theme-border'
                          : 'text-content-secondary hover:text-content-primary'
                      }`}
                    >
                      Grid
                    </button>
                    {selectedStocks.length > 1 && (
                      <button
                        id="view-compare-btn"
                        onClick={() => setViewMode('compare')}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                          viewMode === 'compare'
                            ? 'bg-trade-action text-white shadow-sm'
                            : 'text-content-secondary hover:text-content-primary'
                        }`}
                      >
                        Compare
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Horizontal Stock Pills Ribbon */}
            <div className="px-4 sm:px-6 lg:px-8 pb-3">
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
                {availableStocks.map((stock) => (
                  <button
                    id={`stock-${stock.symbol}`}
                    key={stock.symbol}
                    onClick={() => handleSelectStock(stock)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedStocks.find(s => s.symbol === stock.symbol)
                        ? 'bg-gradient-to-r from-trade-action to-blue-500 text-white shadow-sm shadow-trade-action/20 border border-transparent'
                        : 'bg-theme-surface text-content-secondary border border-theme-border hover:border-trade-action/40 hover:text-trade-action'
                    }`}
                  >
                    {stock.symbol}
                    {selectedStocks.find(s => s.symbol === stock.symbol) && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Grid View */}
            {viewMode === 'grid' && (
              <StockGridView
                selectedStocks={selectedStocks}
                onRemoveStock={handleDeselectStock}
                onView={() => setViewMode('grid')}
                onCompare={() => setViewMode('compare')}
              />
            )}

            {/* Comparison View */}
            {viewMode === 'compare' && selectedStocks.length > 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Timeframe Selector */}
                <div className="flex gap-2 bg-theme-surface border border-theme-border p-2 rounded-xl overflow-x-auto w-fit shadow-surface">
                  {['1D', '1W', '1M', '1Y', '5Y'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => setSelectedTimeframe(tf)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                        selectedTimeframe === tf
                          ? 'bg-trade-action text-white shadow-sm'
                          : 'text-content-secondary hover:text-content-primary hover:bg-theme-canvas'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Comparison Chart */}
                <ComparisonChart stocks={selectedStocks} timeframe={selectedTimeframe} />

                {/* Comparison Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-theme-surface border border-theme-border rounded-2xl shadow-surface overflow-hidden"
                >
                  <div className="p-6 border-b border-theme-border bg-theme-canvas">
                    <h2 className="text-xl font-bold text-content-primary">Comparison Table</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-theme-border bg-theme-canvas">
                          <th className="px-6 py-3 text-left text-xs font-bold tracking-widest uppercase text-content-secondary">Symbol</th>
                          <th className="px-6 py-3 text-left text-xs font-bold tracking-widest uppercase text-content-secondary">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-bold tracking-widest uppercase text-content-secondary">Change</th>
                          <th className="px-6 py-3 text-left text-xs font-bold tracking-widest uppercase text-content-secondary">Change %</th>
                          <th className="px-6 py-3 text-left text-xs font-bold tracking-widest uppercase text-content-secondary">Sector</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-border">
                        {selectedStocks.map(stock => (
                          <tr key={stock.symbol} className="hover:bg-theme-canvas transition-colors">
                            <td className="px-6 py-4 font-bold text-content-primary">{stock.symbol}</td>
                            <td className="px-6 py-4 text-content-primary font-semibold">₹{stock.price.toFixed(2)}</td>
                            <td className={`px-6 py-4 font-semibold ${stock.change >= 0 ? 'text-trade-gain' : 'text-trade-loss'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                            </td>
                            <td className={`px-6 py-4 font-bold ${stock.changePercent >= 0 ? 'text-trade-gain' : 'text-trade-loss'}`}>
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 text-content-secondary">{stock.sector}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenerCompare;
