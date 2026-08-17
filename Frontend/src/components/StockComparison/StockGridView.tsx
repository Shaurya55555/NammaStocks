import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import StockMiniCard from './StockMiniCard';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface StockGridViewProps {
  selectedStocks: Stock[];
  onRemoveStock: (symbol: string) => void;
  onCompare: () => void;
  onView: () => void;
}

const StockGridView: React.FC<StockGridViewProps> = ({
  selectedStocks,
  onRemoveStock,
  onCompare,
  onView,
}) => {
  if (selectedStocks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-theme-canvas rounded-2xl border-2 border-dashed border-theme-border">
        <div className="text-center">
          <p className="text-content-primary text-lg mb-2 font-semibold">No stocks selected</p>
          <p className="text-content-secondary text-sm">Select stocks from the screener to view or compare them</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-theme-surface p-4 rounded-xl border border-theme-border shadow-surface">
        <div>
          <h2 className="text-xl font-semibold text-content-primary">
            Selected Stocks ({selectedStocks.length})
          </h2>
          <p className="text-content-secondary text-sm mt-1">
            {selectedStocks.map(s => s.symbol).join(', ')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="px-4 py-2 bg-theme-canvas border border-theme-border text-content-secondary hover:text-trade-action hover:border-trade-action/30 rounded-lg font-medium transition-colors shadow-sm"
          >
            View Details
          </button>
          {selectedStocks.length > 1 && (
            <button
              onClick={onCompare}
              className="px-4 py-2 bg-trade-action hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Compare
            </button>
          )}
        </div>
      </div>

      {/* Grid View of Stocks - 2 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedStocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <button
              onClick={() => onRemoveStock(stock.symbol)}
              className="absolute top-2 right-2 z-10 p-1 bg-trade-loss/10 hover:bg-trade-loss text-trade-loss hover:text-white rounded-full transition-colors"
              title="Remove stock"
            >
              <X className="w-4 h-4" />
            </button>
            <StockMiniCard stock={stock} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StockGridView;
