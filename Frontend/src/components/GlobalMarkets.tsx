import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, TrendingUp, TrendingDown, CircleDollarSign } from 'lucide-react';
import { dashboardApi } from '../api/Dashboard';

const GlobalMarkets = ({ data = {} }: { data?: Record<string, any[]> }) => {
  const [selectedRegion, setSelectedRegion] = useState('USA');
  const marketData = data;



  const getIcon = (region: string) => {
    if (region === 'Commodities') return CircleDollarSign;
    return Globe;
  }

  const currentData = marketData[selectedRegion] || [];
  const Icon = getIcon(selectedRegion);

  return (
    <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-surface flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-trade-action/10 border border-trade-action/20">
            <Icon className="w-5 h-5 text-trade-action" />
          </div>
          <div>
            <h2 className="font-bold text-content-primary leading-none">Global Data</h2>
          </div>
        </div>
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-theme-canvas border border-theme-border text-xs font-bold text-content-primary rounded-lg px-2 py-1 outline-none focus:border-trade-action cursor-pointer"
        >
          {Object.keys(marketData).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRegion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 overflow-y-auto scrollbar-thin"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3 pb-2">
              {currentData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 rounded-2xl bg-theme-canvas border border-theme-border hover:border-trade-action/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${item.positive ? 'bg-trade-gain/10 text-trade-gain' : 'bg-trade-loss/10 text-trade-loss'}`}>
                      {item.positive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-content-secondary tracking-wider uppercase">{item.name}</p>
                      <p className="text-lg font-black text-content-primary leading-tight mt-0.5">{item.value}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between h-full py-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg self-end ${item.positive ? 'bg-trade-gain/10 text-trade-gain' : 'bg-trade-loss/10 text-trade-loss'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlobalMarkets;
