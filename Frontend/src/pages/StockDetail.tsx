import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  BarChart3,
  PieChart,
  Calendar,
  ExternalLink
} from 'lucide-react';
import StockHistoryCharts from '../components/CandlestickChart';
import KeyRatioCards from '../components/KeyRatioCards';
import NewsSection from '../components/NewsSection';
import { stocksApi } from '../api/Stocks';
import { useAuth } from '@clerk/clerk-react';
import { userManagementApi } from '../api/userManagement';
import { toast } from 'react-hot-toast';

const StockDetail = () => {
  const { symbol } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const [stockData, setStockData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { getToken } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isUpdatingWatchlist, setIsUpdatingWatchlist] = useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        if (token) {
          const profile = await userManagementApi.getProfile(token);
          setWatchlist(profile.watchlist || []);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, [getToken]);

  React.useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        // Append .NS if missing to fetch from yfinance properly for NSE stocks
        const querySymbol = symbol?.includes('.') ? symbol : `${symbol}.NS`;
        
        const response = await stocksApi.getStockInfo(querySymbol);
        const info = response.info;
        
        const price = info.currentPrice || info.regularMarketPrice || info.previousClose || 0;
        const previousClose = info.previousClose || price;
        const change = price - previousClose;
        const changePercent = previousClose ? (change / previousClose) * 100 : 0;
        
        setStockData({
          symbol: symbol || 'UNKNOWN',
          name: info.shortName || info.longName || symbol,
          price: price,
          change: change,
          changePercent: changePercent.toFixed(2),
          dayHigh: info.dayHigh || 0,
          dayLow: info.dayLow || 0,
          open: info.open || 0,
          previousClose: previousClose,
          volume: info.volume || 0,
          marketCap: info.marketCap || 0,
          pe: info.trailingPE || 0,
          pb: info.priceToBook || 0,
          dividend: info.dividendYield ? (info.dividendYield * 100).toFixed(2) : 0,
          bookValue: info.bookValue || 0,
          sector: info.sector || 'N/A',
          industry: info.industry || 'N/A',
          ceo: info.companyOfficers?.[0]?.name || 'N/A',
          founded: 'N/A', // yfinance doesn't consistently provide this
          employees: info.fullTimeEmployees?.toLocaleString() || 'N/A',
          headquarters: `${info.city || ''}, ${info.country || ''}`.trim().replace(/^,|,$/g, ''),
          eps: info.trailingEps || 0,
          roe: info.returnOnEquity ? `${(info.returnOnEquity * 100).toFixed(1)}%` : 'N/A',
          debtToEquity: info.debtToEquity ? (info.debtToEquity / 100).toFixed(2) : 'N/A',
          weekHigh52: info.fiftyTwoWeekHigh || 0,
          weekLow52: info.fiftyTwoWeekLow || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stock info", err);
      } finally {
        setLoading(false);
      }
    };
    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  if (loading) {
    return <div className="min-h-screen bg-theme-canvas flex items-center justify-center text-content-primary">Loading data...</div>;
  }

  if (!stockData) {
    return <div className="min-h-screen bg-theme-canvas flex items-center justify-center text-content-primary">Failed to load data.</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'financials', label: 'Financials', icon: PieChart },
    { id: 'news', label: 'News', icon: Calendar },
  ];

  const isInWatchlist = watchlist.includes(stockData.symbol);

  const toggleWatchlist = async () => {
    try {
      setIsUpdatingWatchlist(true);
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to add to watchlist');
        return;
      }
      
      let newWatchlist = [...watchlist];
      if (isInWatchlist) {
        newWatchlist = newWatchlist.filter(s => s !== stockData.symbol);
      } else {
        newWatchlist.push(stockData.symbol);
      }

      await userManagementApi.updateProfile(token, { watchlist: newWatchlist });
      setWatchlist(newWatchlist);
      toast.success(isInWatchlist ? 'Removed from Watchlist' : 'Added to Watchlist');
    } catch (err) {
      console.error('Failed to update watchlist', err);
      toast.error('Failed to update watchlist');
    } finally {
      setIsUpdatingWatchlist(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-canvas relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Stock Header */}
          <div className="bg-theme-surface rounded-3xl p-6 border border-theme-border shadow-surface">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-trade-action to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-trade-action/20">
                  <span className="text-white font-bold text-xl">
                    {stockData.symbol.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-content-primary">{stockData.symbol}</h1>
                  <p className="text-content-secondary font-medium">{stockData.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-theme-canvas border border-theme-border text-content-secondary rounded-md">
                      {stockData.sector}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-theme-canvas border border-theme-border text-content-secondary rounded-md">
                      {stockData.industry}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0 text-right">
                <div className="text-3xl font-black tracking-tight text-content-primary">
                  ₹{stockData.price.toLocaleString()}
                </div>
                <div className={`flex items-center justify-end space-x-2 mt-1 ${
                  stockData.change > 0 ? 'text-trade-gain' : 'text-trade-loss'
                }`}>
                  {stockData.change > 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span className="font-semibold">
                    {stockData.change > 0 ? '+' : ''}₹{stockData.change.toFixed(2)}
                  </span>
                  <span>
                    ({stockData.change > 0 ? '+' : ''}{stockData.changePercent}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'Open', value: `₹${stockData.open}` },
              { label: 'Day High', value: `₹${stockData.dayHigh}` },
              { label: 'Day Low', value: `₹${stockData.dayLow}` },
              { label: 'Volume', value: `${(stockData.volume / 100000).toFixed(1)}L` },
              { label: '52W High', value: `₹${stockData.weekHigh52}` },
              { label: '52W Low', value: `₹${stockData.weekLow52}` },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-theme-surface rounded-2xl p-4 border border-theme-border hover:border-trade-action/30 transition-all hover:shadow-surface"
              >
                <p className="text-content-secondary text-xs font-bold tracking-wider uppercase">{stat.label}</p>
                <p className="text-content-primary font-black text-lg mt-1 tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-theme-border">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-bold text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-trade-action text-trade-action'
                      : 'border-transparent text-content-secondary hover:text-content-primary'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'overview' && (
                <>
                  <StockHistoryCharts symbol={stockData.symbol} />
                  <KeyRatioCards data={stockData} />
                </>
              )}
              
              {activeTab === 'financials' && (
                <div className="bg-theme-surface rounded-3xl p-6 border border-theme-border shadow-surface">
                  <h3 className="text-xl font-bold text-content-primary mb-4">Financial Highlights</h3>
                  <div className="space-y-4">
                    <div className="text-content-secondary">
                      <p>Detailed financial data and analysis coming soon...</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'news' && <NewsSection symbol={stockData.symbol} />}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-theme-surface rounded-3xl p-6 border border-theme-border shadow-surface">
                <h3 className="text-lg font-bold text-content-primary mb-4">Company Info</h3>
                <div className="space-y-3 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-content-secondary">CEO</span>
                    <span className="text-content-primary font-bold">{stockData.ceo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-content-secondary">Founded</span>
                    <span className="text-content-primary font-bold">{stockData.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-content-secondary">Employees</span>
                    <span className="text-content-primary font-bold">{stockData.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-content-secondary">Headquarters</span>
                    <span className="text-content-primary font-bold">{stockData.headquarters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-content-secondary">Sector</span>
                    <span className="text-content-primary font-bold">{stockData.sector}</span>
                  </div>
                </div>
              </div>

              <div className="bg-theme-surface rounded-3xl p-6 border border-theme-border shadow-surface">
                <h3 className="text-lg font-bold text-content-primary mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={toggleWatchlist}
                    disabled={isUpdatingWatchlist}
                    className={`w-full px-4 py-2.5 font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 ${
                      isInWatchlist 
                        ? 'bg-theme-surface border-2 border-trade-gain text-trade-gain hover:bg-trade-gain/10'
                        : 'bg-gradient-to-r from-trade-gain to-emerald-600 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-trade-gain/20'
                    } ${isUpdatingWatchlist ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isUpdatingWatchlist ? 'Updating...' : isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>
                  <button className="w-full px-4 py-2.5 border border-theme-border text-content-primary font-semibold rounded-xl hover:bg-theme-canvas transition-colors">
                    Set Price Alert
                  </button>
                  <button className="w-full px-4 py-2.5 border border-theme-border text-content-primary font-semibold rounded-xl hover:bg-theme-canvas transition-colors flex items-center justify-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Company Website</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockDetail;