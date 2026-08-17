import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MarketOverview = () => {
  const marketData = [
    {
      title: 'NIFTY 50',
      value: '19,674.25',
      change: '+247.85',
      percentage: '+1.28%',
      positive: true,
      icon: TrendingUp,
    },
    {
      title: 'SENSEX',
      value: '66,023.69',
      change: '+834.16',
      percentage: '+1.28%',
      positive: true,
      icon: TrendingUp,
    },
    {
      title: 'BANK NIFTY',
      value: '44,856.30',
      change: '-156.75',
      percentage: '-0.35%',
      positive: false,
      icon: TrendingDown,
    },
    {
      title: 'VIX',
      value: '13.42',
      change: '+0.87',
      percentage: '+6.95%',
      positive: true,
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full content-start">
      {marketData.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.07 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-theme-canvas border border-theme-border hover:border-trade-action/30 hover:bg-blue-50/50 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${item.positive ? 'bg-trade-gain/10 text-trade-gain' : 'bg-trade-loss/10 text-trade-loss'}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-content-secondary tracking-wider uppercase">{item.title}</p>
              <p className="text-lg md:text-xl font-black tracking-tight text-content-primary">{item.value}</p>
            </div>
          </div>
          <div className="text-right flex flex-col justify-between h-full py-1">
            <span className={`text-xs font-bold px-2 py-1 rounded-lg self-end ${item.positive ? 'bg-trade-gain/10 text-trade-gain' : 'bg-trade-loss/10 text-trade-loss'}`}>
              {item.percentage}
            </span>
            <p className={`text-xs mt-2 font-bold ${item.positive ? 'text-trade-gain' : 'text-trade-loss'}`}>{item.change}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MarketOverview;