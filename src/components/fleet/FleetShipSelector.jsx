'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function FleetShipSelector({ ships, selectedIndex, onSelect }) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fleet-sidebar"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/5">
        <h2 className="font-mono text-xs tracking-[0.3em] text-emerald-400 uppercase mb-3">Hangar Assets</h2>
        <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase tracking-widest">
          <span>Ships: {ships.length}</span>
          <span className="text-emerald-400/70">Fleet Online</span>
        </div>
      </div>

      {/* Ship List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 fleet-scrollbar">
        {ships.map((ship, index) => {
          const isActive = index === selectedIndex;
          return (
            <motion.button
              key={ship.id}
              onClick={() => onSelect(index)}
              className={`w-full text-left flex items-center gap-4 px-4 py-4 mb-1.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/10 to-transparent border-l-2'
                  : 'hover:bg-white/3 border-l-2 border-transparent'
              }`}
              style={isActive ? { borderLeftColor: ship.accentColor } : {}}
              whileHover={{ x: isActive ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Thumbnail */}
              <div
                className="w-14 h-10 rounded-lg overflow-hidden border flex-shrink-0 relative"
                style={{ borderColor: isActive ? ship.accentColor + '60' : '#ffffff10' }}
              >
                <img
                  src={ship.thumbnail}
                  alt={ship.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                />
                {isActive && (
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${ship.accentColor}20, transparent)` }}
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {ship.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gray-600 truncate font-mono">
                  {ship.role}
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="ship-indicator"
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: ship.accentColor, boxShadow: `0 0 8px ${ship.accentColor}` }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-[9px] text-gray-600 uppercase tracking-widest font-mono mb-1">Fleet Value</div>
            <div className="text-emerald-400 text-sm font-bold font-mono">48.2M aUEC</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-[9px] text-gray-600 uppercase tracking-widest font-mono mb-1">Total Crew</div>
            <div className="text-white text-sm font-bold font-mono">32</div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
