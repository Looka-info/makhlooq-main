'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';

/* ───────────────────────── Data ───────────────────────── */

const STATS = [
  { value: 120, suffix: '+', label: 'Active Pilots' },
  { value: 48, suffix: '', label: 'Operative Wings' },
  { value: 99, suffix: '.8%', label: 'Mission Success' },
  { value: 6, suffix: '', label: 'Capital Ships' },
];

const TIMELINE = [
  {
    year: '2950',
    title: 'Genesis',
    desc: 'A small band of pilots forged a pact on the docks of Port Olisar. The name Khalai Makhlooq was etched into the UEE org registry.',
  },
  {
    year: '2951',
    title: 'First Fleet',
    desc: 'Acquisition of the first Hammerhead and Constellation Aquila. Our convoy ran its maiden route through the Aaron Halo.',
  },
  {
    year: '2952',
    title: 'Stanton Dominance',
    desc: 'Operational presence established across Crusader, Hurston, ArcCorp, and MicroTech. Membership surpassed 80 pilots.',
  },
  {
    year: '2953',
    title: 'Capital Acquisition',
    desc: 'The Aegis Idris-P entered the fleet — transforming KM from a squadron into a true naval power.',
  },
  {
    year: '2954',
    title: 'Pyro Expansion',
    desc: 'First fleet to map and secure a staging point inside the Pyro system. Deep-space salvage and recon operations begin.',
  },
];

const DIVISIONS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    name: 'Fleet Command',
    desc: 'Strategic leadership and operational coordination across all theaters of engagement.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    ),
    name: 'Recon & Intel',
    desc: 'Advanced scanning, pathfinding, and threat intelligence for preemptive superiority.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    name: 'Defense Corps',
    desc: 'Escort operations, perimeter defense, and convoy protection across hostile sectors.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    name: 'Logistics Wing',
    desc: 'Supply chain management, cargo operations, and economic trade-route dominance.',
  },
];

/* ───────────────────────── Animated Counter ───────────── */

function AnimatedCounter({ value, suffix, duration = 2000 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
}

/* ───────────────────────── Component ──────────────────── */

export default function About() {
  const sectionRef = useRef(null);
  const heroImgRef = useRef(null);

  // Parallax for the hero image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);

  // InView refs
  const missionRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, margin: '-100px' });

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });

  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: '-60px' });

  const divsRef = useRef(null);
  const divsInView = useInView(divsRef, { once: true, margin: '-60px' });

  return (
    <section id="about" ref={sectionRef} className="relative bg-[#05070A] overflow-hidden">

      {/* ═══════════════════ 1. Cinematic Hero Banner ═══════════════════ */}
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: imgY, scale: imgScale }}
        >
          <img
            ref={heroImgRef}
            src="/backgrounds/SC-4.0_20250225_100437_Carrack-Over-Bloom_f.png"
            alt="KM Fleet formation"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070A] via-transparent to-[#05070A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070A]/80 via-transparent to-[#05070A]/40" />

        {/* Corner brackets (HUD aesthetic) */}
        {[
          { top: 24, left: 24, borderTop: '1px solid', borderLeft: '1px solid' },
          { top: 24, right: 24, borderTop: '1px solid', borderRight: '1px solid' },
          { bottom: 24, left: 24, borderBottom: '1px solid', borderLeft: '1px solid' },
          { bottom: 24, right: 24, borderBottom: '1px solid', borderRight: '1px solid' },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute w-7 h-7 pointer-events-none z-10"
            style={{ ...s, borderColor: 'rgba(74,109,86,0.35)' }}
          />
        ))}

        {/* Centered banner text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400/70 mb-4">
              ◈ About the Organization ◈
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95] mb-5"
              style={{ textShadow: '0 0 80px rgba(16,185,129,0.25)' }}
            >
              Khalai<br />
              <span className="text-emerald-400">Makhlooq</span>
            </h2>
            <p className="font-mono text-xs text-gray-400 max-w-md mx-auto leading-relaxed tracking-wide">
              The strategic core of Stanton fleet operations.<br />
              Command. Craft. Crew.
            </p>
          </motion.div>
        </div>

        {/* Animated scan line */}
        <div
          className="absolute left-0 w-full h-[1px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.4) 50%, transparent 100%)',
            animation: 'about-scanline 6s linear infinite',
          }}
        />
      </div>

      {/* ═══════════════════ 2. Mission Statement ═══════════════════ */}
      <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

        <div ref={missionRef} className="relative z-10 grid md:grid-cols-[1fr_1.4fr] gap-16 items-start">
          {/* Left — label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={missionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-emerald-400">
                Our Mission
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug">
              One Fleet.<br />
              One Purpose.<br />
              <span className="text-emerald-400">Absolute Supremacy.</span>
            </h3>
          </motion.div>

          {/* Right — body */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={missionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-6"
          >
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Khalai Makhlooq brings together pilots, engineers, tacticians, and logistics
              specialists under one unified command structure. We operate across the entire
              Stanton system with precision, discipline, and a relentless pursuit of dominance.
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              Born from the crucible of deep-space conflict, our organization has grown from a
              small squadron of misfits to a fully operational fleet capable of projecting power
              across multiple star systems. Every pilot who wears the KM emblem carries the weight
              of our legacy — and the fire of our ambition.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-gray-600 uppercase">Est. 2950</span>
              <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════ 3. Stats Band ═══════════════════ */}
      <div ref={statsRef} className="relative border-y border-white/5 bg-[#060a07]/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center group"
              >
                <div
                  className="text-4xl md:text-5xl font-bold font-mono text-white mb-2 transition-all duration-500"
                  style={{ textShadow: '0 0 30px rgba(16,185,129,0.2)' }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-500 group-hover:text-emerald-400 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════ 4. Divisions / Pillars ═══════════════════ */}
      <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/3 blur-[100px] pointer-events-none" />

        <motion.div
          ref={divsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={divsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-emerald-400">
              Operational Structure
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-16">
            Four Pillars of Power
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIVISIONS.map((div, i) => (
              <motion.div
                key={div.name}
                initial={{ opacity: 0, y: 30 }}
                animate={divsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                className="group relative rounded-2xl border border-white/5 bg-[#0a0f0c]/60 p-7 hover:border-emerald-500/25 transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="text-emerald-400 mb-5 group-hover:scale-110 transition-transform duration-300 origin-left">
                    {div.icon}
                  </div>
                  <h4 className="text-white font-bold text-lg tracking-tight mb-2">
                    {div.name}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {div.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════ 5. Full-bleed Image Break ═══════════════════ */}
      <div className="relative w-full h-[50vh] min-h-[350px] overflow-hidden">
        <motion.img
          src="/backgrounds/SC-3.19_20230524_130313_Fleet-selfie_ILW2953_f.png"
          alt="Fleet formation"
          loading="lazy"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070A] via-transparent to-[#05070A]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.25em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-mono text-xs md:text-sm uppercase text-emerald-400/80 tracking-[0.25em]"
          >
            ◈ Together We Rule the Stars ◈
          </motion.p>
        </div>
      </div>

      {/* ═══════════════════ 6. Timeline ═══════════════════ */}
      <div className="relative max-w-4xl mx-auto px-6 py-28 md:py-36">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-emerald-500/4 blur-[120px] pointer-events-none" />

        <motion.div
          ref={timelineRef}
          initial={{ opacity: 0, y: 20 }}
          animate={timelineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-emerald-400">
              Fleet Chronicle
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-16">
            Our History
          </h3>

          {/* Timeline items */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] md:left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/40 via-emerald-500/15 to-transparent" />

            <div className="space-y-12">
              {TIMELINE.map((event, i) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                  className="flex gap-6 md:gap-8 group"
                >
                  {/* Dot */}
                  <div className="relative flex-shrink-0 mt-1.5">
                    <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full bg-[#0a0f0c] border-2 border-emerald-500/50 group-hover:border-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-300 relative z-10" />
                  </div>

                  {/* Content */}
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-emerald-400 text-sm font-bold tracking-wider">
                        {event.year}
                      </span>
                      <div className="h-px w-8 bg-emerald-500/30" />
                      <span className="text-white font-bold text-lg tracking-tight">
                        {event.title}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                      {event.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scan-line keyframes */}
      <style>{`
        @keyframes about-scanline {
          0%   { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </section>
  );
}
