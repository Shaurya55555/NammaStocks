import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostCursorProps {
  steps: {
    targetId: string;
    action: 'click' | 'type';
    text?: string;
    delayBefore: number;
    onComplete?: () => void | Promise<void>;
  }[];
  onAllComplete?: () => void;
}

const GhostCursor = ({ steps, onAllComplete }: GhostCursorProps) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight });
  const [isClicking, setIsClicking] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      if (onAllComplete) onAllComplete();
      return;
    }

    const step = steps[currentStepIndex];
    let timeoutId: NodeJS.Timeout;

    const executeStep = () => {
      const el = document.getElementById(step.targetId);
      if (!el) {
        console.warn(`GhostCursor: Target ${step.targetId} not found. Skipping.`);
        setCurrentStepIndex(prev => prev + 1);
        return;
      }

      const rect = el.getBoundingClientRect();
      // Move to center of element
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });

      // Wait for movement to finish (approx 1s), then perform action
      timeoutId = setTimeout(async () => {
        if (step.action === 'click') {
          setIsClicking(true);
          setTimeout(async () => {
            setIsClicking(false);
            if (step.onComplete) {
              await step.onComplete();
            }
            
            // Move to next step after a short delay
            setTimeout(() => {
              setCurrentStepIndex(prev => prev + 1);
            }, 500);
          }, 200);
        } else if (step.action === 'type') {
          // Simulated typing effect could go here
          if (step.onComplete) {
            await step.onComplete();
          }
          setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
          }, 500);
        }
      }, 1000); // Wait for cursor to travel
    };

    timeoutId = setTimeout(executeStep, step.delayBefore);

    return () => clearTimeout(timeoutId);
  }, [currentStepIndex, steps, onAllComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: position.x, y: position.y }}
        animate={{ 
          opacity: 1, 
          x: position.x, 
          y: position.y,
          scale: isClicking ? 0.9 : 1
        }}
        exit={{ opacity: 0 }}
        transition={{ 
          x: { type: "spring", stiffness: 150, damping: 20, mass: 0.8 },
          y: { type: "spring", stiffness: 150, damping: 20, mass: 0.8 },
          scale: { duration: 0.1 }
        }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-start"
        style={{ transformOrigin: "top left" }}
      >
        <div className="relative">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="drop-shadow-2xl"
            style={{ transform: 'rotate(-10deg)' }}
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" fill="#06b6d4" />
          </svg>
          {isClicking && (
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-0 left-0 w-8 h-8 bg-cyan-400 rounded-full mix-blend-screen"
              style={{ transform: 'translate(-10%, -10%)' }}
            />
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="ml-2 mt-4 px-3 py-1.5 bg-cyan-950/80 backdrop-blur-md text-cyan-50 text-[10px] font-mono uppercase tracking-widest rounded-full shadow-lg shadow-cyan-500/20 border border-cyan-400/40 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          Stockie
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GhostCursor;
