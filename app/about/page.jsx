'use client';

import React from 'react';
import Header from '../../src/components/Header';
import AboutDeckBridge from '../../src/components/about/AboutDeckBridge';
import AboutDeckBriefing from '../../src/components/about/AboutDeckBriefing';
import AboutDeckHangar from '../../src/components/about/AboutDeckHangar';
import AboutDeckArchives from '../../src/components/about/AboutDeckArchives';
import AboutNews from '../../src/components/about/AboutNews';

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen selection:bg-emerald-500/30 relative">
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      <div className="fixed inset-0 pointer-events-none z-[100] bg-gradient-to-b from-black/40 via-transparent to-black/40 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      <Header />

      <main className="relative z-10">
        <AboutDeckBridge />
        <AboutDeckBriefing />
        <AboutDeckHangar />
        <AboutDeckArchives />
        <AboutNews />
      </main>
    </div>
  );
}
