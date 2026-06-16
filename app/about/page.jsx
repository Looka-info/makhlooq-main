'use client';

import React from 'react';
import Header from '../../src/components/Header';
import HorizontalAboutContainer from '../../src/components/about/HorizontalAboutContainer';
import AboutDeckBridge from '../../src/components/about/AboutDeckBridge';
import AboutDeckBriefing from '../../src/components/about/AboutDeckBriefing';
import AboutDeckHangar from '../../src/components/about/AboutDeckHangar';
import AboutDeckArchives from '../../src/components/about/AboutDeckArchives';

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen selection:bg-emerald-500/30 relative">
      {/* Cinematic Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      <div className="fixed inset-0 pointer-events-none z-[100] bg-gradient-to-b from-black/40 via-transparent to-black/40 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      
      <Header />
      
      <main>
        <HorizontalAboutContainer>
          <AboutDeckBridge />
          <AboutDeckBriefing />
          <AboutDeckHangar />
          <AboutDeckArchives />
        </HorizontalAboutContainer>
      </main>

      {/* Footer is typically hidden or placed at the end of horizontal flow, 
          but for simplicity, we can omit it or make it the 5th deck */}
      {/* <Footer /> */}
    </div>
  );
}
