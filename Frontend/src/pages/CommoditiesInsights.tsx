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
  Brain,
  Construction,
  Sparkles
} from 'lucide-react';

const CommoditiesInsights = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('Gold');
  const [timeHorizon, setTimeHorizon] = useState('7-day');
  const [userPoll, setUserPoll] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'overview' | 'analysis' | 'community' | 'research'>('overview');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'drivers' | 'factors' | 'scenarios'>('drivers');

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
    if (direction === 'Upward' || direction === 'Upward Pressure') return 'text-trade-gain';
    if (direction === 'Downward' || direction === 'Downward Pressure') return 'text-trade-loss';
    return 'text-content-secondary';
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

  // Render functions for each mode
  function renderOverviewMode() {
    return (
      <motion.div
        key="overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* Risk & Market Context */}
        <div className="bg-theme-surface rounded-2xl p-8 border border-theme-border shadow-surface">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-content-primary mb-2 flex items-center space-x-3">
                <Shield className="w-7 h-7 text-trade-action" />
                <span>Risk & Market Context</span>
              </h2>
              <p className="text-content-secondary">
                How uncertain or fragile is the market right now?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Overall Risk Level */}
            <div className="bg-theme-canvas rounded-xl p-6 border border-theme-border">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className={`w-6 h-6 text-${getRiskLevelColor(riskAssessment.level)}-400`} />
                <h3 className="text-sm font-medium text-content-secondary">Overall Risk Level</h3>
              </div>
              <p className={`text-3xl font-bold text-${getRiskLevelColor(riskAssessment.level)}-400 mb-2`}>
                {riskAssessment.level}
              </p>
              <p className="text-xs text-content-secondary">
                Based on current market conditions and uncertainty factors
              </p>
            </div>

            {/* Volatility Outlook */}
            <div className="bg-theme-canvas rounded-xl p-6 border border-theme-border">
              <div className="flex items-center space-x-3 mb-3">
                <Activity className="w-6 h-6 text-purple-400" />
                <h3 className="text-sm font-medium text-content-secondary">Volatility Outlook</h3>
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-2">
                {riskAssessment.volatilityOutlook}
              </p>
              <p className="text-xs text-content-secondary">
                Price movements may exceed typical historical ranges
              </p>
            </div>

            {/* Confidence Level */}
            <div className="bg-theme-canvas rounded-xl p-6 border border-theme-border">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <h3 className="text-sm font-medium text-content-secondary">Assessment Confidence</h3>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-2">
                {riskAssessment.confidence}
              </p>
              <p className="text-xs text-content-secondary">
                Reflects clarity of signals in current market environment
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-trade-action mt-0.5 flex-shrink-0" />
              <p className="text-content-secondary text-sm leading-relaxed">
                {riskAssessment.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Market Regime */}
        <div className="bg-theme-surface rounded-2xl p-6 border border-theme-border shadow-surface">
          <h2 className="text-2xl font-bold text-content-primary mb-4 flex items-center space-x-3">
            <Waves className="w-6 h-6 text-indigo-500" />
            <span>Current Market Regime</span>
          </h2>
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="px-4 py-2 bg-indigo-600 rounded-full">
                <span className="text-white font-bold text-lg">{marketRegime.primary}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-indigo-600 mb-1">What defines this regime</h4>
                <p className="text-content-secondary">{marketRegime.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-purple-600 mb-1">Typical impact on {selectedCommodity}</h4>
                <p className="text-content-secondary">{marketRegime.typicalImpact}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  function renderAnalysisMode() {
    return (
      <motion.div
        key="analysis"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* Analysis Tabs */}
        <div className="bg-theme-surface rounded-2xl p-2 border border-theme-border shadow-surface">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveAnalysisTab('drivers')}
              className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                activeAnalysisTab === 'drivers'
                  ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-400'
                  : 'bg-theme-canvas text-content-secondary hover:bg-blue-50 hover:text-content-primary border-2 border-transparent'
              }`}
            >
              <Lightbulb className="w-5 h-5 mx-auto mb-2" />
              Market Drivers
            </button>
            <button
              onClick={() => setActiveAnalysisTab('factors')}
              className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                activeAnalysisTab === 'factors'
                  ? 'bg-green-50 text-trade-gain border-2 border-trade-gain'
                  : 'bg-theme-canvas text-content-secondary hover:bg-blue-50 hover:text-content-primary border-2 border-transparent'
              }`}
            >
              <BarChart3 className="w-5 h-5 mx-auto mb-2" />
              Factor Analysis
            </button>
            <button
              onClick={() => setActiveAnalysisTab('scenarios')}
              className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                activeAnalysisTab === 'scenarios'
                  ? 'bg-orange-50 text-orange-600 border-2 border-orange-400'
                  : 'bg-theme-canvas text-content-secondary hover:bg-blue-50 hover:text-content-primary border-2 border-transparent'
              }`}
            >
              <Zap className="w-5 h-5 mx-auto mb-2" />
              Scenarios
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeAnalysisTab === 'drivers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-content-primary flex items-center space-x-3">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <span>Top Market Drivers</span>
              </h2>
              <span className="text-sm text-content-secondary">
                Ranked by current relevance
              </span>
            </div>

            <div className="space-y-4">
              {topDrivers.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-theme-surface border border-theme-border rounded-2xl hover:border-trade-action/30 hover:shadow-surface transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl font-bold text-theme-border">#{index + 1}</span>
                          <span className="px-3 py-1 bg-theme-canvas border border-theme-border rounded-full text-xs font-medium text-content-secondary">
                            {driver.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            driver.impact === 'Upward Pressure' ? 'bg-trade-gain/10 text-trade-gain' :
                            driver.impact === 'Downward Pressure' ? 'bg-trade-loss/10 text-trade-loss' :
                            'bg-theme-canvas text-content-secondary border border-theme-border'
                          }`}>
                            {driver.impact}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-content-primary mb-2">
                          {driver.headline}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-content-secondary">
                          <span>{driver.source}</span>
                          <span>•</span>
                          <span>{driver.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-theme-canvas rounded-xl p-4 border border-theme-border">
                      <h4 className="text-sm font-semibold text-trade-action mb-2">Why it matters</h4>
                      <p className="text-content-secondary text-sm leading-relaxed">
                        {driver.whyItMatters}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeAnalysisTab === 'factors' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-content-primary flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-trade-gain" />
              <span>Factor Impact Analysis</span>
            </h2>
            <p className="text-content-secondary">
              How different factors are influencing {selectedCommodity} right now
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {factorImpacts.map((factor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-theme-surface border border-theme-border rounded-2xl p-6 hover:border-trade-action/30 hover:shadow-surface transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <factor.icon className="w-6 h-6 text-trade-action" />
                      <h3 className="font-semibold text-content-primary">{factor.category}</h3>
                    </div>
                    {React.createElement(getDirectionIcon(factor.direction), { 
                      className: `w-5 h-5 ${getDirectionColor(factor.direction)}` 
                    })}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Direction</span>
                      <span className={`text-sm font-semibold ${getDirectionColor(factor.direction)}`}>
                        {factor.direction}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Strength</span>
                      <span className="text-sm font-semibold text-content-primary">{factor.strength}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-theme-border">
                    <p className="text-sm text-content-secondary leading-relaxed">
                      {factor.explanation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeAnalysisTab === 'scenarios' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-content-primary flex items-center space-x-3 mb-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <span>Scenario Analysis</span>
              </h2>
              <p className="text-content-secondary">
                Conditional "If-Then" scenarios — not forecasts or guarantees
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-content-secondary text-sm">
                  <strong className="text-content-primary">Important:</strong> These are analytical scenarios showing possible relationships between events and outcomes. They are not predictions, price targets, or investment recommendations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-400/30 hover:shadow-md transition-all"
                >
                  <div className="mb-4">
                    <div className="flex items-start space-x-2 mb-3">
                      <span className="text-blue-600 font-bold text-sm">IF:</span>
                      <p className="text-slate-600 text-sm flex-1">
                        {scenario.condition}
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-2 pl-6">
                      <span className="text-emerald-600 font-bold text-sm">THEN:</span>
                      <p className="text-slate-600 text-sm flex-1">
                        {scenario.likelyOutcome}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Probability</p>
                      <p className="text-sm text-slate-900 font-semibold">{scenario.probability}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Timeframe</p>
                      <p className="text-sm text-slate-900 font-semibold">{scenario.timeframe}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  function renderCommunityMode() {
    return (
      <motion.div
        key="community"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-3">
            <Users className="w-6 h-6 text-purple-500" />
            <span>Community Sentiment</span>
          </h2>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-slate-600 text-sm">
                {pollData.disclaimer}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Poll Results */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{pollData.question}</h3>
              
              <div className="space-y-4 mb-4">
                {pollData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setUserPoll(option.label)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      userPoll === option.label
                        ? 'bg-purple-50 border-purple-300'
                        : 'bg-slate-50 border-slate-200 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-900 font-semibold">{option.label}</span>
                      <span className="text-purple-600 font-bold">{option.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{option.votes} votes</p>
                  </button>
                ))}
              </div>

              <p className="text-sm text-slate-500 text-center">
                Total votes: {pollData.totalVotes.toLocaleString()}
              </p>
            </div>

            {/* Common Themes */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-slate-500" />
                <span>Common Themes from Community</span>
              </h3>

              <div className="space-y-3">
                {communityInsights.map((insight, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">{insight.theme}</span>
                      <span className="text-sm text-purple-600 font-semibold">{insight.count} mentions</span>
                    </div>
                    <p className="text-sm text-slate-600">{insight.summary}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 italic">
                  These themes reflect recurring topics in user commentary. They do not constitute consensus predictions or recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  function renderResearchMode() {
    return (
      <motion.div
        key="research"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-900">Evidence & Methodology</h2>
          </div>

          <div className="space-y-6">
            {/* Volatility Comparison */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Volatility vs Historical Baseline</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Current 30-Day Vol</p>
                    <p className="text-2xl font-bold text-slate-900">23.5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">12-Month Average</p>
                    <p className="text-2xl font-bold text-slate-500">18.2%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Deviation</p>
                    <p className="text-2xl font-bold text-orange-500">+29%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sources */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Primary Sources</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 text-sm">
                    Bloomberg Commodity Index Data (Real-time pricing and volatility metrics)
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 text-sm">
                    Reuters News API (Aggregated news sentiment and event tracking)
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 text-sm">
                    Central Bank Policy Statements (FOMC, ECB, BoJ official communications)
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 text-sm">
                    IEA Energy Reports (Supply and demand projections for energy commodities)
                  </span>
                </div>
              </div>
            </div>

            {/* Methodology */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Methodology Notes</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">Risk Assessment:</strong> Based on combination of implied volatility, news sentiment analysis, and historical pattern deviation.
                </p>
                <p>
                  <strong className="text-slate-900">Market Regime:</strong> Determined by analyzing correlation patterns across asset classes and dominant thematic drivers in news flow.
                </p>
                <p>
                  <strong className="text-slate-900">Driver Ranking:</strong> News articles scored by recency, source credibility, and estimated market impact based on historical price reactions.
                </p>
                <p>
                  <strong className="text-slate-900">Factor Analysis:</strong> Each factor evaluated for directional bias and strength using multi-source data triangulation.
                </p>
              </div>
            </div>

            {/* Limitations */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Known Limitations</h3>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Analysis reflects conditions at time of data snapshot; markets evolve continuously</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Sentiment analysis may not capture all nuances of human interpretation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Historical patterns used for context but do not guarantee future replication</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Unforeseen events (black swans) can override all analyzed factors</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Community polls reflect opinion, not statistical probability or professional consensus</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header / Context Selector */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Commodity Insights
              </h1>
              <p className="text-slate-600 text-lg">
                Structured analysis to help you understand market conditions — not trading advice
              </p>
            </div>

            {/* 🚧 Work In Progress Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-amber-400/60 bg-gradient-to-r from-amber-950/80 via-yellow-900/70 to-orange-950/80 shadow-lg shadow-amber-500/10"
            >
              {/* Animated shimmer stripe */}
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
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-amber-200/80 text-sm leading-relaxed">
                    This page is still being built. Live market data, real-time signals, and deeper insights are on the way. Stay tuned — something great is coming!
                  </p>
                </div>
                <Sparkles className="flex-shrink-0 w-5 h-5 text-amber-400/60" />
              </div>
            </motion.div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Commodity Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">
                    Select Commodity
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCommodity}
                      onChange={(e) => setSelectedCommodity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 appearance-none cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      {commodities.map(commodity => (
                        <option key={commodity} value={commodity}>{commodity}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Time Horizon Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">
                    Time Horizon
                  </label>
                  <div className="relative">
                    <select
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 appearance-none cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      {timeHorizons.map(horizon => (
                        <option key={horizon.value} value={horizon.value}>{horizon.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Last Updated */}
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">
                    Last Updated
                  </label>
                  <div className="flex items-center space-x-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-slate-900 text-sm">
                      {formatTimestamp(riskAssessment.lastUpdated)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {navigationModes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  activeMode === mode.id
                    ? 'bg-trade-action/5 border-trade-action shadow-sm'
                    : 'bg-theme-surface border-theme-border hover:border-trade-action/30 hover:shadow-surface'
                }`}
              >
                <mode.icon className={`w-8 h-8 mb-3 ${
                  activeMode === mode.id ? 'text-trade-action' : 'text-content-secondary'
                }`} />
                <h3 className={`text-lg font-bold mb-2 ${
                  activeMode === mode.id ? 'text-trade-action' : 'text-content-primary'
                }`}>
                  {mode.label}
                </h3>
                <p className="text-sm text-content-secondary">
                  {mode.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Content Based on Active Mode */}
          <div className="min-h-[600px]">
            {activeMode === 'overview' && renderOverviewMode()}
            {activeMode === 'analysis' && renderAnalysisMode()}
            {activeMode === 'community' && renderCommunityMode()}
            {activeMode === 'research' && renderResearchMode()}
          </div>

          {/* Disclaimer Footer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-content-primary">Important Disclaimer</h3>
                <p className="text-content-secondary text-sm leading-relaxed">
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
