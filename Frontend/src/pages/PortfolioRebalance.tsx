import React, { useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, ShieldCheck, ArrowRightLeft,
  CheckCircle2, TrendingDown, TrendingUp
} from 'lucide-react';
import GhostCursor from '../components/GhostCursor';

type AssetType = 'high-risk' | 'safe' | 'low-risk';
type Asset = { id: string; name: string; type: AssetType; amount: string };

const INITIAL_PORTFOLIO: Asset[] = [
  { id: 'smallcap1', name: 'MicroCap Tech Fund', type: 'high-risk', amount: '₹1,50,000' },
  { id: 'midcap1',   name: 'Emerging Markets',   type: 'high-risk', amount: '₹2,00,000' },
  { id: 'largecap1', name: 'Bluechip 50',         type: 'low-risk',  amount: '₹5,00,000' },
];

const INITIAL_SAFE: Asset[] = [
  { id: 'sgb1',   name: 'SGB Gold Bonds 2026', type: 'safe', amount: '₹2,50,000' },
  { id: 'tbill1', name: 'Govt T-Bills',         type: 'safe', amount: '₹1,00,000' },
];

const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.96 },
  animate: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit:    { opacity: 0, y: -12, scale: 0.96, transition: { duration: 0.2 } },
};

const AssetCard = ({ asset }: { asset: Asset }) => {
  const colors = {
    'high-risk': { card: 'bg-red-500/10 border-red-500/30',     icon: 'bg-red-500/20',     text: 'text-red-400'     },
    'safe':      { card: 'bg-emerald-500/10 border-emerald-500/30', icon: 'bg-emerald-500/20', text: 'text-emerald-400' },
    'low-risk':  { card: 'bg-blue-500/10 border-blue-500/30',   icon: 'bg-blue-500/20',   text: 'text-blue-400'   },
  }[asset.type];

  return (
    <motion.div
      key={asset.id}
      id={asset.id}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`p-4 rounded-2xl border flex items-center justify-between shadow-md ${colors.card}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors.icon}`}>
          {asset.type === 'high-risk' && <TrendingDown className={`w-5 h-5 ${colors.text}`} />}
          {asset.type === 'safe'      && <ShieldCheck  className={`w-5 h-5 ${colors.text}`} />}
          {asset.type === 'low-risk'  && <TrendingUp   className={`w-5 h-5 ${colors.text}`} />}
        </div>
        <div>
          <p className="font-bold text-white text-sm">{asset.name}</p>
          <p className={`text-[10px] uppercase tracking-widest font-semibold mt-0.5 ${colors.text}`}>{asset.type}</p>
        </div>
      </div>
      <p className="font-black text-base text-white">{asset.amount}</p>
    </motion.div>
  );
};

const DropZone = ({ label, accent }: { label: string; accent: string }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className={`w-full h-28 border-2 border-dashed ${accent} rounded-2xl flex items-center justify-center text-sm font-medium text-gray-500`}
  >
    {label}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
const PortfolioRebalance = () => {
  const { search } = useLocation();
  const isDriving = new URLSearchParams(search).get('drive') === 'true';

  const [portfolio,  setPortfolio]  = useState<Asset[]>(INITIAL_PORTFOLIO);
  const [safeAssets, setSafeAssets] = useState<Asset[]>(INITIAL_SAFE);
  const [sellQueue,  setSellQueue]  = useState<Asset[]>([]);
  const [buyQueue,   setBuyQueue]   = useState<Asset[]>([]);
  const [showCursor, setShowCursor] = useState(isDriving);
  const [approved,   setApproved]   = useState(false);

  // Stable refs so cursor callbacks never read stale state
  const portfolioRef  = useRef<Asset[]>(INITIAL_PORTFOLIO);
  const safeRef       = useRef<Asset[]>(INITIAL_SAFE);
  portfolioRef.current = portfolio;
  safeRef.current      = safeAssets;

  const moveAsset = useCallback((id: string, from: 'portfolio' | 'safe', to: 'sell' | 'buy') => {
    const list  = from === 'portfolio' ? portfolioRef.current : safeRef.current;
    const found = list.find(a => a.id === id);
    if (!found) return;

    if (from === 'portfolio') setPortfolio(p => p.filter(a => a.id !== id));
    else                      setSafeAssets(p => p.filter(a => a.id !== id));

    if (to === 'sell') setSellQueue(p => [...p, found]);
    else               setBuyQueue(p  => [...p, found]);
  }, []);

  // Created once at mount — uses stable moveAsset callback
  const cursorSteps = useRef([
    { targetId: 'smallcap1',   action: 'click' as const, delayBefore: 1500, onComplete: () => moveAsset('smallcap1',  'portfolio', 'sell') },
    { targetId: 'midcap1',     action: 'click' as const, delayBefore: 1200, onComplete: () => moveAsset('midcap1',    'portfolio', 'sell') },
    { targetId: 'sgb1',        action: 'click' as const, delayBefore: 1200, onComplete: () => moveAsset('sgb1',       'safe',      'buy')  },
    { targetId: 'tbill1',      action: 'click' as const, delayBefore: 1200, onComplete: () => moveAsset('tbill1',     'safe',      'buy')  },
    { targetId: 'approve-btn', action: 'click' as const, delayBefore: 1500, onComplete: () => setApproved(true) },
  ]).current;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#08090c] p-6">
      {showCursor && (
        <GhostCursor steps={cursorSteps} onAllComplete={() => setShowCursor(false)} />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-orange-400" />
              Scenario: De-risk Portfolio
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Rebalance high-beta assets into safe havens ahead of the election.
            </p>
          </div>
          <button
            id="approve-btn"
            onClick={() => setApproved(true)}
            disabled={approved || (sellQueue.length === 0 && buyQueue.length === 0)}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {approved ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRightLeft className="w-5 h-5" />}
            {approved ? 'Execution Approved!' : 'Approve Execution'}
          </button>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {approved && (
            <motion.div
              key="banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-100"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <p><strong>Success!</strong> Portfolio rebalanced — high-risk assets liquidated, capital deployed into safe havens.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4-panel grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left column: Sources */}
          <div className="space-y-6">
            {/* Current Portfolio */}
            <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6">
              <h2 className="text-base font-bold text-gray-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Current Portfolio
              </h2>
              <div className="space-y-3 min-h-[80px]">
                <AnimatePresence mode="popLayout">
                  {portfolio.map(a => <AssetCard key={a.id} asset={a} />)}
                </AnimatePresence>
                {portfolio.length === 0 && (
                  <p className="text-gray-600 italic text-sm text-center py-4">No assets left.</p>
                )}
              </div>
            </div>

            {/* Safe Assets */}
            <div className="bg-[#12141a] border border-white/5 rounded-3xl p-6">
              <h2 className="text-base font-bold text-gray-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Available Safe Assets
              </h2>
              <div className="space-y-3 min-h-[80px]">
                <AnimatePresence mode="popLayout">
                  {safeAssets.map(a => <AssetCard key={a.id} asset={a} />)}
                </AnimatePresence>
                {safeAssets.length === 0 && (
                  <p className="text-gray-600 italic text-sm text-center py-4">All safe assets selected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Queues */}
          <div className="space-y-6">
            {/* Sell Queue */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <h2 className="text-base font-bold text-red-400 mb-4">🔴 Sell Queue (Liquidate)</h2>
              <div className="space-y-3 min-h-[120px]">
                <AnimatePresence mode="popLayout">
                  {sellQueue.length === 0
                    ? <DropZone key="sell-drop" label="High-risk assets will appear here" accent="border-red-500/30" />
                    : sellQueue.map(a => <AssetCard key={a.id} asset={a} />)
                  }
                </AnimatePresence>
              </div>
            </div>

            {/* Buy Queue */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <h2 className="text-base font-bold text-emerald-400 mb-4">🟢 Buy Queue (Deploy Capital)</h2>
              <div className="space-y-3 min-h-[120px]">
                <AnimatePresence mode="popLayout">
                  {buyQueue.length === 0
                    ? <DropZone key="buy-drop" label="Safe assets will appear here" accent="border-emerald-500/30" />
                    : buyQueue.map(a => <AssetCard key={a.id} asset={a} />)
                  }
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PortfolioRebalance;
