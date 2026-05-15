'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function FleetHUD({ ship, onResetCamera, onPrev, onNext, totalShips, currentIndex }) {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Corner brackets */}
      <div className="fleet-bracket fleet-bracket-tl" />
      <div className="fleet-bracket fleet-bracket-tr" />
      <div className="fleet-bracket fleet-bracket-bl" />
      <div className="fleet-bracket fleet-bracket-br" />

      {/* Top-left: ship designation */}
      <div className="absolute top-6 left-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={ship?.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-[0.3em] mb-1">
              Active Asset
            </div>
            <div className="text-lg font-bold font-mono text-white tracking-tight">
              {ship?.name || '—'}
            </div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              {ship?.class || ''}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top-right: system time + telemetry */}
      <div className="absolute top-6 right-6 text-right">
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em] mb-1">UEE Standard Time</div>
        <div className="text-lg font-mono text-emerald-400 tabular-nums">{time}</div>
        <div className="flex items-center justify-end gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest">All Systems Nominal</span>
        </div>
      </div>

      {/* Bottom center: navigation controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto">
        <button
          onClick={onPrev}
          className="fleet-hud-btn"
          title="Previous ship"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            {(currentIndex + 1).toString().padStart(2, '0')} / {totalShips.toString().padStart(2, '0')}
          </span>
        </div>

        <button
          onClick={onNext}
          className="fleet-hud-btn"
          title="Next ship"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button onClick={onResetCamera} className="fleet-hud-btn" title="Reset camera">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
        </button>
      </div>

      {/* Bottom-left: keyboard hint */}
      <div className="absolute bottom-6 left-6">
        <div className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">
          ← → Navigate &nbsp;·&nbsp; Drag to orbit &nbsp;·&nbsp; Scroll to zoom
        </div>
      </div>

      {/* Scan line animation */}
      <div className="fleet-viewport-scanline" />
    </div>
  );
}
