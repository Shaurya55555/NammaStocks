import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, BarChart3 } from 'lucide-react';

const KeyRatioCards = ({ data }: any) => {
  const ratios = [
    {
      title: 'Market Cap',
      value: (data.marketCap / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      prefix: '₹',
      suffix: 'Cr',
      icon: DollarSign,
      trend: 'positive',
      description: 'Total market value',
    },
    {
      title: 'Price to Earnings (P/E)',
      value: typeof data.pe === 'number' ? data.pe.toFixed(2) : Number(data.pe || 0).toFixed(2),
      suffix: 'x',
      icon: BarChart3,
      trend: 'neutral',
      description: 'Current P/E ratio',
    },
    {
      title: 'Price to Book (P/B)',
      value: typeof data.pb === 'number' ? data.pb.toFixed(2) : Number(data.pb || 0).toFixed(2),
      suffix: 'x',
      icon: PieChart,
      trend: 'neutral',
      description: 'Price relative to book value',
    },
    {
      title: 'Dividend Yield',
      value: data.dividend,
      suffix: '%',
      icon: TrendingUp,
      trend: 'positive',
      description: 'Annual dividend yield',
    },
    {
      title: 'Return on Equity (ROE)',
      value: data.roe,
      icon: Activity,
      trend: 'positive',
      description: 'Net income returned as equity',
    },
    {
      title: 'Earnings Per Share (EPS)',
      value: typeof data.eps === 'number' ? data.eps.toFixed(2) : Number(data.eps || 0).toFixed(2),
      prefix: '₹',
      icon: TrendingUp,
      trend: 'positive',
      description: 'Profit allocated to each share',
    },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive': return 'text-trade-gain';
      case 'negative': return 'text-trade-loss';
      default: return 'text-blue-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return TrendingUp;
      case 'negative': return TrendingDown;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-content-primary">Key Ratios & Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ratios.map((ratio, index) => {
          const TrendIcon = getTrendIcon(ratio.trend);
          
          return (
            <motion.div
              key={ratio.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-theme-surface rounded-3xl p-6 border border-theme-border hover:border-trade-action/30 transition-all shadow-surface hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-theme-canvas border border-theme-border`}>
                  <ratio.icon className={`w-6 h-6 ${getTrendColor(ratio.trend)}`} />
                </div>
                <TrendIcon className={`w-5 h-5 ${getTrendColor(ratio.trend)}`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-content-secondary">{ratio.title}</h3>
                <div className="flex items-baseline space-x-1 flex-wrap overflow-hidden">
                  {ratio.prefix && (
                    <span className="text-lg font-black text-content-primary">{ratio.prefix}</span>
                  )}
                  <span className="text-2xl font-black text-content-primary tracking-tight truncate">{ratio.value}</span>
                  {ratio.suffix && (
                    <span className="text-lg font-black text-content-primary">{ratio.suffix}</span>
                  )}
                </div>
                <p className="text-xs text-content-secondary font-medium">{ratio.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyRatioCards;