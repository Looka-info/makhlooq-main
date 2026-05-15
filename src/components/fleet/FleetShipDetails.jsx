'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

function SpecBar({ label, value, pct, color, delay }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-mono font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function FleetShipDetails({ ship }) {
  if (!ship) return null;

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fleet-details"
    >
      {/* Scan line divider */}
      <div className="fleet-scanline mb-5" />

      {/* Ship Identity */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ship.id + '-header'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color: ship.accentColor }}>
            {ship.manufacturer}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1 font-mono">{ship.name}</h1>
          <div className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-4">{ship.role}</div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">{ship.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Quick Stats */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ship.id + '-stats'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-2 mb-6"
        >
          {[
            { label: 'Length', val: ship.length },
            { label: 'Crew', val: ship.crew },
            { label: 'Cargo', val: ship.cargo },
            { label: 'Top Speed', val: ship.topSpeed },
          ].map((s) => (
            <div key={s.label} className="bg-black/40 rounded-lg p-3 border border-white/5">
              <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mb-1">{s.label}</div>
              <div className="text-sm font-bold font-mono" style={{ color: ship.accentColor }}>{s.val}</div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Spec Bars */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ship.id + '-bars'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-3">Combat Profile</div>
          {Object.values(ship.specs).map((spec, i) => (
            <SpecBar
              key={spec.label}
              label={spec.label}
              value={spec.value}
              pct={spec.pct}
              color={ship.accentColor}
              delay={0.4 + i * 0.1}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Weapons */}
      <div className="mb-6">
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">Armament</div>
        <div className="text-xs font-mono text-white/80 bg-black/30 rounded-lg px-3 py-2 border border-white/5">
          {ship.weapons}
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">Systems</div>
        <div className="flex flex-wrap gap-1.5">
          {ship.features.map((f) => (
            <span
              key={f}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono border"
              style={{
                background: ship.accentColor + '08',
                borderColor: ship.accentColor + '25',
                color: ship.accentColor,
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="fleet-scanline mb-5" />

      {/* Actions */}
      <div className="mt-auto space-y-2.5">
        <button className="fleet-btn-primary w-full" style={{ '--btn-color': ship.accentColor }}>
          Equip Loadout
        </button>
        <button className="fleet-btn-secondary w-full">
          Request Insurance
        </button>
      </div>
    </motion.aside>
  );
}
