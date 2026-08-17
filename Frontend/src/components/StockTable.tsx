import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpDown, TrendingUp, TrendingDown, Star, Loader2 } from 'lucide-react';
import { stocksApi } from '../api/Stocks';
import { useAuth } from '@clerk/clerk-react';
import { userManagementApi } from '../api/userManagement';
import { toast } from 'react-hot-toast';

const DEFAULT_STOCKS = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    volume: 45.67,
    marketCap: 1923456,
    pe: 24.5,
    pb: 2.1,
    sector: 'Oil & Gas',
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    volume: 23.45,
    marketCap: 1234567,
    pe: 28.9,
    pb: 12.4,
    sector: 'IT',
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    volume: 67.89,
    marketCap: 987654,
    pe: 18.7,
    pb: 2.8,
    sector: 'Banking',
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    volume: 34.56,
    marketCap: 567890,
    pe: 22.1,
    pb: 8.9,
    sector: 'IT',
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Limited',
    volume: 89.12,
    marketCap: 654321,
    pe: 16.5,
    pb: 2.3,
    sector: 'Banking',
  },
];

interface StockTableProps {
  showWatchlistOnly?: boolean;
}

const StockTable = ({ showWatchlistOnly = false }: StockTableProps) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { getToken } = useAuth();
  
  // Refetch watchlist profile when needed
  const fetchProfile = async () => {
    try {
      const token = await getToken();
      if (token) {
        const profile = await userManagementApi.getProfile(token);
        setWatchlist(profile.watchlist || []);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setProfileLoaded(true);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [getToken]);

  useEffect(() => {
    if (!profileLoaded) return;

    const fetchStocks = async () => {
      setLoading(true);
      try {
        // Combine DEFAULT_STOCKS with watchlist symbols
        const uniqueSymbols = Array.from(new Set([
          ...DEFAULT_STOCKS.map(s => s.symbol),
          ...watchlist
        ]));

        const querySymbols = uniqueSymbols.map(s => s.includes('.') ? s : `${s}.NS`);
        const res = await stocksApi.getMarketSummary(querySymbols);
        const fetchedStocks: any[] = [];
        
        uniqueSymbols.forEach((sym) => {
          const querySymbol = sym.includes('.') ? sym : `${sym}.NS`;
          const summary = res?.[querySymbol];
          const defStock = DEFAULT_STOCKS.find(s => s.symbol === sym);
          
          // Generate a random-ish volume/marketcap if not available
          const fallbackVolume = Math.floor(Math.random() * 50) + 10;
          const fallbackCap = Math.floor(Math.random() * 500000) + 10000;
          
          fetchedStocks.push({
            symbol: sym,
            name: summary?.name || defStock?.name || sym,
            price: summary?.price || 0,
            change: summary?.change || 0,
            changePercent: summary?.changePercent || 0,
            volume: defStock?.volume || (summary?.volume ? (summary.volume / 100000).toFixed(2) : fallbackVolume),
            marketCap: defStock?.marketCap || fallbackCap,
            pe: defStock?.pe || summary?.pe || 'N/A',
            pb: defStock?.pb || 'N/A',
            sector: defStock?.sector || 'N/A',
          });
        });
        
        setStocks(fetchedStocks);
      } catch (err) {
        console.error("Failed to fetch market summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, [profileLoaded]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedStocks = [...stocks]
    .filter(stock => showWatchlistOnly ? watchlist.includes(stock.symbol) : true)
    .sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleToggleWatchlist = async (e: React.MouseEvent, symbol: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to modify watchlist');
        return;
      }
      
      const isInWatchlist = watchlist.includes(symbol);
      let newWatchlist = [...watchlist];
      if (isInWatchlist) {
        newWatchlist = newWatchlist.filter(s => s !== symbol);
      } else {
        newWatchlist.push(symbol);
      }
      
      await userManagementApi.updateProfile(token, { watchlist: newWatchlist });
      setWatchlist(newWatchlist);
      toast.success(isInWatchlist ? 'Removed from Watchlist' : 'Added to Watchlist');
    } catch (err) {
      console.error('Failed to update watchlist', err);
      toast.error('Failed to update watchlist');
    }
  };

  const TableHeader = ({ label, sortKey, className = '' }: any) => (
    <th
      className={`px-6 py-4 text-left cursor-pointer hover:bg-blue-50/60 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1 group">
        <span className="text-xs font-bold tracking-widest uppercase text-content-secondary group-hover:text-trade-action transition-colors">{label}</span>
        <ArrowUpDown className="w-3.5 h-3.5 text-theme-border group-hover:text-trade-action transition-colors" />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-theme-surface border border-theme-border rounded-3xl shadow-surface h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-trade-action animate-spin" />
        <span className="ml-3 text-content-primary font-bold">Loading screened stocks...</span>
      </div>
    );
  }

  return (
    <div className="bg-theme-surface border border-theme-border rounded-3xl shadow-surface overflow-hidden">
      <div className="p-6 border-b border-theme-border bg-theme-canvas">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-content-primary tracking-wide">Screened Stocks</h2>
          <span className="text-sm font-semibold tracking-widest uppercase text-content-secondary bg-theme-surface border border-theme-border px-3 py-1 rounded-full">{stocks.length} results</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-theme-canvas border-b border-theme-border">
            <tr>
              <TableHeader label="Stock" sortKey="name" />
              <TableHeader label="Price" sortKey="price" />
              <TableHeader label="Change" sortKey="change" />
              <TableHeader label="Volume" sortKey="volume" />
              <TableHeader label="Market Cap" sortKey="marketCap" />
              <TableHeader label="P/E" sortKey="pe" />
              <TableHeader label="P/B" sortKey="pb" />
              <TableHeader label="Sector" sortKey="sector" />
              <th className="px-6 py-4 text-right">
                <span className="text-xs font-bold tracking-widest uppercase text-content-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border">
            {sortedStocks.map((stock, index) => (
              <motion.tr
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-theme-canvas transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div>
                    <Link
                      to={`/stock/${stock.symbol}`}
                      className="text-content-primary font-bold group-hover:text-trade-action transition-colors"
                    >
                      {stock.symbol}
                    </Link>
                    <p className="text-xs font-medium text-content-secondary mt-0.5 tracking-wide">{stock.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-content-primary font-bold tracking-wide">₹{stock.price.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded-md ${stock.change >= 0 ? 'bg-trade-gain/10' : 'bg-trade-loss/10'}`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-trade-gain" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-trade-loss" />
                      )}
                    </div>
                    <div className={`${stock.change >= 0 ? 'text-trade-gain' : 'text-trade-loss'}`}>
                      <p className="font-bold tracking-wide">
                        {stock.change > 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                      </p>
                      <p className={`text-xs font-semibold px-1.5 py-0.5 mt-0.5 rounded-md inline-block ${stock.change >= 0 ? 'bg-trade-gain/10' : 'bg-trade-loss/10'}`}>
                        {stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-content-secondary font-medium">{stock.volume}L</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-content-secondary font-medium">₹{(stock.marketCap / 100).toLocaleString()}Cr</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-content-secondary font-medium">{stock.pe}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-content-secondary font-medium">{stock.pb}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase bg-theme-canvas text-content-secondary rounded-lg border border-theme-border group-hover:border-trade-action/30 transition-colors">
                    {stock.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={(e) => handleToggleWatchlist(e, stock.symbol)}
                    className="p-2 bg-theme-canvas hover:bg-blue-50 border border-theme-border rounded-xl transition-colors group/star"
                  >
                    <Star className={`w-4 h-4 transition-colors ${
                      watchlist.includes(stock.symbol) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-content-secondary group-hover/star:text-yellow-500'
                    }`} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;