'use client';

import { useEffect, useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ▸ DYNAMIC IMPORTS WITH SUSPENSE (Performance: Reduces initial bundle)
// Below-the-fold sections are loaded on demand, not blocking page render
import dynamic from 'next/dynamic';

// Lightweight loading skeletons for each section
const SectionSkeleton = () => (
  <div className="min-h-screen bg-black animate-pulse flex items-center justify-center">
    <div className="w-16 h-16 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
  </div>
);

// Dynamic imports with proper loading fallbacks
const Values = dynamic(() => import('../src/components/Values'), {
  loading: SectionSkeleton,
  ssr: true,
});

import AboutSkeleton from '../src/components/AboutSkeleton';

const About = dynamic(() => import('../src/components/About'), {
  loading: AboutSkeleton,
  ssr: true,
});

const Showcase = dynamic(() => import('../src/components/Showcase'), {
  loading: SectionSkeleton,
  ssr: true,
});

const FAQ = dynamic(() => import('../src/components/FAQ'), {
  loading: SectionSkeleton,
  ssr: true,
});

const Footer = dynamic(() => import('../src/components/Footer'), {
  loading: () => <footer className="min-h-40 bg-black animate-pulse" />,
  ssr: true,
});

// ▸ CORE UI COMPONENTS (Imported directly for above-the-fold critical content)
import Preloader from '../src/components/Preloader';
import Header from '../src/components/Header';
import Hero from '../src/components/Hero';

// ▸ ONLY IMPORT GSAP PLUGINS WHEN NEEDED (Tree-shaking improvement)
// Instead of: import gsap from 'gsap/all' (includes everything)
// Import only what we use
import gsap from 'gsap';
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    // ▸ PERFORMANCE: Prevent scroll until preloader hides (avoids uncontrolled scroll)
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }

    // ▸ SMOOTH SCROLL LIBRARY (Lenis) optimized for performance
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      wheelMultiplier: 0.9, // Prevent excessive scroll events
    });

    // ▸ RAF LOOP - Only tick if user is active (could add visibility API check)
    let rafId;
    function raf(time) {
      if (!document.hidden) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // ▸ GSAP ANIMATIONS (Only create context, animations removed as sections hidden)
    let ctx = gsap.context(() => {
      // Animations trigger on section visibility (added via Intersection Observer if needed)
    });

    return () => {
      lenis.destroy();
      ctx.revert();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* ▸ PRELOADER - Critical path, always shown */}
      <Preloader key="preloader" />

      {/* ▸ HEADER & HERO - Above-the-fold, critical content */}
      <Header
        key="header"
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        volume={volume}
        setVolume={setVolume}
      />

      {/* ▸ MAIN CONTENT WITH SUSPENSE BOUNDARIES */}
      <motion.main
        key="main"
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* ▸ HERO SECTION - Critical content, no suspension */}
        <Hero isMuted={isMuted} volume={volume} />

        {/* ▸ BELOW-THE-FOLD SECTIONS - Lazy loaded with Suspense */}
        <Suspense fallback={<SectionSkeleton />}>
          <Values />
        </Suspense>

        <Suspense fallback={<AboutSkeleton />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Showcase />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <FAQ />
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
}
