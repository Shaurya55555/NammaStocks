import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  publisher: string;
  link: string;
  published_at: string;
  thumbnail_url: string;
}

const CATEGORIES = [
  "NSE", 
  "BSE", 
  "Indian Tax", 
  "Indian Business", 
  "Government", 
  "Geopolitics"
];

export default function News() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  const fetchNews = async (category: string) => {
    setLoading(true);
    setCurrentIndex(0);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/news/${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load news for ' + category);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < news.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const currentNews = news[currentIndex];

  return (
    <div className="h-full flex flex-col bg-theme-canvas overflow-hidden">
      {/* Categories Header */}
      <div className="w-full bg-theme-surface/80 backdrop-blur-md border-b border-theme-border p-4 overflow-x-auto shrink-0 flex items-center gap-2 hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (activeCategory !== cat) {
                setDirection(1); // arbitrary direction on category change
                setActiveCategory(cat);
              }
            }}
            className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-theme-surface border border-theme-border text-content-secondary hover:text-content-primary hover:border-theme-border-hover'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-content-secondary animate-pulse">Fetching latest updates...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center p-8 bg-theme-surface border border-theme-border rounded-2xl shadow-surface max-w-md w-full">
            <p className="text-content-secondary mb-2">No news found for this category.</p>
            <p className="text-xs text-content-tertiary">Try a different category or check back later.</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl h-[80vh] min-h-[500px] relative flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full h-full bg-theme-surface rounded-3xl overflow-hidden shadow-2xl border border-theme-border flex flex-col"
              >
                {/* Image Section */}
                <div className="h-2/5 w-full bg-theme-canvas relative shrink-0">
                  {currentNews.thumbnail_url ? (
                    <img 
                      src={currentNews.thumbnail_url} 
                      alt={currentNews.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                         // Fallback if image fails to load
                         (e.target as HTMLImageElement).style.display = 'none';
                         (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 ${currentNews.thumbnail_url ? 'hidden' : ''}`}>
                     <div className="text-6xl opacity-20">📰</div>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {activeCategory}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col relative overflow-hidden bg-gradient-to-b from-theme-surface to-theme-canvas">
                  <div className="flex items-center gap-3 text-xs text-content-tertiary mb-3">
                    <span className="font-semibold text-blue-500 uppercase tracking-wide">
                      {currentNews.publisher}
                    </span>
                    {currentNews.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(currentNews.published_at).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-content-primary mb-4 leading-tight">
                    {currentNews.title}
                  </h2>
                  
                  <div className="text-content-secondary text-base sm:text-lg leading-relaxed flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {currentNews.description || "No detailed summary available. Click 'Read more' to view the full article."}
                  </div>

                  <div className="mt-6 pt-4 border-t border-theme-border/50 shrink-0 flex items-center justify-between">
                    <a 
                      href={currentNews.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all group"
                    >
                      Read full article
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                    
                    <div className="text-sm text-content-tertiary">
                      {currentIndex + 1} of {news.length}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons (Desktop) */}
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="absolute left-[-2rem] md:left-[-4rem] p-3 rounded-full bg-theme-surface border border-theme-border text-content-secondary hover:text-blue-500 hover:border-blue-500 shadow-lg transition-all disabled:opacity-0 z-10"
              aria-label="Previous News"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === news.length - 1}
              className="absolute right-[-2rem] md:right-[-4rem] p-3 rounded-full bg-theme-surface border border-theme-border text-content-secondary hover:text-blue-500 hover:border-blue-500 shadow-lg transition-all disabled:opacity-0 z-10"
              aria-label="Next News"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}} />
    </div>
  );
}
