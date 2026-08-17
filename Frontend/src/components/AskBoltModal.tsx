import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, Zap, Bot, X, TrendingUp, Clock, Scale,
  StopCircle, User, ArrowRight, Command,
} from 'lucide-react';
import { useAgent, AgentMessage, AgentAction } from '../hooks/useAgent';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Slash command definitions — single source of truth
// ---------------------------------------------------------------------------

interface SlashCommandDef {
  cmd: string;           // e.g. "/compare"
  args: string;          // human-readable args, e.g. "<SYM1> <SYM2> [...]"
  description: string;
  example: string;       // full example string inserted on Tab/click
  icon: React.ElementType;
}

const SLASH_COMMANDS: SlashCommandDef[] = [
  {
    cmd: '/compare',
    args: '<SYM1> <SYM2> [...]',
    description: 'Compare stocks side-by-side',
    example: '/compare TCS INFY',
    icon: TrendingUp,
  },
  {
    cmd: '/timetravel',
    args: '<SYM1> <SYM2>',
    description: 'Run a visual backtest',
    example: '/timetravel TCS HDFCBANK',
    icon: Clock,
  },
  {
    cmd: '/rebalance',
    args: '',
    description: 'Open portfolio rebalancer',
    example: '/rebalance',
    icon: Scale,
  },
];

// ---------------------------------------------------------------------------
// Slash command autocomplete dropdown
// ---------------------------------------------------------------------------

const SlashMenu = ({
  query,
  onSelect,
}: {
  query: string;         // text after the leading "/"
  onSelect: (example: string) => void;
}) => {
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return SLASH_COMMANDS.filter(c => c.cmd.slice(1).startsWith(q));
  }, [query]);

  if (!filtered.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute bottom-full left-0 right-0 mb-2 bg-theme-canvas border border-theme-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden z-50"
    >
      <div className="px-3 py-2 border-b border-theme-border flex items-center gap-2">
        <Command className="w-3 h-3 text-trade-action" />
        <span className="text-[10px] font-semibold text-content-secondary uppercase tracking-widest">
          Slash Commands
        </span>
      </div>
      {filtered.map((c) => (
        <motion.button
          key={c.cmd}
          whileHover={{ backgroundColor: 'rgba(0,184,217,0.06)' }}
          onClick={() => onSelect(c.example)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors group"
        >
          <div className="w-7 h-7 rounded-lg bg-trade-action/10 flex items-center justify-center shrink-0">
            <c.icon className="w-3.5 h-3.5 text-trade-action" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] font-semibold text-content-primary font-mono">{c.cmd}</span>
              {c.args && (
                <span className="text-[11px] text-content-secondary font-mono">{c.args}</span>
              )}
            </div>
            <p className="text-[11px] text-content-secondary truncate">{c.description}</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-content-secondary group-hover:text-trade-action transition-colors shrink-0" />
        </motion.button>
      ))}
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Proposal widget — driven by typed AgentAction (no regex)
// ---------------------------------------------------------------------------

const ProposalWidget = ({
  action,
  onNavigate,
}: {
  action: AgentAction;
  onNavigate: (action: AgentAction) => void;
}) => {
  const [state, setState] = useState<'pending' | 'cancelled'>('pending');
  if (state === 'cancelled') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="mt-3 bg-theme-canvas border border-trade-action/30 rounded-xl p-3.5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,184,217,0.15)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-600" />
      <p className="text-[13px] text-content-primary font-semibold flex items-center gap-2 pl-1 tracking-tight">
        <Zap className="w-3.5 h-3.5 text-trade-action" />
        {action.label}
      </p>
      <div className="flex gap-2 pl-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate(action)}
          className="flex-1 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-xs font-semibold text-white shadow-sm shadow-trade-action/20 transition-colors"
        >
          Execute
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setState('cancelled')}
          className="flex-1 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs font-medium text-content-secondary transition-colors"
        >
          Dismiss
        </motion.button>
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Single chat bubble
// ---------------------------------------------------------------------------

const ChatBubble = ({
  message,
  onNavigate,
}: {
  message: AgentMessage;
  onNavigate: (action: AgentAction) => void;
}) => {
  const isUser = message.role === 'user';
  const isSlashCmd = isUser && message.content.startsWith('/');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
        isUser
          ? 'bg-trade-action/20'
          : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-trade-action/20'
      }`}>
        {isUser
          ? <User className="w-3.5 h-3.5 text-trade-action" />
          : <Bot className="w-3.5 h-3.5 text-trade-action" />
        }
      </div>

      {/* Content */}
      <div className={`flex-1 ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed tracking-tight max-w-[90%] ${
          isUser
            ? isSlashCmd
              ? 'bg-theme-canvas border border-trade-action/40 text-trade-action rounded-tr-sm font-mono'
              : 'bg-trade-action text-white rounded-tr-sm'
            : 'bg-theme-canvas border border-theme-border text-content-primary rounded-tl-sm shadow-sm'
        }`}>
          {message.content}
        </div>

        {/* Action proposal widget (only on assistant messages) */}
        {!isUser && message.action && (
          <div className="w-full max-w-[90%]">
            <ProposalWidget action={message.action} onNavigate={onNavigate} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Streaming cursor
// ---------------------------------------------------------------------------

const StreamingBubble = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-2"
  >
    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-trade-action/20">
      <Bot className="w-3.5 h-3.5 text-trade-action" />
    </div>
    <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed tracking-tight bg-theme-canvas border border-theme-border text-content-primary shadow-sm max-w-[90%]">
      {text}
      <span className="inline-block w-0.5 h-3.5 bg-trade-action ml-0.5 animate-pulse align-middle" />
    </div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Thinking indicator (when no streaming text yet)
// ---------------------------------------------------------------------------

const ThinkingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-2"
  >
    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-trade-action/20">
      <Bot className="w-3.5 h-3.5 text-trade-action" />
    </div>
    <div className="flex items-center gap-3 text-content-secondary text-[13px] bg-theme-canvas p-3 rounded-2xl rounded-tl-sm border border-theme-border shadow-sm">
      <div className="flex space-x-1.5">
        <div className="w-1.5 h-1.5 bg-trade-action rounded-full animate-[bounce_1s_infinite]" />
        <div className="w-1.5 h-1.5 bg-trade-action rounded-full animate-[bounce_1s_infinite_0.15s]" />
        <div className="w-1.5 h-1.5 bg-trade-action rounded-full animate-[bounce_1s_infinite_0.3s]" />
      </div>
      <span className="font-medium tracking-tight">Stockie is thinking...</span>
    </div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Empty state suggestions — now slash-first
// ---------------------------------------------------------------------------

const SUGGESTIONS = [
  { icon: TrendingUp, text: '/compare TCS INFY RELIANCE', label: 'Compare stocks' },
  { icon: Clock,      text: '/timetravel HDFCBANK ICICIBANK', label: 'Backtest two stocks' },
  { icon: Scale,      text: '/rebalance', label: 'Rebalance portfolio' },
  { icon: TrendingUp, text: 'Is Reliance a good buy right now?', label: 'Ask anything' },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface AskStockieModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AskStockieModal = ({ isOpen, onClose }: AskStockieModalProps) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const {
    history,
    streamingText,
    isThinking,
    error,
    sendCommand,
    cancelRequest,
    clearHistory,
  } = useAgent();

  // Derive slash menu query from message content
  const slashMenuQuery = useMemo(() => {
    if (!message.startsWith('/')) return '';
    // Only show menu while typing the command word (no space yet means still typing cmd)
    const afterSlash = message.slice(1);
    if (afterSlash.includes(' ')) return ''; // args mode — hide menu
    return afterSlash;
  }, [message]);

  // Show/hide menu
  useEffect(() => {
    setShowSlashMenu(message.startsWith('/') && !message.slice(1).includes(' '));
  }, [message]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, streamingText, isThinking]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || message;
    if (!textToSend.trim() || isThinking) return;
    if (!customMessage) setMessage('');
    setShowSlashMenu(false);
    await sendCommand(textToSend);
  };

  const handleSlashSelect = (example: string) => {
    setMessage(example + ' ');
    setShowSlashMenu(false);
    inputRef.current?.focus();
  };

  /** Navigate based on typed AgentAction — no regex needed */
  const handleNavigate = (action: AgentAction) => {
    const symbols = action.payload.symbols?.join(',') ?? '';
    switch (action.type) {
      case 'NAVIGATE_COMPARE':
        navigate(`/screener/compare?symbols=${symbols}&drive=true`);
        break;
      case 'NAVIGATE_TIMETRAVEL':
        navigate(`/time-travel?drive=true&symbols=${symbols}`);
        break;
      case 'NAVIGATE_REBALANCE':
        navigate('/portfolio/rebalance?drive=true');
        break;
      default:
        console.warn('[AskStockie] Unknown action type:', action.type);
    }
  };

  const isSlashMode = message.startsWith('/');
  const isEmpty = history.length === 0 && !isThinking && !error;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          className="border-l border-theme-border bg-theme-surface flex flex-col h-full shrink-0 shadow-[-12px_0_40px_rgba(0,0,0,0.08)] z-40 relative overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-theme-border flex items-center justify-between bg-theme-canvas shrink-0 min-w-[360px]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                <Sparkles className="w-4 h-4 text-trade-action" />
              </div>
              <div>
                <span className="font-semibold text-content-primary text-[13px] tracking-wide">Stockie Agent</span>
                {isThinking && (
                  <span className="block text-[10px] text-trade-action font-medium animate-pulse">
                    Analyzing...
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={clearHistory}
                  className="text-[11px] font-medium text-content-secondary hover:text-content-primary transition-colors px-2 py-1 rounded-md hover:bg-theme-surface"
                >
                  Clear
                </motion.button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-content-secondary hover:text-content-primary hover:bg-theme-border rounded-lg transition-colors border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin min-w-[360px] bg-theme-surface">
            {/* Empty state */}
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="h-full flex flex-col justify-center py-8"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-theme-canvas to-theme-surface rounded-2xl flex items-center justify-center mb-5 border border-theme-border shadow-sm ring-1 ring-white/5">
                  <Bot className="w-6 h-6 text-trade-action drop-shadow-[0_0_8px_rgba(0,184,217,0.5)]" />
                </div>
                <h3 className="text-[15px] font-semibold text-content-primary mb-1.5 tracking-tight">How can I help?</h3>
                <p className="text-[13px] text-content-secondary leading-relaxed mb-6 max-w-[260px]">
                  Ask anything, or use{' '}
                  <span className="text-trade-action font-mono font-semibold">/commands</span>{' '}
                  to trigger actions instantly.
                </p>

                {/* Slash command quick reference */}
                <div className="mb-4 bg-theme-canvas border border-theme-border rounded-xl p-3 space-y-2">
                  <p className="text-[10px] font-semibold text-content-secondary uppercase tracking-widest flex items-center gap-1.5">
                    <Command className="w-3 h-3" /> Commands
                  </p>
                  {SLASH_COMMANDS.map(c => (
                    <button
                      key={c.cmd}
                      onClick={() => handleSendMessage(c.example)}
                      className="w-full flex items-center gap-2 text-left group"
                    >
                      <span className="text-[12px] font-mono font-semibold text-trade-action group-hover:underline">{c.cmd}</span>
                      {c.args && <span className="text-[11px] font-mono text-content-secondary">{c.args}</span>}
                      <span className="ml-auto text-[10px] text-content-secondary group-hover:text-content-primary transition-colors">{c.description}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2 w-full max-w-[280px]">
                  {SUGGESTIONS.map((s, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendMessage(s.text)}
                      className="flex items-center gap-3 p-3 text-left bg-theme-canvas hover:bg-theme-surface border border-theme-border hover:border-trade-action/50 rounded-xl transition-colors group shadow-sm"
                    >
                      <div className="p-1.5 bg-theme-surface group-hover:bg-trade-action/10 rounded-md transition-colors">
                        <s.icon className="w-3.5 h-3.5 text-content-secondary group-hover:text-trade-action transition-colors" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-[12px] font-medium tracking-tight group-hover:text-trade-action transition-colors ${
                          s.text.startsWith('/') ? 'font-mono text-trade-action/80' : 'text-content-primary'
                        }`}>
                          {s.text}
                        </span>
                        <span className="text-[10px] text-content-secondary">{s.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-trade-loss text-[13px] flex items-start gap-2.5 bg-trade-loss/10 p-3.5 rounded-xl border border-trade-loss/20 shadow-sm"
              >
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{error}</span>
              </motion.div>
            )}

            {/* Message bubbles */}
            {history.map((msg, idx) => (
              <ChatBubble key={idx} message={msg} onNavigate={handleNavigate} />
            ))}

            {/* Streaming / thinking state */}
            {isThinking && (
              streamingText
                ? <StreamingBubble text={streamingText} />
                : <ThinkingIndicator />
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-theme-border bg-theme-canvas min-w-[360px] shadow-[0_-4px_24px_rgba(0,0,0,0.05)] z-10">
            {/* Slash command autocomplete */}
            <div ref={inputWrapperRef} className="relative">
              <AnimatePresence>
                {showSlashMenu && (
                  <SlashMenu query={slashMenuQuery} onSelect={handleSlashSelect} />
                )}
              </AnimatePresence>

              <div className={`flex items-end space-x-2 bg-theme-surface border rounded-xl p-2.5 focus-within:ring-2 shadow-inner transition-all ${
                isSlashMode
                  ? 'border-trade-action/50 ring-1 ring-trade-action/20'
                  : 'border-theme-border focus-within:border-trade-action/50 focus-within:ring-trade-action/20'
              }`}>
                {isSlashMode && (
                  <div className="self-center mb-0.5 shrink-0">
                    <Command className="w-3.5 h-3.5 text-trade-action" />
                  </div>
                )}
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Escape' && showSlashMenu) {
                      e.preventDefault();
                      setShowSlashMenu(false);
                      return;
                    }
                    if (e.key === 'Tab' && showSlashMenu) {
                      e.preventDefault();
                      const filtered = SLASH_COMMANDS.filter(c =>
                        c.cmd.slice(1).startsWith(slashMenuQuery.toLowerCase())
                      );
                      if (filtered.length === 1) handleSlashSelect(filtered[0].example);
                      return;
                    }
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isSlashMode ? 'compare TCS INFY ...' : 'Ask Stockie, or type / for commands...'}
                  className="flex-1 bg-transparent border-none text-content-primary text-[13px] p-1.5 resize-none max-h-32 min-h-[40px] focus:ring-0 focus:outline-none placeholder:text-content-secondary/60 scrollbar-thin tracking-tight font-mono"
                  disabled={isThinking}
                  rows={1}
                />
                {isThinking ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelRequest}
                    className="p-2 mb-0.5 bg-trade-loss/10 text-trade-loss rounded-lg hover:bg-trade-loss/20 transition-all shrink-0 border border-trade-loss/30"
                    title="Cancel"
                  >
                    <StopCircle className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim()}
                    className="p-2 mb-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-cyan-500/20 shrink-0"
                  >
                    <Send className="w-4 h-4 translate-x-px" />
                  </motion.button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 px-1.5 text-[10px] text-content-secondary/80 font-medium tracking-wide uppercase">
              <p>Enter to send · Tab to complete</p>
              <p>Shift+Enter for newline</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AskStockieModal;