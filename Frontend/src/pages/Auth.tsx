import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Bot, Newspaper, Scale, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthProps {
  /** 'sign-in' renders the Clerk SignIn widget; 'sign-up' renders SignUp */
  mode: 'sign-in' | 'sign-up';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const clerkAppearance = {
    variables: {
      colorPrimary: '#3B82F6',
      colorBackground: '#FFFFFF',
      colorInputBackground: '#F8FAFC',
      colorInputText: '#0F172A',
      colorText: '#0F172A',
      colorTextSecondary: '#64748B',
      colorNeutral: '#E2E8F0',
      borderRadius: '1rem',
      fontFamily: 'inherit',
    },
    elements: {
      card: 'bg-theme-surface shadow-2xl shadow-blue-900/5 border border-theme-border rounded-[1.5rem]',
      headerTitle: 'text-content-primary text-3xl font-black tracking-tight',
      headerSubtitle: 'text-content-secondary font-medium mt-1',
      socialButtonsBlockButton:
        'bg-theme-surface border border-theme-border text-content-primary hover:bg-theme-canvas hover:border-gray-300 transition-all shadow-sm rounded-xl',
      socialButtonsBlockButtonText: 'text-content-primary font-bold',
      dividerLine: 'bg-theme-border',
      dividerText: 'text-content-secondary font-medium',
      formFieldLabel: 'text-content-primary font-bold text-sm mb-1.5',
      formFieldInput:
        'bg-theme-canvas border-theme-border text-content-primary placeholder-gray-400 focus:ring-2 focus:ring-trade-action/20 focus:border-trade-action rounded-xl transition-all shadow-sm',
      formButtonPrimary:
        'bg-trade-action hover:bg-blue-600 text-white font-bold transition-all shadow-md shadow-blue-500/20 py-2.5 rounded-xl',
      footerActionLink: 'text-trade-action hover:text-blue-700 font-bold transition-colors',
      identityPreviewText: 'text-content-primary font-medium',
      identityPreviewEditButtonIcon: 'text-content-secondary hover:text-content-primary',
      footerActionText: 'text-content-secondary font-medium',
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const floatAnimation1 = {
    y: [0, -15, 0],
    rotate: [0, 2, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
  };

  const floatAnimation2 = {
    y: [0, 20, 0],
    rotate: [0, -3, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }
  };

  const floatAnimation3 = {
    y: [0, -10, 0],
    rotate: [0, 1, 0],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }
  };

  return (
    <div className="min-h-screen bg-theme-canvas flex font-sans text-content-primary selection:bg-trade-action/20 overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Left Side — Highly Animated Branding Panel                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:flex lg:w-[50%] bg-theme-surface relative flex-col justify-between p-12 border-r border-theme-border overflow-hidden">
        
        {/* Dynamic Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-50/80 via-white to-white pointer-events-none" />
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" 
        />
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" 
        />

        {/* Floating Decorative Elements representing AI Capabilities */}
        <motion.div 
          animate={floatAnimation1}
          className="absolute top-[20%] right-[5%] z-0 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-purple-900/5 p-4 rounded-2xl w-56"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-content-secondary">AI Chatbot</p>
              <p className="text-sm font-black text-content-primary">"How is Reliance doing?"</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={floatAnimation2}
          className="absolute bottom-[35%] right-[20%] z-0 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-900/5 p-4 rounded-2xl w-60"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-trade-action" />
            </div>
            <div>
              <p className="text-xs font-bold text-content-secondary">AI Comparison</p>
              <p className="text-sm font-black text-content-primary">TCS vs Infosys analysis...</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={floatAnimation3}
          className="absolute top-[50%] left-[80%] z-0 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-green-900/5 p-4 rounded-2xl w-48"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-trade-gain" />
            </div>
            <div>
              <p className="text-xs font-bold text-content-secondary">NIFTY 50</p>
              <p className="text-sm font-black text-trade-gain">+1.45%</p>
            </div>
          </div>
        </motion.div>


        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            {/* Removed drop shadow and added mix-blend-multiply to completely drop the white background */}
            <img 
              src="/NammaStockLogo.png" 
              alt="NammaStocks Logo" 
              className="w-16 h-16 object-contain mix-blend-multiply contrast-125" 
            />
            <span className="text-3xl font-black tracking-tight text-content-primary">
              NammaStocks
            </span>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-10 mt-12 max-w-lg"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-[3.75rem] font-black leading-[1.05] tracking-tight text-content-primary">
              Supercharge your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-trade-action via-blue-600 to-purple-600">
                trading with AI.
              </span>
            </h1>
            <p className="text-content-secondary text-xl leading-relaxed font-medium">
              Experience the future of investing. Our advanced AI agents analyze, compare, and screen the market for you in real-time.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6 pt-6">
            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-5 cursor-default group transition-transform">
              <div className="p-3 rounded-2xl bg-blue-50 text-trade-action group-hover:bg-trade-action group-hover:text-white transition-colors duration-300 shadow-sm">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg text-content-primary">Smart AI Comparison</p>
                <p className="text-sm text-content-secondary font-medium">Instantly compare financials and metrics.</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-5 cursor-default group transition-transform">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg text-content-primary">Intelligent Chatbot</p>
                <p className="text-sm text-content-secondary font-medium">Your 24/7 personal financial assistant.</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-5 cursor-default group transition-transform">
              <div className="p-3 rounded-2xl bg-green-50 text-trade-gain group-hover:bg-trade-gain group-hover:text-white transition-colors duration-300 shadow-sm">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg text-content-primary">AI Screener &amp; News</p>
                <p className="text-sm text-content-secondary font-medium">Real-time sentiment and news analysis.</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="relative z-10 flex items-center gap-4 text-content-secondary text-sm font-semibold"
        >
          © {new Date().getFullYear()} NammaStocks. Empowered by AI.
        </motion.div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right Side — Clerk hosted widget                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full lg:w-[50%] flex flex-col relative items-center justify-center p-6 sm:p-12">
        {/* Subtle background blob for right side */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-50/50 via-transparent to-transparent pointer-events-none" />

        {/* Mobile Header */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:hidden flex flex-col items-center gap-1 z-10">
          <img 
            src="/NammaStockLogo.png" 
            alt="NammaStocks Logo" 
            className="w-14 h-14 object-contain mix-blend-multiply contrast-125" 
          />
          <span className="text-2xl font-black text-content-primary tracking-tight">NammaStocks</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-[440px] mt-20 lg:mt-0 relative z-10"
        >
          {mode === 'sign-in' ? (
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/dashboard"
              appearance={clerkAppearance}
            />
          ) : (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/dashboard"
              appearance={clerkAppearance}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

