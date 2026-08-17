import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

const FilterPanel = () => {
  const [openSections, setOpenSections] = useState({
    price: true,
    marketCap: true,
    ratios: true,
    technical: false,
    fundamental: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const FilterSection = ({ title, isOpen, onToggle, children }: any) => (
    <div className="border-b border-theme-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-theme-canvas transition-colors"
      >
        <span className="text-content-primary font-semibold tracking-wide text-sm">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-trade-action" /> : <ChevronRight className="w-4 h-4 text-content-secondary" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 space-y-4">
          {children}
        </div>
      </motion.div>
    </div>
  );

  const RangeInput = ({ label }: any) => (
    <div>
      <label className="block text-xs font-semibold tracking-wider uppercase text-content-secondary mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="Min"
          className="w-full px-3 py-2 bg-theme-canvas border border-theme-border rounded-lg focus:border-trade-action focus:ring-1 focus:ring-trade-action/20 focus:outline-none text-content-primary text-sm transition-all placeholder:text-content-secondary/50"
        />
        <span className="text-content-secondary font-medium">–</span>
        <input
          type="number"
          placeholder="Max"
          className="w-full px-3 py-2 bg-theme-canvas border border-theme-border rounded-lg focus:border-trade-action focus:ring-1 focus:ring-trade-action/20 focus:outline-none text-content-primary text-sm transition-all placeholder:text-content-secondary/50"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-theme-surface border border-theme-border rounded-3xl shadow-surface overflow-hidden">
      <div className="p-5 border-b border-theme-border bg-theme-canvas">
        <h2 className="text-base font-bold text-content-primary tracking-wide">Filters</h2>
      </div>

      <div className="divide-y divide-theme-border">
        <FilterSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <RangeInput label="Price (₹)" />
        </FilterSection>

        <FilterSection
          title="Market Cap"
          isOpen={openSections.marketCap}
          onToggle={() => toggleSection('marketCap')}
        >
          <RangeInput label="Market Cap (Cr)" />
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-content-secondary mb-2">Category</label>
            <select className="w-full px-3 py-2 bg-theme-canvas border border-theme-border rounded-lg focus:border-trade-action focus:ring-1 focus:ring-trade-action/20 focus:outline-none text-content-primary text-sm transition-all">
              <option value="">All</option>
              <option value="large">Large Cap</option>
              <option value="mid">Mid Cap</option>
              <option value="small">Small Cap</option>
            </select>
          </div>
        </FilterSection>

        <FilterSection
          title="Valuation Ratios"
          isOpen={openSections.ratios}
          onToggle={() => toggleSection('ratios')}
        >
          <RangeInput label="P/E Ratio" />
          <RangeInput label="P/B Ratio" />
          <RangeInput label="Debt to Equity" />
        </FilterSection>

        <FilterSection
          title="Technical Indicators"
          isOpen={openSections.technical}
          onToggle={() => toggleSection('technical')}
        >
          <RangeInput label="RSI" />
          <RangeInput label="Volume (Lakhs)" />
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-content-secondary mb-2">Moving Averages</label>
            <div className="space-y-3">
              {['Above 20 DMA', 'Above 50 DMA', 'Above 200 DMA'].map((option) => (
                <label key={option} className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center justify-center w-4 h-4 mr-3 border border-theme-border rounded bg-theme-canvas group-hover:border-trade-action transition-colors">
                    <input type="checkbox" className="absolute opacity-0 cursor-pointer w-full h-full" />
                  </div>
                  <span className="text-sm font-medium text-content-secondary group-hover:text-content-primary transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Fundamental Metrics"
          isOpen={openSections.fundamental}
          onToggle={() => toggleSection('fundamental')}
        >
          <RangeInput label="ROE (%)" />
          <RangeInput label="Revenue Growth (%)" />
          <RangeInput label="Profit Growth (%)" />
        </FilterSection>
      </div>

      <div className="p-5 border-t border-theme-border bg-theme-canvas">
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-2.5 bg-trade-action text-white rounded-xl hover:bg-blue-700 transition-all font-bold tracking-wide shadow-sm shadow-trade-action/20 text-sm">
            Apply Filters
          </button>
          <button className="px-4 py-2.5 bg-theme-surface border border-theme-border text-content-secondary rounded-xl hover:border-trade-action/30 hover:text-content-primary transition-all font-semibold tracking-wide text-sm">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;