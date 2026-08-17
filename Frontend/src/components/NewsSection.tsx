import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, ChevronDown } from 'lucide-react';

const NewsSection = ({ symbol }: { symbol: string }) => {
  const [visibleNews, setVisibleNews] = useState(5);

  const newsItems = [
    {
      id: 1,
      title: 'Reliance Industries announces Q4 results, beats estimates',
      summary: 'The company reported strong quarterly earnings with revenue growth of 12% YoY...',
      source: 'Economic Times',
      timestamp: '2 hours ago',
      category: 'Earnings',
      url: '#',
    },
    {
      id: 2,
      title: 'New renewable energy project approved by board',
      summary: 'RIL board approves ₹45,000 crore investment in solar and wind energy projects...',
      source: 'Business Standard',
      timestamp: '4 hours ago',
      category: 'Corporate Action',
      url: '#',
    },
    {
      id: 3,
      title: 'Analysts upgrade target price following strong performance',
      summary: 'Multiple brokerages raise target price citing improved operational metrics...',
      source: 'MoneyControl',
      timestamp: '6 hours ago',
      category: 'Analyst Note',
      url: '#',
    },
    {
      id: 4,
      title: 'Partnership announced with international tech giant',
      summary: 'Strategic alliance to develop next-generation digital solutions...',
      source: 'LiveMint',
      timestamp: '1 day ago',
      category: 'Partnership',
      url: '#',
    },
    {
      id: 5,
      title: 'Expansion into new geographic markets approved',
      summary: 'Company plans to establish presence in Southeast Asian markets...',
      source: 'Financial Express',
      timestamp: '1 day ago',
      category: 'Expansion',
      url: '#',
    },
    {
      id: 6,
      title: 'Dividend declaration for current financial year',
      summary: 'Board declares final dividend of ₹8 per share for FY24...',
      source: 'Economic Times',
      timestamp: '2 days ago',
      category: 'Dividend',
      url: '#',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Earnings': 'bg-trade-gain text-white',
      'Corporate Action': 'bg-trade-action text-white',
      'Analyst Note': 'bg-purple-500 text-white',
      'Partnership': 'bg-orange-500 text-white',
      'Expansion': 'bg-cyan-500 text-white',
      'Dividend': 'bg-emerald-500 text-white',
    };
    return colors[category] || 'bg-content-secondary text-white';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-content-primary">Latest News</h2>
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-4 h-4 text-trade-action" />
          <span className="text-xs text-content-secondary">Real-time updates</span>
        </div>
      </div>

      <div className="space-y-3">
        {newsItems.slice(0, visibleNews).map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="p-4 bg-theme-canvas border border-theme-border rounded-xl hover:border-trade-action/30 hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${getCategoryColor(news.category)}`}>
                  {news.category}
                </span>
                <span className="text-xs text-content-secondary">{news.timestamp}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-content-secondary group-hover:text-trade-action transition-colors flex-shrink-0 mt-0.5" />
            </div>
            
            <h3 className="text-content-primary font-semibold text-sm mb-1.5 group-hover:text-trade-action transition-colors leading-snug">
              {news.title}
            </h3>
            
            <p className="text-content-secondary text-xs mb-2.5 line-clamp-2 leading-relaxed">
              {news.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-content-secondary font-medium">{news.source}</span>
              <button className="text-xs text-trade-action hover:text-blue-700 transition-colors font-semibold">
                Read more
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {visibleNews < newsItems.length && (
        <div className="text-center mt-4">
          <button
            onClick={() => setVisibleNews(prev => prev + 3)}
            className="flex items-center space-x-2 mx-auto px-4 py-2 bg-theme-canvas border border-theme-border text-content-secondary rounded-xl hover:border-trade-action/30 hover:text-trade-action transition-all text-sm font-medium"
          >
            <span>Load more news</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsSection;