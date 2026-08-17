import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  ChevronDown,
  Clock,
  ExternalLink,
  Shield,
  Activity,
  Users,
  MessageSquare,
  CheckCircle,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  BookOpen,
  BarChart3,
  Globe,
  Factory,
  Zap,
  Waves,
  Brain
} from 'lucide-react';

const CommoditiesInsights = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('Gold');
  const [timeHorizon, setTimeHorizon] = useState('7-day');
  const [userPoll, setUserPoll] = useState<string | null>(null);
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [activeMode, setActiveMode] = useState<'overview' | 'analysis' | 'community' | 'research'>('overview');

  const commodities = ['Gold', 'Silver', 'Brent Crude', 'WTI Oil', 'Copper', 'Natural Gas'];
  const timeHorizons = [
    { value: '1-day', label: 'Next 1 Day' },
    { value: '3-day', label: 'Next 3 Days' },
    { value: '7-day', label: 'Next 7 Days' }
  ];

  const navigationModes = [
    { 
      id: 'overview' as const, 
      label: 'Overview', 
      icon: Shield, 
      description: 'Key metrics and risk assessment',
      color: 'cyan'
    },
    { 
      id: 'analysis' as const, 
      label: 'Market Analysis', 
      icon: BarChart3, 
      description: 'Drivers, factors, and scenarios',
      color: 'green'
    },
    { 
      id: 'community' as const, 
      label: 'Community Insights', 
      icon: Users, 
      description: 'Sentiment and predictions',
      color: 'purple'
    },
    { 
      id: 'research' as const, 
      label: 'Research & Evidence', 
      icon: BookOpen, 
      description: 'Methodology and sources',
      color: 'indigo'
    }
  ];

  // Risk Assessment Data
  const riskAssessment = {
    level: 'Elevated',
    levelColor: 'orange',
    volatilityOutlook: 'Moderate to High',
    confidence: 'Medium',
    lastUpdated: '2026-02-05T14:30:00Z',
    summary: 'Current market conditions show elevated uncertainty due to conflicting signals from policy decisions and geopolitical tensions. Price movements may be larger than historical norms.'
  };

  // Market Regime
  const marketRegime = {
    primary: 'Geopolitical Uncertainty',
    description: 'Markets are responding primarily to geopolitical developments and risk sentiment shifts.',
    typicalImpact: 'Safe-haven assets like gold typically see increased demand during geopolitical uncertainty, while industrial commodities may face pressure from risk aversion.'
  };

  // Top Drivers
  const topDrivers = [
    {
      id: 1,
      headline: 'Central Bank Policy Divergence Signals Mixed',
      source: 'Reuters',
      date: '2026-02-04',
      url: '#',
      category: 'Macro / Policy',
      whyItMatters: 'Different approaches by major central banks create uncertainty about global liquidity conditions. This affects demand expectations for commodities used in manufacturing and construction.',
      impact: 'Mixed',
      strength: 'Strong'
    },
    {
      id: 2,
      headline: 'Middle East Tensions Persist Amid Diplomatic Talks',
      source: 'Bloomberg',
      date: '2026-02-03',
      url: '#',
      category: 'Geopolitical',
      whyItMatters: 'Ongoing regional tensions could disrupt supply routes for energy commodities. Even without direct impact, risk premium tends to elevate during uncertain periods.',
      impact: 'Upward Pressure',
      strength: 'Moderate'
    },
    {
      id: 3,
      headline: 'China Manufacturing Data Shows Slower Growth',
      source: 'Financial Times',
      date: '2026-02-02',
      url: '#',
      category: 'Demand',
      whyItMatters: 'As the largest consumer of industrial metals, China\'s demand trajectory significantly influences pricing. Slower growth suggests potential headwinds for copper, iron ore, and other industrial inputs.',
      impact: 'Downward Pressure',
      strength: 'Strong'
    },
    {
      id: 4,
      headline: 'USD Strengthens on Safe-Haven Flows',
      source: 'Wall Street Journal',
      date: '2026-02-01',
      url: '#',
      category: 'Behavioral / Emotional',
      whyItMatters: 'Commodities priced in USD typically face headwinds when the dollar strengthens, as they become more expensive for foreign buyers. This is a technical factor rather than fundamental demand shift.',
      impact: 'Downward Pressure',
      strength: 'Moderate'
    },
    {
      id: 5,
      headline: 'Weather Patterns Affect Agricultural Supply Outlook',
      source: 'Commodity Weather Group',
      date: '2026-01-31',
      url: '#',
      category: 'Supply',
      whyItMatters: 'Unusual weather patterns in key growing regions create uncertainty about crop yields. While not directly affecting metals or energy, it influences overall commodity market sentiment.',
      impact: 'Mixed',
      strength: 'Weak'
    }
  ];

  // Factor Impact Mapping
  const factorImpacts = [
    {
      category: 'Macro / Policy',
      icon: BarChart3,
      direction: 'Mixed',
      strength: 'Strong',
      explanation: 'Central bank policies are diverging globally. Some tightening, some holding. Creates cross-currents in commodity demand expectations.'
    },
    {
      category: 'Supply Constraints',
      icon: Factory,
      direction: 'Upward',
      strength: 'Moderate',
      explanation: 'Some production disruptions reported in key mining regions, but not widespread. Supply remains adequate but not abundant.'
    },
    {
      category: 'Demand Outlook',
      icon: TrendingDown,
      direction: 'Downward',
      strength: 'Moderate',
      explanation: 'Industrial demand showing signs of softening in major economies. Consumer sentiment also weaker in some regions.'
    },
    {
      category: 'Geopolitical Risk',
      icon: Globe,
      direction: 'Upward',
      strength: 'Strong',
      explanation: 'Elevated tensions in multiple regions create risk premium. Even without direct supply impact, uncertainty drives safe-haven flows.'
    },
    {
      category: 'Market Sentiment',
      icon: Brain,
      direction: 'Mixed',
      strength: 'Moderate',
      explanation: 'Investor positioning is divided. Some taking defensive stances, others seeing opportunities. No clear consensus direction.'
    },
    {
      category: 'Historical Patterns',
      icon: Activity,
      direction: 'Neutral',
      strength: 'Weak',
      explanation: 'Seasonal patterns suggest this period typically sees moderate activity. However, current year deviates from historical norms.'
    }
  ];

  // Scenario Analysis
  const scenarios = [
    {
      condition: 'If geopolitical tensions escalate further',
      likelyOutcome: 'Risk premium could increase, supporting safe-haven assets like gold while pressuring demand-sensitive commodities',
      probability: 'Moderate likelihood',
      timeframe: 'Could materialize within days to weeks'
    },
    {
      condition: 'If central banks signal coordinated policy approach',
      likelyOutcome: 'Reduced uncertainty may lower volatility and stabilize demand expectations across commodity complex',
      probability: 'Lower likelihood near-term',
      timeframe: 'Would require policy meetings and coordination'
    },
    {
      condition: 'If China announces stimulus measures',
      likelyOutcome: 'Industrial commodities could see renewed demand expectations, particularly metals and energy',
      probability: 'Uncertain timing',
      timeframe: 'Policy announcements often come with little advance notice'
    },
    {
      condition: 'If USD weakens on changing sentiment',
      likelyOutcome: 'Technical tailwind for commodities priced in dollars, making them relatively cheaper for foreign buyers',
      probability: 'Dependent on broader market conditions',
      timeframe: 'Currency moves can be rapid but direction uncertain'
    }
  ];

  // Community Poll Data
  const pollData = {
    question: 'What do you expect for Gold over the next 7 days?',
    options: [
      { label: 'Likely higher on risk premium', votes: 342, percentage: 38 },
      { label: 'Likely range-bound / mixed', votes: 421, percentage: 47 },
      { label: 'Likely lower on demand concerns', votes: 137, percentage: 15 }
    ],
    totalVotes: 900,
    disclaimer: 'This poll reflects community opinion, not investment advice or guaranteed outcomes.'
  };

  // User Comments (sample)
  const communityInsights = [
    {
      theme: 'Safe-haven demand',
      count: 127,
      summary: 'Many users cite uncertainty as reason to expect continued interest in defensive assets'
    },
    {
      theme: 'USD strength headwind',
      count: 89,
      summary: 'Technical factors like dollar strength mentioned as potential near-term constraint'
    },
    {
      theme: 'Wait-and-see approach',
      count: 156,
      summary: 'Significant portion prefers observing how policy developments unfold before forming view'
    }
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'green';
      case 'moderate': return 'yellow';
      case 'elevated': return 'orange';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const getDirectionIcon = (direction: string) => {
    if (direction === 'Upward' || direction === 'Upward Pressure') return ArrowUpRight;
    if (direction === 'Downward' || direction === 'Downward Pressure') return ArrowDownRight;
    return Minus;
  };

  const getDirectionColor = (direction: string) => {
    if (direction === 'Upward' || direction === 'Upward Pressure') return 'text-green-400';
    if (direction === 'Downward' || direction === 'Downward Pressure') return 'text-red-400';
    return 'text-gray-400';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Commodity Insights
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Structured analysis to help you understand market conditions — not trading advice
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Updated: {formatTimestamp(riskAssessment.lastUpdated)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>Educational Analysis Only</span>
              </div>
            </div>
          </div>

          {/* Context Selector - Compact */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-400">Commodity:</label>
                <div className="relative">
                  <select
                    value={selectedCommodity}
                    onChange={(e) => setSelectedCommodity(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white appearance-none cursor-pointer focus:border-cyan-400 focus:outline-none pr-10"
                  >
                    {commodities.map(commodity => (
                      <option key={commodity} value={commodity}>{commodity}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-400">Horizon:</label>
                <div className="relative">
                  <select
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white appearance-none cursor-pointer focus:border-cyan-400 focus:outline-none pr-10"
                  >
                    {timeHorizons.map(th => (
                      <option key={th.value} value={th.value}>{th.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="ml-auto">
                <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">No price predictions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Quick Navigation</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tableOfContents.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-3 p-3 text-left hover:bg-gray-700 rounded-xl transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                  <span className="text-gray-300 group-hover:text-white text-sm">{item.title}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Risk & Market Context (Hero Section) */}
          <section id="context" className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
              <Shield className="w-7 h-7 text-cyan-400" />
              <span>Risk & Market Context</span>
            </h2>
            <p className="text-gray-300 mb-6">
              How uncertain or fragile is the market right now?
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Overall Risk Level */}
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className={`w-6 h-6 text-${getRiskLevelColor(riskAssessment.level)}-400`} />
                  <h3 className="text-sm font-medium text-gray-400">Overall Risk Level</h3>
                </div>
                <p className={`text-3xl font-bold text-${getRiskLevelColor(riskAssessment.level)}-400 mb-2`}>
                  {riskAssessment.level}
                </p>
                <p className="text-xs text-gray-400">
                  Based on current market conditions and uncertainty factors
                </p>
              </div>

              {/* Volatility Outlook */}
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center space-x-3 mb-3">
                  <Activity className="w-6 h-6 text-purple-400" />
                  <h3 className="text-sm font-medium text-gray-400">Volatility Outlook</h3>
                </div>
                <p className="text-3xl font-bold text-purple-400 mb-2">
                  {riskAssessment.volatilityOutlook}
                </p>
                <p className="text-xs text-gray-400">
                  Price movements may exceed typical historical ranges
                </p>
              </div>

              {/* Confidence Level */}
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-400">Assessment Confidence</h3>
                </div>
                <p className="text-3xl font-bold text-blue-400 mb-2">
                  {riskAssessment.confidence}
                </p>
                <p className="text-xs text-gray-400">
                  Reflects clarity of signals in current market environment
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  {riskAssessment.summary}
                </p>
              </div>
            </div>
          </section>

          {/* Market Regime Identification */}
          <section id="regime" className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
              <Waves className="w-6 h-6 text-indigo-400" />
              <span>Current Market Regime</span>
            </h2>
            
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="px-4 py-2 bg-indigo-500 rounded-full">
                  <span className="text-white font-bold text-lg">{marketRegime.primary}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-indigo-400 mb-1">What defines this regime</h4>
                  <p className="text-gray-300">{marketRegime.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-purple-400 mb-1">Typical impact on {selectedCommodity}</h4>
                  <p className="text-gray-300">{marketRegime.typicalImpact}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Top Drivers & News Attribution */}
          <section id="drivers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <span>Top Market Drivers</span>
              </h2>
              <span className="text-sm text-gray-400">
                Ranked by current relevance
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {topDrivers.slice(0, 4).map((driver, index) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all overflow-hidden p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium">
                        #{index + 1}
                      </span>
                      <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                        {driver.category}
                      </span>
                    </div>
                    
                    <div className={`flex items-center space-x-1 ${getDirectionColor(driver.impact)}`}>
                      {React.createElement(getDirectionIcon(driver.impact), { className: 'w-4 h-4' })}
                      <span className="text-xs font-medium">{driver.strength}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2 line-clamp-2">
                    {driver.headline}
                  </h3>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {driver.whyItMatters}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{driver.source} • {new Date(driver.date).toLocaleDateString()}</span>
                    <a href={driver.url} className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      <span>Source</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Show remaining driver if odd number */}
            {topDrivers.length > 4 && topDrivers.slice(4).map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium">
                        #{4 + index + 1}
                      </span>
                      <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                        {driver.category}
                      </span>
                      <div className={`flex items-center space-x-1 ${getDirectionColor(driver.impact)} ml-auto`}>
                        {React.createElement(getDirectionIcon(driver.impact), { className: 'w-4 h-4' })}
                        <span className="text-xs font-medium">{driver.strength}</span>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{driver.headline}</h3>
                    <p className="text-gray-300 text-sm mb-3">{driver.whyItMatters}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{driver.source} • {new Date(driver.date).toLocaleDateString()}</span>
                      <a href={driver.url} className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        <span>Source</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Factor Impact Mapping */}
          <section id="factors" className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <span>Factor Impact Analysis</span>
            </h2>
            <p className="text-gray-400">
              How different factors are influencing {selectedCommodity} right now
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {factorImpacts.map((factor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {React.createElement(factor.icon, { className: 'w-5 h-5 text-cyan-400' })}
                      <h3 className="font-semibold text-white text-sm">{factor.category}</h3>
                    </div>
                    {React.createElement(getDirectionIcon(factor.direction), { 
                      className: `w-5 h-5 ${getDirectionColor(factor.direction)}` 
                    })}
                  </div>

                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-gray-400">Direction:</span>
                    <span className={`font-medium ${getDirectionColor(factor.direction)}`}>
                      {factor.direction}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {factor.explanation}
                  </p>

                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Strength</span>
                      <span className="font-medium text-white">{factor.strength}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Scenario Analysis */}
          <section id="scenarios" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3 mb-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span>Scenario Analysis</span>
              </h2>
              <p className="text-gray-400">
                Conditional "If-Then" scenarios — not forecasts or guarantees
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  <strong>Important:</strong> These are analytical scenarios showing possible relationships between events and outcomes. They are not predictions, price targets, or investment recommendations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium mt-0.5 flex-shrink-0">
                        IF
                      </span>
                      <p className="text-white font-medium text-sm">{scenario.condition}</p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium mt-0.5 flex-shrink-0">
                        THEN
                      </span>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {scenario.likelyOutcome}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Probability</p>
                      <p className="text-xs text-gray-300">{scenario.probability}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Timeframe</p>
                      <p className="text-xs text-gray-300">{scenario.timeframe}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Community Sentiment & Positioning */}
          <section id="sentiment" className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
              <Users className="w-6 h-6 text-purple-400" />
              <span>Community Sentiment</span>
            </h2>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  {pollData.disclaimer}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Poll Results */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">{pollData.question}</h3>
                
                <div className="space-y-3 mb-4">
                  {pollData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setUserPoll(option.label)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        userPoll === option.label
                          ? 'bg-purple-500/20 border-purple-500'
                          : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm">{option.label}</span>
                        <span className="text-cyan-400 font-bold">{option.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-400">{option.votes} votes</div>
                    </button>
                  ))}
                </div>

                <p className="text-sm text-gray-400 text-center">
                  Total votes: {pollData.totalVotes.toLocaleString()}
                </p>
              </div>

              {/* Common Themes */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Common Themes from Community</span>
                </h3>

                <div className="space-y-3">
                  {communityInsights.map((insight, index) => (
                    <div key={index} className="bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white text-sm">{insight.theme}</h4>
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          {insight.count} mentions
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{insight.summary}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gray-700/50 rounded-xl border border-gray-600">
                  <p className="text-xs text-gray-400 italic">
                    These themes reflect recurring topics in user commentary. They do not constitute consensus predictions or recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Evidence & Transparency */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">Evidence & Methodology</h2>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${showEvidence ? 'rotate-180' : ''}`} />
            </button>

            {showEvidence && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6 space-y-6"
              >
                {/* Volatility Comparison */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Volatility vs Historical Baseline</h3>
                  <div className="bg-gray-700 rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-cyan-400">18.2%</p>
                        <p className="text-xs text-gray-400">Current (30-day)</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-400">14.5%</p>
                        <p className="text-xs text-gray-400">1-Year Average</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-400">+25.5%</p>
                        <p className="text-xs text-gray-400">Above Baseline</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sources */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Primary Sources</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">Reuters Commodity News Feed</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">Bloomberg Terminal Data</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">Central Bank Policy Statements</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">Industry Supply/Demand Reports</span>
                    </div>
                  </div>
                </div>

                {/* Methodology */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Methodology Notes</h3>
                  <div className="bg-gray-700 rounded-xl p-4 space-y-3 text-sm text-gray-300">
                    <p>
                      <strong className="text-white">Risk Assessment:</strong> Based on combination of implied volatility, news sentiment analysis, and historical pattern deviation.
                    </p>
                    <p>
                      <strong className="text-white">Driver Ranking:</strong> Weighted by recency, source credibility, and estimated market impact based on historical responses to similar events.
                    </p>
                    <p>
                      <strong className="text-white">Factor Analysis:</strong> Qualitative assessment by research team combining quantitative indicators with contextual judgment.
                    </p>
                    <p>
                      <strong className="text-white">Scenario Construction:</strong> Logical frameworks based on observed cause-effect relationships, not predictive modeling.
                    </p>
                  </div>
                </div>

                {/* Limitations */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Known Limitations</h3>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Analysis reflects conditions at time of publication. Market conditions can change rapidly.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Scenarios are illustrative frameworks, not exhaustive or guaranteed outcomes.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Community sentiment reflects opinion, which may be influenced by biases and may not align with eventual outcomes.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Factor impacts are qualitative assessments and cannot be precisely quantified.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>This analysis does not constitute financial advice and should not be relied upon for trading decisions.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Disclaimer Footer */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Important Disclaimer</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This page provides educational analysis to help you understand market conditions and factors. It does not predict future prices, provide trading signals, or constitute investment advice. Markets are inherently uncertain, and past patterns do not guarantee future outcomes. Always conduct your own research and consult with qualified financial professionals before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommoditiesInsights;
