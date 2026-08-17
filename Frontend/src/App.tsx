import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Screener from './pages/Screener';
import ScreenerCompare from './pages/ScreenerCompare';
import StockDetail from './pages/StockDetail';
import Blog from './pages/Blog';
import ArticleForm from './pages/ArticleForm';
import TextileInsights from './pages/TextileInsights';
import CommoditiesInsights from './pages/CommoditiesInsights';
import News from './pages/News';
import AskStockieModal from './components/AskBoltModal';

import TimeTravel from './pages/TimeTravel';
import PortfolioRebalance from './pages/PortfolioRebalance';

/**
 * Wrap a route element so it requires authentication.
 * If the user is signed out, Clerk redirects them to the sign-in page.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/sign-in') || location.pathname.startsWith('/sign-up');
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  return (
    <div className="h-screen bg-theme-canvas text-content-primary flex overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {!isAuthPage && (
          <SignedIn>
            <Navbar onToggleAgent={() => setIsAgentOpen(prev => !prev)} isAgentOpen={isAgentOpen} />
          </SignedIn>
        )}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* Public routes — Clerk's hosted components (/* catches sso-callback sub-routes) */}
            <Route path="/sign-in/*" element={<Auth mode="sign-in" />} />
            <Route path="/sign-up/*" element={<Auth mode="sign-up" />} />

            {/* Redirect root → sign-in when signed out, dashboard when signed in */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
                  <SignedOut><Navigate to="/sign-in" replace /></SignedOut>
                </>
              }
            />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/screener" element={<ProtectedRoute><Screener /></ProtectedRoute>} />
            <Route path="/screener/compare" element={<ProtectedRoute><ScreenerCompare /></ProtectedRoute>} />
            <Route path="/portfolio/rebalance" element={<ProtectedRoute><PortfolioRebalance /></ProtectedRoute>} />
            <Route path="/time-travel" element={<ProtectedRoute><TimeTravel /></ProtectedRoute>} />
            <Route path="/stock/:symbol" element={<ProtectedRoute><StockDetail /></ProtectedRoute>} />
            <Route path="/commodities-insights" element={<ProtectedRoute><CommoditiesInsights /></ProtectedRoute>} />
            <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
            <Route path="/blog/new" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>

      {/* Agent Right Sidebar — only shown when signed in and not on auth pages */}
      {!isAuthPage && (
        <SignedIn>
          <AskStockieModal isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />
        </SignedIn>
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#111827',
            border: '1px solid #E5E7EB',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          }
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;