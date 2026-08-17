import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardApi } from '../api/Dashboard'; // Can be removed later

const Heatmap = ({ data = [] }: { data?: any[] }) => {
  const sectors = data;

  const getColor = (change: number) => {
    if (change >= 2)  return { bg: '#10B981', text: '#ffffff', border: '#059669' }; 
    if (change >= 1)  return { bg: '#34D399', text: '#064E3B', border: '#10B981' }; 
    if (change > 0)   return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' }; 
    if (change === 0) return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' }; 
    if (change > -1)  return { bg: '#FFE4E6', text: '#9F1239', border: '#FECDD3' }; 
    if (change > -2)  return { bg: '#FB7185', text: '#4C0519', border: '#F43F5E' }; 
    return            { bg: '#F43F5E', text: '#ffffff', border: '#E11D48' }; 
  };

  const getSize = (size: string) => {
    switch (size) {
      case 'large': return 'col-span-2 row-span-2 min-h-[10rem] p-4';
      case 'medium': return 'col-span-2 min-h-[5rem] p-3';
      default: return 'min-h-[5rem] p-2';
    }
  };

  const getTitleClass = (size: string) => {
    switch (size) {
      case 'large': return 'text-base md:text-lg';
      case 'medium': return 'text-sm md:text-base';
      default: return 'text-[11px] leading-tight md:text-xs break-words';
    }
  };

  const getValueClass = (size: string) => {
    switch (size) {
      case 'large': return 'text-xl md:text-2xl';
      case 'medium': return 'text-base md:text-xl';
      default: return 'text-sm md:text-base';
    }
  };

  return (
    <div className="grid grid-cols-6 gap-1.5 h-auto min-h-[22rem]">
      {sectors.map((sector, index) => {
        const colors = getColor(sector.change);
        return (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -2, zIndex: 20 }}
            className={`${getSize(sector.size)} rounded-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden border shadow-sm transition-shadow hover:shadow-xl`}
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            {/* Hover shimmer */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300 pointer-events-none rounded-xl" />

            <div className="relative z-10 flex justify-between items-start">
              <h3 className={`font-bold tracking-tight ${getTitleClass(sector.size)}`}
                  style={{ color: colors.text }}>
                {sector.name}
              </h3>
              {sector.size === 'large' && (
                <span
                  className="text-[10px] uppercase font-bold tracking-widest opacity-70 px-1.5 py-0.5 rounded-md mt-0.5"
                  style={{ backgroundColor: `${colors.border}60` }}
                >
                  {sector.mcap}
                </span>
              )}
            </div>
            <div className="text-right relative z-10 mt-1">
              <p className={`font-black tracking-tighter ${getValueClass(sector.size)}`}
                 style={{ color: colors.text }}>
                {sector.change > 0 ? '+' : ''}{sector.change}%
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Heatmap;