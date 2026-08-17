import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, ChevronDown, ChevronRight, BarChart3, Search, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import StockTable from '../components/StockTable';
import GhostCursor from '../components/GhostCursor';

const Screener = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stock/${searchQuery.toUpperCase()}`);
    }
  };

  const isDriveMode = searchParams.get('drive') === 'true';
  const targetAction = searchParams.get('target');
  const symbols = searchParams.get('symbols');

  const cursorSteps = isDriveMode && targetAction === 'compare' ? [
    {
      targetId: 'compare-btn',
      action: 'click' as const,
      delayBefore: 1500,
      onComplete: () => {
        setTimeout(() => {
          navigate(`/screener/compare?drive=true&symbols=${symbols}`);
        }, 800);
      }
    }
  ] : [];

  return (
    <div className="min-h-screen bg-theme-canvas relative">
      {isDriveMode && <GhostCursor steps={cursorSteps} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-content-primary">
                Stock Screener
              </h1>
              <p className="text-content-secondary mt-2 text-lg font-medium tracking-wide">Advanced filtering and analysis tools</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
              <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-content-secondary" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stock..."
                  className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-theme-surface border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-trade-action/50 focus:border-trade-action text-content-primary placeholder-content-secondary text-sm font-medium transition-all"
                />
              </form>
              <button
                id="compare-btn"
                onClick={() => navigate('/screener/compare')}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-trade-action to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all hover:scale-105 shadow-sm shadow-trade-action/20 font-semibold text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Compare Stocks</span>
              </button>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-theme-surface border border-theme-border rounded-xl hover:border-trade-action/30 transition-all text-content-secondary hover:text-content-primary font-semibold text-sm"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {isFilterOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-trade-gain to-emerald-600 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all hover:scale-105 shadow-sm shadow-trade-gain/20 font-semibold text-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Quick Filters Ribbon */}
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
            {['My Watchlist', 'Top Gainers', 'Volume Shockers', '52W High', 'Undervalued (P/E < 15)', 'High Dividend', 'Large Cap Tech', 'Oversold (RSI < 30)'].map((filter) => (
              <button 
                key={filter} 
                onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                className={`flex-shrink-0 px-4 py-2 border rounded-full text-sm font-semibold tracking-wide transition-all whitespace-nowrap shadow-surface ${
                  activeFilter === filter 
                    ? 'bg-trade-action border-trade-action text-white' 
                    : 'bg-theme-surface hover:bg-blue-50 border-theme-border hover:border-trade-action/40 text-content-secondary hover:text-trade-action'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Filter Panel - Sticky Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isFilterOpen ? 1 : 0,
                x: isFilterOpen ? 0 : -20,
                width: isFilterOpen ? 320 : 0
              }}
              className={`${isFilterOpen ? 'w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-24' : 'hidden'} transition-all`}
            >
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin pr-1 pb-8">
                <FilterPanel />
              </div>
            </motion.div>

            {/* Stock Table */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 w-full min-w-0 pb-8"
            >
              <StockTable showWatchlistOnly={activeFilter === 'My Watchlist'} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Screener;