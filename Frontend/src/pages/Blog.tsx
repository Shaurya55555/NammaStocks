import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Tag, 
  Search, 
  Code,
  TrendingUp,
  BookOpen,
  Plus,
  Construction,
  Sparkles
} from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Building a Stock Screener with React and TypeScript',
      excerpt: 'Learn how to create a powerful stock screening application using modern web technologies...',
      content: `
        // Example: Fetching stock data
        const fetchStockData = async (filters) => {
          const response = await fetch('/api/stocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filters)
          });
          return response.json();
        };
      `,
      author: 'Rahul Sharma',
      authorAvatar: 'RS',
      publishedAt: '2024-01-15',
      category: 'Tutorial',
      tags: ['React', 'TypeScript', 'Stock Analysis'],
      readTime: '8 min read',
      featured: true,
    },
    {
      id: 2,
      title: 'Understanding Market Volatility Through Data Visualization',
      excerpt: 'Explore how charts and graphs can help interpret market movements and volatility patterns...',
      content: `
        // D3.js example for candlestick chart
        const svg = d3.select('#chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height);
      `,
      author: 'Priya Patel',
      authorAvatar: 'PP',
      publishedAt: '2024-01-12',
      category: 'Analysis',
      tags: ['Data Viz', 'D3.js', 'Market Analysis'],
      readTime: '12 min read',
      featured: false,
    },
    {
      id: 3,
      title: 'API Design for Financial Data Applications',
      excerpt: 'Best practices for designing robust APIs that handle real-time financial data efficiently...',
      content: `
        // Express.js route example
        app.get('/api/stocks/:symbol', async (req, res) => {
          const { symbol } = req.params;
          const data = await getStockData(symbol);
          res.json(data);
        });
      `,
      author: 'Amit Kumar',
      authorAvatar: 'AK',
      publishedAt: '2024-01-10',
      category: 'Backend',
      tags: ['API', 'Node.js', 'Financial Data'],
      readTime: '10 min read',
      featured: false,
    },
    {
      id: 4,
      title: 'Machine Learning for Stock Price Prediction',
      excerpt: 'Implementing ML algorithms to predict stock movements using Python and TensorFlow...',
      content: `
        # Python ML example
        import tensorflow as tf
        from sklearn.preprocessing import MinMaxScaler
        
        model = tf.keras.Sequential([
          tf.keras.layers.LSTM(50, return_sequences=True),
          tf.keras.layers.LSTM(50),
          tf.keras.layers.Dense(1)
        ])
      `,
      author: 'Sneha Reddy',
      authorAvatar: 'SR',
      publishedAt: '2024-01-08',
      category: 'Machine Learning',
      tags: ['Python', 'TensorFlow', 'Prediction'],
      readTime: '15 min read',
      featured: true,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Posts', count: blogPosts.length },
    { id: 'tutorial', label: 'Tutorials', count: 1 },
    { id: 'analysis', label: 'Analysis', count: 1 },
    { id: 'backend', label: 'Backend', count: 1 },
    { id: 'machine-learning', label: 'ML/AI', count: 1 },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-theme-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-content-primary">
                Developer Blog
              </h1>
              <p className="text-content-secondary mt-2">Technical insights and tutorials for financial technology</p>
            </div>
            <Link
              to="/blog/new"
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-trade-gain to-emerald-600 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all hover:scale-105 mt-4 lg:mt-0 font-semibold text-sm shadow-sm shadow-trade-gain/20"
            >
              <Plus className="w-4 h-4" />
              <span>Write Article</span>
            </Link>
          </div>

          {/* 🚧 Work In Progress Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-amber-400/60 bg-gradient-to-r from-amber-950/80 via-yellow-900/70 to-orange-950/80 shadow-lg shadow-amber-500/10"
          >
            {/* Diagonal stripe pattern */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_20px,rgba(251,191,36,0.05)_20px,rgba(251,191,36,0.05)_40px)]" />
            <div className="relative flex items-center gap-4 px-6 py-4">
              <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40">
                <Construction className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-amber-300 font-bold text-sm tracking-wide uppercase">Work in Progress</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Releasing Soon
                  </span>
                </div>
                <p className="text-amber-200/80 text-sm leading-relaxed">
                  The blog is under active development. New articles, author profiles, and community features are being crafted. We’ll be publishing soon!
                </p>
              </div>
              <Sparkles className="flex-shrink-0 w-5 h-5 text-amber-400/60" />
            </div>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-theme-surface border border-theme-border rounded-xl focus:border-trade-action focus:ring-1 focus:ring-trade-action/20 focus:outline-none text-content-primary placeholder:text-content-secondary/60 transition-all"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm font-semibold ${
                    selectedCategory === category.id
                      ? 'bg-trade-action text-white shadow-sm shadow-trade-action/20'
                      : 'bg-theme-surface border border-theme-border text-content-secondary hover:border-trade-action/30 hover:text-trade-action'
                  }`}
                >
                  <span>{category.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-theme-canvas text-content-secondary'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && selectedCategory === 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-theme-surface rounded-2xl p-8 border border-theme-border shadow-surface"
            >
              <div className="flex items-center space-x-2 mb-5">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-600 font-semibold text-sm">Featured Article</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-content-primary mb-4">{featuredPost.title}</h2>
                  <p className="text-content-secondary mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center space-x-5 mb-6 flex-wrap gap-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{featuredPost.authorAvatar}</span>
                      </div>
                      <span className="text-content-secondary text-sm">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-content-secondary text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-content-secondary text-sm">{featuredPost.readTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-theme-canvas border border-theme-border text-content-secondary rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="px-6 py-2.5 bg-gradient-to-r from-trade-action to-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all font-semibold text-sm shadow-sm shadow-trade-action/20">
                    Read Article
                  </button>
                </div>
                
                {/* Code Preview */}
                <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 overflow-hidden">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center space-x-1.5 ml-2">
                      <Code className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-400 font-mono text-xs">Code Preview</span>
                    </div>
                  </div>
                  <pre className="text-green-400 text-xs overflow-x-auto font-mono leading-relaxed">
                    <code>{featuredPost.content}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-theme-surface border border-theme-border rounded-2xl hover:border-trade-action/30 hover:shadow-surface transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-trade-action to-blue-500 text-white rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                    <span className="text-content-secondary text-sm">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-lg font-bold text-content-primary mb-3 group-hover:text-trade-action transition-colors leading-snug">
                    {post.title}
                  </h2>
                  
                  <p className="text-content-secondary mb-4 line-clamp-3 text-sm leading-relaxed">{post.excerpt}</p>
                  
                  {/* Code Snippet */}
                  <div className="bg-gray-900 rounded-lg p-3 mb-4 border border-gray-700">
                    <div className="flex items-center space-x-1.5 mb-2">
                      <Code className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400 font-mono text-xs">Snippet</span>
                    </div>
                    <pre className="text-green-400 text-xs overflow-x-auto font-mono">
                      <code>{post.content.substring(0, 100)}...</code>
                    </pre>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-theme-border mt-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{post.authorAvatar}</span>
                      </div>
                      <div>
                        <p className="text-content-primary font-semibold text-sm">{post.author}</p>
                        <p className="text-content-secondary text-xs">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <button className="text-trade-action hover:text-blue-700 font-semibold text-sm transition-colors">
                      Read more →
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-theme-canvas border border-theme-border text-content-secondary rounded text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-theme-border mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-content-primary mb-2">No articles found</h3>
              <p className="text-content-secondary">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;