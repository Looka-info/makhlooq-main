'use client';

import React from 'react';
import { motion } from 'motion/react';

const TIMELINE = [
  { year: '2950', title: 'Genesis', desc: "Squad's first proper entry. Scene officially live." },
  { year: '2952', title: 'Routes Set', desc: 'KMHQ locked in its GPS confidence on Stanton routes.' },
  { year: '2954', title: 'Pyro Trip', desc: 'Outpost set, tea imaginary, danger very real.' },
];

export default function AboutDeckArchives() {
  return (
    <section className="relative overflow-hidden bg-[#040806] border-t border-white/10">
      <div className="absolute inset-0 opacity-30">
        <img
          src="/backgrounds/SC-3.22_20240110_133821_mT-flower-hill-sunset_f.png"
          alt="Historical Archives"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-12">
        <div className="mb-16 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.55em] text-emerald-500/60 mb-4">
            ◈ Deck 04: Historical Archives ◈
          </div>
          <div className="text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
            2950
            <div className="mt-4 mb-8 text-3xl font-bold uppercase tracking-[0.18em] text-white">Genesis</div>
            <p className="text-gray-400">Squad's first proper entry. Scene officially live.</p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {TIMELINE.map((item, index) => (
            <motion.article
              key={item.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 shadow-[0_24px_90px_rgba(0,0,0,0.2)]"
            >
              <div className="font-mono text-5xl font-bold text-white/15 mb-4">{item.year}</div>
              <h3 className="text-2xl font-bold uppercase tracking-[0.18em] text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="inline-flex items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-12 py-4 text-sm font-black uppercase tracking-[0.35em] text-emerald-400 transition-all hover:bg-emerald-500/10 active:scale-[0.98]">
            View Full History
          </button>
        </div>
      </div>
    </section>
  );
}
