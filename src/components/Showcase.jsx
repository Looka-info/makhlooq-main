'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

/* ─────────── Operations Data ─────────── */

const OPS = [
  {
    id: 'combat',
    label: 'Combat Operations',
    tag: 'STRIKE',
    stat: '98.7%',
    statLabel: 'Sortie success',
    image: '/backgrounds/SC-3.24_20241207_170744_Hornets-Over-Lake_f.png',
    desc: 'Coordinated strike wings executing precision engagements across contested sectors. From dogfights to capital-ship sieges, our pilots dominate every theater.',
    span: 'col-span-2 row-span-2',        // large hero tile
    minH: 'min-h-[420px] md:min-h-[520px]',
  },
  {
    id: 'recon',
    label: 'Reconnaissance',
    tag: 'INTEL',
    stat: '24/7',
    statLabel: 'Surveillance uptime',
    image: '/backgrounds/SC-4.0_20250128_103506_Pulse-standing-Daymar_f.png',
    desc: 'Stealth scouts mapping hostile space and feeding live telemetry to fleet command.',
    span: 'col-span-1 row-span-1',
    minH: 'min-h-[250px]',
  },
  {
    id: 'logistics',
    label: 'Supply & Logistics',
    tag: 'SUPPLY',
    stat: '3,200+',
    statLabel: 'SCU moved daily',
    image: '/backgrounds/SC-4.0_20250220_164548_Carrack-Through-Clouds-Pyro-IV_f.png',
    desc: 'Armored convoys and trade fleets keeping every forward base fueled and armed.',
    span: 'col-span-1 row-span-1',
    minH: 'min-h-[250px]',
  },
  {
    id: 'salvage',
    label: 'Salvage & Recovery',
    tag: 'SALVAGE',
    stat: '48M+',
    statLabel: 'aUEC recovered',
    image: '/backgrounds/SC-4.5.0_20251230_153316_Klescher-tunnel_f.png',
    desc: 'Reclaimer crews strip derelicts to the frame. Nothing goes to waste — every wreck funds the next operation.',
    span: 'col-span-1 row-span-1',
    minH: 'min-h-[250px]',
  },
  {
    id: 'exploration',
    label: 'Deep-Space Exploration',
    tag: 'PATHFINDER',
    stat: '12',
    statLabel: 'Systems charted',
    image: '/backgrounds/SC-4.0_20250225_100437_Carrack-Over-Bloom_f.png',
    desc: 'Carrack-led expeditions pushing beyond known space. We chart the unknown and claim it for the fleet.',
    span: 'col-span-2 row-span-1',
    minH: 'min-h-[280px]',
  },
];

/* ─────────── Single Tile ─────────── */

function OpTile({ op, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.08 * index, ease: 'easeOut' }}
      className={`${op.span} ${op.minH} relative rounded-2xl overflow-hidden group cursor-default border border-white/5 hover:border-emerald-500/25 transition-colors duration-500`}
    >
      {/* Background image */}
      <img
        src={op.image}
        alt={op.label}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />

      {/* Dark gradient — always visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Hover reveal — extra darken */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />

      {/* Scan-line accent (top edge) */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* ── Content ── */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
        {/* Tag badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-emerald-400/80">
            {op.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2 leading-tight">
          {op.label}
        </h3>

        {/* Description — revealed on hover */}
        <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-4 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
          {op.desc}
        </p>

        {/* Stat bar */}
        <div className="flex items-end gap-4 border-t border-white/5 pt-3">
          <span className="text-2xl md:text-3xl font-bold font-mono text-white leading-none"
            style={{ textShadow: '0 0 20px rgba(16,185,129,0.3)' }}
          >
            {op.stat}
          </span>
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-gray-500 pb-1">
            {op.statLabel}
          </span>
        </div>
      </div>

      {/* Corner brackets — subtle HUD touch */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

/* ─────────── Main Export ─────────── */

export default function Showcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="showcase" className="relative bg-[#05070A] py-28 md:py-36 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/4 blur-[140px] pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-emerald-400">
              Operations Theater
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              What We Do
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed">
              From surgical strike operations to deep-space logistics, every division
              operates with tactical precision and fleet-wide coordination.
            </p>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {OPS.map((op, i) => (
            <OpTile key={op.id} op={op} index={i} inView={inView} />
          ))}
        </div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent origin-center"
        />
      </div>
    </section>
  );
}
