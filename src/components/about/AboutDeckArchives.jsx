'use client';

import React from 'react';
import { motion } from 'motion/react';

const TIMELINE = [
  { year: "2950", title: "Genesis", desc: "Squad's first proper entry. Scene officially live." },
  { year: "2952", title: "Routes Set", desc: "KMHQ locked in its GPS confidence on Stanton routes." },
  { year: "2954", title: "Pyro Trip", desc: "Outpost set, tea imaginary, danger very real." }
];

export default function AboutDeckArchives() {
  return (
    <section className="deck-section w-screen h-screen flex-shrink-0 relative overflow-hidden bg-[#05070A] border-l border-emerald-500/10">
      <div className="absolute inset-0 opacity-40">
        <img 
          src="/backgrounds/SC-3.22_20240110_133821_mT-flower-hill-sunset_f.png"
          alt="The Archives"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-12">
        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-emerald-500 text-[10px] tracking-[0.5em] uppercase mb-16 text-center"
          >
            ◈ Deck 04: Historical Archives ◈
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
             {TIMELINE.map((item, i) => (
               <motion.div 
                 key={item.year} 
                 initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                 whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                 transition={{ delay: i * 0.2, duration: 0.8 }}
                 className="space-y-6 bg-white/[0.02] backdrop-blur-md p-10 rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
               >
                  {/* Glowing background on hover */}
                  <div className="absolute -inset-24 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10">
                    <div className="font-mono text-5xl font-bold text-white/20 group-hover:text-emerald-500 transition-colors duration-500">{item.year}</div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {item.desc}
                    </p>
                  </div>
               </motion.div>
             ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-24 text-center"
          >
            <button className="px-12 py-4 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-mono text-[10px] tracking-[0.5em] hover:bg-emerald-500/10 transition-all uppercase hover:scale-105 active:scale-95">
              View Full History
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
