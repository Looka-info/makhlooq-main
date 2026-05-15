'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Construction, ShieldAlert, Cpu } from 'lucide-react';

import { fleetShips } from '../../src/components/fleet/fleetData';
import FleetShipSelector from '../../src/components/fleet/FleetShipSelector';
import FleetShipDetails from '../../src/components/fleet/FleetShipDetails';
import FleetHUD from '../../src/components/fleet/FleetHUD';
import FleetIntro from '../../src/components/fleet/FleetIntro';

// Dynamic import — Three.js cannot run on the server
const FleetScene = dynamic(
  () => import('../../src/components/fleet/FleetScene'),
  { ssr: false, loading: () => null }
);

export default function FleetPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  // Set to true to show the "Under Construction" screen
  const [underMaintenance] = useState(true);

  const selectedShip = fleetShips[selectedIndex];

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i - 1 + fleetShips.length) % fleetShips.length);
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i + 1) % fleetShips.length);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setIsReady(true);
  }, []);

  if (underMaintenance) {
    return (
      <div className="min-h-screen bg-[#020403] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.05)_0%,_transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-2xl px-6"
        >
          {/* Main Icon Group */}
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-[#0a1a12] border border-emerald-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <div className="grid grid-cols-2 gap-4">
                <Construction className="text-emerald-400 animate-bounce" size={40} />
                <Cpu className="text-emerald-500 animate-pulse delay-75" size={40} />
                <ShieldAlert className="text-emerald-300 animate-pulse delay-150" size={40} />
                <div className="w-10 h-10 border-2 border-dashed border-emerald-500/50 rounded-lg animate-spin" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            FLEET COMMAND<br />OFFLINE
          </h1>
          
          <div className="h-[1px] w-32 bg-emerald-500/50 mx-auto mb-8" />

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 font-light">
            We are currently synchronizing 3D telemetry and updating ship class registries. 
            <span className="block mt-2 text-emerald-400/80 font-medium tracking-wide">
              The public fleet viewer is under construction.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Return to Base
            </Link>
            <div className="px-8 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-mono uppercase tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Admin Portal Active
            </div>
          </div>
        </motion.div>

        {/* HUD Decoration */}
        <div className="absolute bottom-10 left-10 text-[10px] font-mono text-emerald-500/30 uppercase tracking-[0.5em] vertical-text hidden lg:block">
          System Update in Progress // KHLA-9092
        </div>
        <div className="absolute top-10 right-10 text-[10px] font-mono text-emerald-500/30 uppercase tracking-[0.5em] hidden lg:block">
          Connection: Secure // Relay: OK
        </div>
      </div>
    );
  }

  return (
    <div className="fleet-page">
      {/* Cinematic intro */}
      <AnimatePresence>
        {showIntro && <FleetIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Header */}
      <header className="fleet-header">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest hidden sm:inline">Base</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span className="text-sm font-bold font-mono tracking-[0.15em] text-white">
            FLEET<span className="text-emerald-400">CMD</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest hidden md:inline">
            Khalai Makhlooq
          </span>
          <span className="fleet-status-badge">Online</span>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="fleet-layout">
        {/* Left: Ship list */}
        <FleetShipSelector
          ships={fleetShips}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />

        {/* Center: 3D Viewport */}
        <main className="fleet-viewport">
          {/* Radial gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a1a12_0%,_#020403_100%)]" />

          {/* Three.js canvas */}
          <div className="absolute inset-0">
            {isReady && <FleetScene selectedShip={selectedShip} />}
          </div>

          {/* HUD overlay */}
          <FleetHUD
            ship={selectedShip}
            currentIndex={selectedIndex}
            totalShips={fleetShips.length}
            onPrev={goPrev}
            onNext={goNext}
            onResetCamera={() => {
              // OrbitControls reset is handled internally;
              // future: expose reset via ref
            }}
          />
        </main>

        {/* Right: Details panel */}
        <FleetShipDetails ship={selectedShip} />
      </div>
    </div>
  );
}
