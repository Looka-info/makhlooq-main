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
      className="fleet-details rounded-[2.5rem] border border-lime-300/10 bg-white/[0.03] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl"
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
          <div className="mb-2 text-xs font-mono font-black uppercase tracking-[0.26em] text-lime-300/45">
            {ship.manufacturer}
          </div>
          <h1 className="mb-2 text-4xl font-black uppercase leading-[0.92] tracking-[-0.08em] text-white">{ship.name}</h1>
          <div className="mb-5 text-sm font-mono font-black uppercase tracking-[0.24em] text-lime-100/35">{ship.role}</div>
          <p className="mb-6 text-base leading-relaxed text-white/52">{ship.description}</p>
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
            <div key={s.label} className="rounded-2xl border border-lime-300/10 bg-black/35 p-4">
              <div className="mb-1 text-[10px] font-mono font-black uppercase tracking-[0.24em] text-lime-300/35">{s.label}</div>
              <div className="text-base font-black text-white">{s.val}</div>
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
          <div className="mb-3 text-xs font-mono font-black uppercase tracking-[0.26em] text-lime-300/35">Combat Profile</div>
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
        <div className="mb-2 text-xs font-mono font-black uppercase tracking-[0.26em] text-lime-300/35">Armament</div>
        <div className="rounded-2xl border border-lime-300/10 bg-black/35 px-4 py-3 font-mono text-sm text-white/75">
          {ship.weapons}
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <div className="mb-2 text-xs font-mono font-black uppercase tracking-[0.26em] text-lime-300/35">Systems</div>
        <div className="flex flex-wrap gap-1.5">
          {ship.features.map((f) => (
            <span
              key={f}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono border"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.08)',
                color: '#e5e7eb',
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
        <button className="fleet-btn-primary w-full">
          Equip Loadout
        </button>
        <button className="fleet-btn-secondary w-full">
          Request Insurance
        </button>
      </div>
    </motion.aside>
  );
}
