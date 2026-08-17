import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface StockSelectorProps {
  availableStocks: Stock[];
  selectedStocks: Stock[];
  onSelect: (stock: Stock) => void;
  onDeselect: (symbol: string) => void;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  availableStocks,
  selectedStocks,
  onSelect,
  onDeselect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('');

  const selectedSymbols = new Set(selectedStocks.map(s => s.symbol));

  const filteredStocks = availableStocks.filter(stock => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = !filterSector || stock.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  const sectors = Array.from(new Set(availableStocks.map(s => s.sector)));

  const handleToggle = (stock: Stock) => {
    if (selectedSymbols.has(stock.symbol)) {
      onDeselect(stock.symbol);
    } else {
      onSelect(stock);
    }
  };

  return (
    <div className="bg-theme-surface rounded-2xl border border-theme-border p-6 shadow-surface">
      <h2 className="text-lg font-semibold text-content-primary mb-4">Select Stocks</h2>

      {/* Search and Filter */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-content-secondary" />
          <input
            type="text"
            placeholder="Search by symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-theme-canvas border border-theme-border rounded-lg focus:border-trade-action focus:ring-1 focus:ring-trade-action/20 focus:outline-none text-content-primary placeholder:text-content-secondary/60"
          />
        </div>

        {/* Sector Filter */}
        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="w-full px-4 py-2 bg-theme-canvas border border-theme-border rounded-lg focus:border-trade-action focus:ring-1 focus:ring-trade-action/20 focus:outline-none text-content-primary cursor-pointer"
        >
          <option value="">All Sectors</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      {/* Stock List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredStocks.length === 0 ? (
          <p className="text-content-secondary text-sm py-4 text-center">No stocks found</p>
        ) : (
          filteredStocks.map(stock => (
            <motion.button
              key={stock.symbol}
              whileHover={{ x: 4 }}
              onClick={() => handleToggle(stock)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                selectedSymbols.has(stock.symbol)
                  ? 'bg-trade-action/10 border-trade-action text-trade-action'
                  : 'bg-theme-canvas border-theme-border text-content-secondary hover:border-trade-action/30 hover:text-content-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedSymbols.has(stock.symbol) && (
                  <Check className="w-4 h-4 text-trade-action" />
                )}
                <div className="text-left">
                  <p className="font-semibold text-sm">{stock.symbol}</p>
                  <p className="text-xs opacity-70">{stock.sector}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">₹{stock.price.toFixed(2)}</p>
                <p className={`text-xs font-semibold ${stock.change >= 0 ? 'text-trade-gain' : 'text-trade-loss'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* Selection Summary */}
      {selectedStocks.length > 0 && (
        <div className="mt-4 p-3 bg-trade-action/5 border border-trade-action/20 rounded-lg">
          <p className="text-sm font-semibold text-trade-action">
            {selectedStocks.length} stock{selectedStocks.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default StockSelector;
