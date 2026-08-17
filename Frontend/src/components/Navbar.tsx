import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  Zap,
  BarChart3,
  Search,
  BookOpen,
  Menu,
  X,
  TrendingUp,
  Bot,
  Newspaper,
  LogOut,
  Settings,
  User,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onToggleAgent?: () => void;
  isAgentOpen?: boolean;
}

const Navbar = ({ onToggleAgent, isAgentOpen }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/screener', icon: Search, label: 'Screener' },
    { path: '/commodities-insights', icon: TrendingUp, label: 'Commodities' },
    { path: '/blog', icon: BookOpen, label: 'Blog' },
    { path: '/news', icon: Newspaper, label: 'News' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  // Derive display name and initials from Clerk user
  const displayName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User';
  const firstName = user?.firstName || displayName.split(' ')[0];
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const avatarUrl = user?.imageUrl;

  return (
    <nav className="bg-theme-surface/90 border-b border-theme-border sticky top-0 z-50 backdrop-blur-2xl shadow-surface shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img
                src="/NammaStockLogo.png"
                alt="Namma Stocks"
                className="h-14 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-500/90 to-blue-600/90 bg-clip-text text-transparent drop-shadow-sm">
              Namma Stocks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium tracking-wide ${
                  isActive(item.path)
                    ? 'text-trade-action bg-blue-50 border border-blue-200 shadow-sm'
                    : 'text-content-secondary hover:text-content-primary hover:bg-theme-canvas border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="w-px h-6 bg-theme-border mx-2" />

            <button
              onClick={onToggleAgent}
              className={`relative flex items-center shrink-0 space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold tracking-wide group overflow-hidden ${
                isAgentOpen
                  ? 'text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'hover:text-white shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            >
              {/* Active/Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-opacity duration-300 ${
                isAgentOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
              
              {/* Inactive Subtle Background & Border */}
              <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/5 border border-cyan-500/30 rounded-xl transition-opacity duration-300 ${
                isAgentOpen ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
              }`} />
              
              <div className="relative z-10 flex items-center space-x-2">
                <Bot className={`w-4 h-4 shrink-0 ${!isAgentOpen ? 'text-cyan-500 group-hover:text-white transition-colors duration-300' : ''}`} />
                <span className={`whitespace-nowrap ${!isAgentOpen ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent group-hover:text-white transition-all duration-300' : ''}`}>
                  Stockie
                </span>
                
                {!isAgentOpen && (
                  <span className="hidden lg:flex items-center shrink-0 gap-1 bg-theme-surface/80 group-hover:bg-white/20 border border-cyan-500/20 group-hover:border-transparent px-1.5 py-0.5 rounded text-[10px] ml-1 transition-all duration-300">
                    <span className="font-mono text-cyan-600 dark:text-cyan-400 group-hover:text-white">⌘</span>
                    <span className="text-cyan-600 dark:text-cyan-400 group-hover:text-white">K</span>
                  </span>
                )}
              </div>
            </button>

            <div className="w-px h-6 bg-theme-border mx-1" />

            {/* ---- User profile dropdown ---- */}
            {isLoaded && (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-theme-canvas border border-transparent hover:border-theme-border transition-all duration-200 group"
                  aria-label="User menu"
                >
                  {/* Avatar */}
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all">
                      {initials}
                    </div>
                  )}

                  {/* Name */}
                  <span className="text-sm font-medium text-content-primary hidden lg:block whitespace-nowrap">
                    {firstName}
                  </span>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-content-secondary transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 bg-theme-surface border border-theme-border rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-theme-border bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={displayName}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/40"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-content-primary truncate">
                              {displayName}
                            </p>
                            <p className="text-xs text-content-secondary truncate">
                              {user?.primaryEmailAddress?.emailAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-2 px-2">
                        <button
                          onClick={() => { setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-content-secondary hover:text-content-primary hover:bg-theme-canvas transition-all"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>

                        <div className="my-1 border-t border-theme-border" />

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile avatar */}
            {isLoaded && (
              <button
                onClick={() => setIsProfileOpen((p) => !p)}
                className="relative"
                aria-label="User menu"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
              </button>
            )}

            <button
              onClick={onToggleAgent}
              className={`relative p-2 rounded-lg transition-all duration-300 ${
                isAgentOpen 
                  ? 'text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                  : 'text-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20'
              }`}
            >
              <Bot className="w-6 h-6" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-theme-canvas transition-colors text-content-secondary"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-theme-border overflow-hidden"
            >
              <div className="flex flex-col py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive(item.path)
                        ? 'text-trade-action bg-blue-50 border border-blue-200'
                        : 'text-content-secondary hover:text-content-primary hover:bg-theme-canvas border border-transparent'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                {/* Mobile sign out */}
                {isLoaded && (
                  <>
                    <div className="border-t border-theme-border my-1" />
                    <div className="px-4 py-2 flex items-center gap-3">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-content-primary truncate">{displayName}</p>
                        <p className="text-xs text-content-secondary truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium border border-transparent"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign out</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;