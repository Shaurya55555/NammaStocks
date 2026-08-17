import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  Globe, 
  Factory, 
  Users, 
  FileText, 
  ExternalLink,
  Share2,
  Mail,
  Download,
  Bookmark,
  Clock,
  Building,
  Zap,
  BarChart3,
  AlertCircle,
  Target
} from 'lucide-react';

const TextileInsights = () => {
  const [activeSection, setActiveSection] = useState('');
  const [expandedNews, setExpandedNews] = useState<number[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const toggleNewsExpansion = (id: number) => {
    setExpandedNews(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const tableOfContents = [
    { id: 'news', title: 'Latest News & Updates', icon: Calendar },
    { id: 'predictions', title: 'Expert Predictions', icon: TrendingUp },
    { id: 'segments', title: 'Industry Segments Analysis', icon: BarChart3 },
    { id: 'innovation', title: 'Manufacturing & Innovation', icon: Factory },
    { id: 'politics', title: 'Global Politics & Trade Impact', icon: Globe },
    { id: 'startups', title: 'Upcoming Companies & Startups', icon: Zap },
    { id: 'research', title: 'Research & Market Trends', icon: FileText },
    { id: 'regulation', title: 'Taxation & Regulatory Updates', icon: AlertCircle },
  ];

  const latestNews = [
    {
      id: 1,
      headline: "India's Textile Exports Surge 15% in Q4 2024 Amid Global Demand Recovery",
      date: "2024-01-18",
      summary: "Indian textile manufacturers report strongest quarterly growth in two years, driven by increased demand from European and US markets. The surge is attributed to improved supply chain efficiency and competitive pricing strategies.",
      source: "Textile Today",
      category: "Market Growth",
      readTime: "3 min read"
    },
    {
      id: 2,
      headline: "Reliance Industries Acquires Sustainable Fabric Startup for $120M",
      date: "2024-01-15",
      summary: "The acquisition strengthens Reliance's position in eco-friendly textiles, adding innovative recycled fiber technology to their portfolio. The startup's patented process converts plastic waste into high-quality textile fibers.",
      source: "Economic Times",
      category: "M&A Activity",
      readTime: "4 min read"
    },
    {
      id: 3,
      headline: "EU Implements New Textile Waste Regulations Affecting Asian Exporters",
      date: "2024-01-12",
      summary: "New European Union regulations require textile manufacturers to meet stricter sustainability standards by 2025. Asian exporters are investing heavily in compliance infrastructure to maintain market access.",
      source: "Trade Weekly",
      category: "Regulation",
      readTime: "5 min read"
    },
    {
      id: 4,
      headline: "AI-Powered Quality Control Systems Reduce Defects by 40% in Textile Manufacturing",
      date: "2024-01-10",
      summary: "Leading textile manufacturers report significant quality improvements after implementing machine learning-based inspection systems. The technology identifies defects in real-time, reducing waste and improving efficiency.",
      source: "Manufacturing Today",
      category: "Technology",
      readTime: "4 min read"
    },
    {
      id: 5,
      headline: "Cotton Prices Hit 18-Month High Amid Supply Chain Disruptions",
      date: "2024-01-08",
      summary: "Global cotton prices surge due to weather-related crop damage in major producing regions and ongoing logistics challenges. Textile manufacturers are exploring alternative fiber sources to manage costs.",
      source: "Commodity Insights",
      category: "Raw Materials",
      readTime: "3 min read"
    },
    {
      id: 6,
      headline: "Sustainable Fashion Movement Drives $2.3B Investment in Green Textile Technologies",
      date: "2024-01-05",
      summary: "Venture capital firms and corporate investors pour record funding into sustainable textile innovations. Key areas include bio-based fibers, waterless dyeing processes, and circular economy solutions.",
      source: "Green Business Journal",
      category: "Sustainability",
      readTime: "6 min read"
    }
  ];

  const expertPredictions = [
    {
      expert: "Dr. Priya Sharma",
      title: "Chief Textile Analyst",
      company: "McKinsey & Company",
      prediction: "The textile industry will see a 25% shift towards sustainable materials by 2026, driven by consumer demand and regulatory pressure. Companies investing in green technologies now will capture significant market share.",
      confidence: "High",
      timeframe: "2024-2026"
    },
    {
      expert: "Rajesh Kumar",
      title: "Managing Director",
      company: "Textile Innovation Labs",
      prediction: "Automation will replace 30% of manual processes in textile manufacturing within the next 3 years. However, this will create new high-skilled jobs in technology and quality control sectors.",
      confidence: "Medium-High",
      timeframe: "2024-2027"
    },
    {
      expert: "Sarah Chen",
      title: "Senior Market Strategist",
      company: "Goldman Sachs",
      prediction: "Asian textile markets will consolidate significantly, with top 10 companies controlling 60% of market share by 2028. M&A activity will accelerate as smaller players seek scale advantages.",
      confidence: "High",
      timeframe: "2024-2028"
    },
    {
      expert: "Michael Thompson",
      title: "Sustainability Director",
      company: "World Textile Council",
      prediction: "Circular economy principles will become mandatory for textile companies by 2027, with take-back programs and recycling quotas enforced globally. Early adopters will gain competitive advantages.",
      confidence: "Very High",
      timeframe: "2025-2027"
    }
  ];

  const industrySegments = [
    {
      name: "Manufacturing",
      performance: "+12.5%",
      challenges: ["Rising labor costs", "Energy price volatility", "Supply chain disruptions"],
      opportunities: ["Automation adoption", "Sustainable processes", "Nearshoring trends"],
      keyMetrics: { revenue: "₹2.3T", growth: "12.5%", employment: "45M" }
    },
    {
      name: "Distribution",
      performance: "+8.3%",
      challenges: ["Logistics bottlenecks", "Inventory management", "Digital transformation"],
      opportunities: ["E-commerce growth", "Direct-to-consumer models", "AI-powered logistics"],
      keyMetrics: { revenue: "₹890B", growth: "8.3%", employment: "12M" }
    },
    {
      name: "Retail",
      performance: "+15.7%",
      challenges: ["Changing consumer preferences", "Omnichannel complexity", "Sustainability demands"],
      opportunities: ["Personalization", "Sustainable fashion", "Social commerce"],
      keyMetrics: { revenue: "₹1.8T", growth: "15.7%", employment: "28M" }
    },
    {
      name: "Raw Materials",
      performance: "+6.2%",
      challenges: ["Price volatility", "Climate impact", "Quality consistency"],
      opportunities: ["Bio-based materials", "Recycled fibers", "Vertical integration"],
      keyMetrics: { revenue: "₹650B", growth: "6.2%", employment: "8M" }
    }
  ];

  const innovations = [
    {
      title: "Waterless Dyeing Technology",
      company: "ColorZen Technologies",
      description: "Revolutionary dyeing process that eliminates water usage while maintaining color quality and durability.",
      impact: "90% reduction in water consumption",
      adoptionRate: "15% of major manufacturers"
    },
    {
      title: "AI-Powered Fabric Design",
      company: "DesignAI Textiles",
      description: "Machine learning algorithms that create optimized fabric patterns based on performance requirements and aesthetic preferences.",
      impact: "40% faster design cycles",
      adoptionRate: "25% of design studios"
    },
    {
      title: "Blockchain Supply Chain Tracking",
      company: "TextileChain Solutions",
      description: "End-to-end traceability system ensuring authenticity and sustainability compliance throughout the supply chain.",
      impact: "100% supply chain transparency",
      adoptionRate: "8% of global brands"
    },
    {
      title: "Robotic Fabric Cutting Systems",
      company: "AutoCut Industries",
      description: "Precision robotic systems that optimize fabric utilization and reduce waste in cutting operations.",
      impact: "25% reduction in material waste",
      adoptionRate: "35% of large manufacturers"
    },
    {
      title: "Bio-Based Fiber Production",
      company: "BioFiber Labs",
      description: "Sustainable fiber production using agricultural waste and biotechnology processes.",
      impact: "60% lower carbon footprint",
      adoptionRate: "12% of fiber producers"
    }
  ];

  const upcomingCompanies = [
    {
      name: "EcoWeave Technologies",
      founded: 2022,
      innovation: "Mushroom-based leather alternatives",
      funding: "$45M Series A",
      growth: "300% YoY revenue growth",
      potential: "Disrupting leather industry with sustainable alternatives"
    },
    {
      name: "FiberFlow AI",
      founded: 2021,
      innovation: "AI-optimized textile manufacturing",
      funding: "$28M Seed + Series A",
      growth: "250% customer base expansion",
      potential: "Revolutionizing production efficiency through AI"
    },
    {
      name: "CircularTex",
      founded: 2023,
      innovation: "Textile-to-textile recycling platform",
      funding: "$15M Seed funding",
      growth: "150% processing capacity increase",
      potential: "Enabling true circular economy in textiles"
    },
    {
      name: "SmartFabric Solutions",
      founded: 2022,
      innovation: "IoT-enabled smart textiles",
      funding: "$32M Series A",
      growth: "400% patent portfolio growth",
      potential: "Creating next-generation wearable technology"
    },
    {
      name: "GreenDye Innovations",
      founded: 2021,
      innovation: "Plant-based natural dyes",
      funding: "$22M Series A",
      growth: "180% market penetration",
      potential: "Replacing synthetic dyes with eco-friendly alternatives"
    }
  ];

  const marketTrends = [
    {
      title: "Sustainable Fashion Adoption",
      finding: "67% of consumers willing to pay premium for sustainable textiles",
      data: "Survey of 10,000 consumers across 15 countries",
      implication: "Brands must prioritize sustainability to capture growing market segment"
    },
    {
      title: "Digital Transformation Acceleration",
      finding: "85% of textile companies increased digital investment by 40%+ in 2024",
      data: "Industry survey of 500 textile manufacturers",
      implication: "Digital capabilities becoming essential for competitive advantage"
    },
    {
      title: "Supply Chain Regionalization",
      finding: "45% of companies moving production closer to end markets",
      data: "Analysis of 200 major textile brands' sourcing strategies",
      implication: "Nearshoring trend creating new opportunities in regional markets"
    },
    {
      title: "Circular Economy Implementation",
      finding: "30% of textile waste now being recycled into new products",
      data: "Global textile waste management report 2024",
      implication: "Circular business models becoming mainstream and profitable"
    }
  ];

  const regulatoryUpdates = [
    {
      region: "European Union",
      update: "Extended Producer Responsibility for Textiles",
      deadline: "January 1, 2025",
      impact: "Manufacturers responsible for entire product lifecycle",
      compliance: "Registration and reporting systems required"
    },
    {
      region: "United States",
      update: "FABRIC Act Implementation",
      deadline: "July 1, 2024",
      impact: "Enhanced labor standards and supply chain transparency",
      compliance: "Detailed supplier auditing and reporting"
    },
    {
      region: "India",
      update: "Textile PLI Scheme Extension",
      deadline: "March 31, 2024",
      impact: "Additional ₹10,683 crore incentives for manufacturers",
      compliance: "Investment and employment targets must be met"
    },
    {
      region: "China",
      update: "Carbon Neutrality Textile Standards",
      deadline: "December 31, 2024",
      impact: "Mandatory carbon footprint reporting for exports",
      compliance: "Third-party verification of emissions data"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', newsletterEmail);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Textile Industry Insights
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive analysis and insights for textile industry professionals, investors, and stakeholders
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Published: January 20, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: January 20, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>~12 min read</span>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Table of Contents</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tableOfContents.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-3 p-3 text-left hover:bg-white/5 rounded-xl transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                  <span className="text-gray-300 group-hover:text-white">{item.title}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Latest News & Updates */}
          <section id="news" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-cyan-400" />
                <span>Latest News & Updates</span>
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-gray-300">Share Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {latestNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-xs font-medium">
                      {news.category}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{news.readTime}</span>
                      <span>•</span>
                      <span>{new Date(news.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 hover:text-cyan-400 transition-colors cursor-pointer">
                    {news.headline}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {news.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Source: {news.source}</span>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <Bookmark className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                      </button>
                      <button className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        <span>Read Full Article</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Expert Predictions */}
          <section id="predictions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span>Expert Predictions</span>
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-gray-300">Share Section</span>
              </button>
            </div>

            <div className="space-y-6">
              {expertPredictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/5 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {prediction.expert.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{prediction.expert}</h3>
                          <p className="text-sm text-gray-400">{prediction.title} at {prediction.company}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            prediction.confidence === 'Very High' ? 'bg-green-500 text-white' :
                            prediction.confidence === 'High' ? 'bg-green-400 text-white' :
                            'bg-yellow-500 text-white'
                          }`}>
                            {prediction.confidence} Confidence
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{prediction.timeframe}</p>
                        </div>
                      </div>
                      <blockquote className="text-gray-300 italic border-l-4 border-cyan-400 pl-4 py-2">
                        "{prediction.prediction}"
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Industry Segments Analysis */}
          <section id="segments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <span>Industry Segments Analysis</span>
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-gray-300">Share Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {industrySegments.map((segment, index) => (
                <motion.div
                  key={segment.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{segment.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      parseFloat(segment.performance) > 10 ? 'bg-green-500 text-white' :
                      parseFloat(segment.performance) > 5 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {segment.performance}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">{segment.keyMetrics.revenue}</p>
                      <p className="text-xs text-gray-400">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{segment.keyMetrics.growth}</p>
                      <p className="text-xs text-gray-400">Growth</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{segment.keyMetrics.employment}</p>
                      <p className="text-xs text-gray-400">Employment</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-2">Key Challenges</h4>
                      <ul className="space-y-1">
                        {segment.challenges.map((challenge, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-center space-x-2">
                            <div className="w-1 h-1 bg-red-400 rounded-full" />
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">Growth Opportunities</h4>
                      <ul className="space-y-1">
                        {segment.opportunities.map((opportunity, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-center space-x-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full" />
                            <span>{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Manufacturing & Innovation */}
          <section id="innovation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Factory className="w-6 h-6 text-purple-400" />
                <span>Manufacturing & Innovation</span>
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-gray-300">Share Section</span>
              </button>
            </div>

            <div className="space-y-4">
              {innovations.map((innovation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{innovation.title}</h3>
                      <p className="text-sm text-cyan-400 mb-3">{innovation.company}</p>
                      <p className="text-gray-300 text-sm mb-4">{innovation.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-2">
                        {innovation.adoptionRate}
                      </div>
                      <p className="text-xs text-gray-400">Adoption Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-400">{innovation.impact}</span>
                    <button className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>Learn More</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Global Politics & Trade Impact */}
          <section id="politics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Globe className="w-6 h-6 text-orange-400" />
                <span>Global Politics & Trade Impact</span>
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-gray-300">Share Section</span>
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Trade Policy Changes</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h4 className="font-medium text-cyan-400 mb-2">US-China Trade Relations</h4>
                      <p className="text-sm text-gray-300">Reduced tariffs on textile imports from China by 15%, expected to lower costs for US retailers and increase competition for domestic manufacturers.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h4 className="font-medium text-cyan-400 mb-2">EU Green Deal Impact</h4>
                      <p className="text-sm text-gray-300">New carbon border adjustments will affect textile imports, requiring detailed emissions reporting and potentially increasing costs for non-EU suppliers.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h4 className="font-medium text-cyan-400 mb-2">RCEP Implementation</h4>
                      <p className="text-sm text-gray-300">Regional Comprehensive Economic Partnership reduces textile tariffs across Asia-Pacific, creating new opportunities for regional trade integration.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Regional Impact Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-gray-300">North America</span>
                      <span className="text-green-400 font-medium">+8.5% Growth</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-gray-300">Europe</span>
                      <span className="text-yellow-400 font-medium">+3.2% Growth</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-gray-300">Asia-Pacific</span>
                      <span className="text-green-400 font-medium">+12.7% Growth</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-gray-300">Latin America</span>
                      <span className="text-red-400 font-medium">-2.1% Decline</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Companies & Startups */}
          <section id="startups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span>Upcoming Companies & Startups</span>
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-gray-300">Share Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                      <p className="text-sm text-gray-400">Founded {company.founded}</p>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-xs font-medium">
                      {company.funding}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400 mb-1">Innovation</h4>
                      <p className="text-sm text-gray-300">{company.innovation}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-1">Growth Metrics</h4>
                      <p className="text-sm text-gray-300">{company.growth}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-purple-400 mb-1">Market Potential</h4>
                      <p className="text-sm text-gray-300">{company.potential}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <button className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                      <Building className="w-4 h-4" />
                      <span>Company Profile</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm transition-colors">
                      <Target className="w-4 h-4" />
                      <span>Investment Info</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Research & Market Trends */}
          <section id="research" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <FileText className="w-6 h-6 text-indigo-400" />
                <span>Research & Market Trends</span>
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-gray-300">Share Section</span>
              </button>
            </div>

            <div className="space-y-6">
              {marketTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/5 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{trend.title}</h3>
                      <div className="bg-white/5 rounded-xl p-4 mb-3">
                        <p className="text-cyan-400 font-medium text-lg mb-1">{trend.finding}</p>
                        <p className="text-xs text-gray-400">{trend.data}</p>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-indigo-400 mb-2">Business Implication</h4>
                        <p className="text-sm text-gray-300">{trend.implication}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Taxation & Regulatory Updates */}
          <section id="regulation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <span>Taxation & Regulatory Updates</span>
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-gray-300">Share Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {regulatoryUpdates.map((update, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{update.region}</h3>
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                      {update.deadline}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400 mb-1">Update</h4>
                      <p className="text-sm text-gray-300">{update.update}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-400 mb-1">Business Impact</h4>
                      <p className="text-sm text-gray-300">{update.impact}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-1">Compliance Requirements</h4>
                      <p className="text-sm text-gray-300">{update.compliance}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <button className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>Official Source</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Compliance Guide</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Call-to-Action Section */}
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border border-white/5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Newsletter Signup */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <span>Stay Updated</span>
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Get weekly textile industry insights delivered to your inbox. Join 15,000+ industry professionals.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex space-x-3">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-medium"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>

                {/* Expert Consultation */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <span>Expert Consultation</span>
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Need personalized insights for your textile business? Connect with our industry experts for strategic guidance.
                  </p>
                  <div className="flex space-x-3">
                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium">
                      Schedule Consultation
                    </button>
                    <button className="px-6 py-3 border border-white/5 text-gray-300 rounded-xl hover:bg-white/5 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Resources */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Related Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-medium">Industry Report 2024</p>
                    <p className="text-xs text-gray-400">Comprehensive market analysis</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Market Data Dashboard</p>
                    <p className="text-xs text-gray-400">Real-time industry metrics</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Industry Directory</p>
                    <p className="text-xs text-gray-400">Connect with professionals</p>
                  </div>
                </button>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TextileInsights;