'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    code: '01',
    name: 'Strike Mode',
    detail: 'Target dikha, squad nikla, scene done. Clean pressure with no extra drama.',
  },
  {
    code: '02',
    name: 'Cargo Chill',
    detail: 'Boxes bhi move hotay hain, vibes bhi. Supply line strong, fleet ka stomach full.',
  },
  {
    code: '03',
    name: 'Recovery Jugaad',
    detail: 'Ship toot jaye? Koi tension nahi. Salvage, extract, rebuild, phir se runway par.',
  },
  {
    code: '04',
    name: 'Deep Orbit',
    detail: 'Map khatam, KMHQ shuru. Scout karo, mark karo, aur phir chai ke saath plan banao.',
  },
];

const METRICS = [
  { value: '2950', label: 'Scene since' },
  { value: '6', label: 'Big ships' },
  { value: '80+', label: 'Active pilots' },
  { value: '24/7', label: 'Hangar ready' },
];

export default function Showcase() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-showcase-word]',
        { yPercent: 120, opacity: 0, rotateX: -40 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        }
      );

      gsap.fromTo(
        '[data-pillar-card]',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.11,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-pillar-grid]',
            start: 'top 75%',
          },
        }
      );

      gsap.to('[data-showcase-stack]', {
        y: -95,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      gsap.to('[data-metrics-panel]', {
        y: -64,
        scale: 1.025,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#030603] py-28 text-white md:py-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-8%] top-[10%] h-[32rem] w-[32rem] rounded-full bg-emerald-400/10 blur-[140px]" />
        <div className="absolute left-[-12%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-lime-400/8 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(132,204,22,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(132,204,22,0.035)_1px,transparent_1px)] bg-[size:88px_88px] opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_74%)]" />
      </div>

      <div className="relative z-10 w-full px-3 sm:px-5 2xl:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-sm bg-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.8)]" />
              <span className="font-mono text-base font-bold uppercase tracking-[0.35em] text-lime-300/80">
                Operations Ka Scene
              </span>
            </div>

            <div data-showcase-stack className="max-w-6xl font-black uppercase leading-[0.78] tracking-[-0.09em] text-white will-change-transform">
              {['Hum', 'Idle', 'Nahi'].map((word) => (
                <div key={word} className="overflow-hidden pb-2">
                  <div
                    data-showcase-word
                    className="text-[23vw] text-transparent [-webkit-text-stroke:1.3px_rgba(190,242,100,0.55)] md:text-[15vw] lg:text-[10.5vw]"
                  >
                    {word}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            data-metrics-panel
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="rounded-[2rem] border border-lime-300/15 bg-white/[0.03] p-6 backdrop-blur-xl"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {METRICS.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/8 bg-black/25 p-5">
                  <div className="font-mono text-sm uppercase tracking-[0.3em] text-lime-300/55">
                    {metric.label}
                  </div>
                  <div className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-white md:text-6xl">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-7 max-w-2xl text-2xl leading-10 text-white/48">
              Har division ka simple rule: jaldi move karo, pehle dekho, aur battlefield ko
              itna clean choro ke log poochain cleanup crew kaun tha.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 border-t border-lime-300/10 pt-12">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-5xl font-bold tracking-[-0.07em] md:text-7xl">
              Pressure mein bhi style.
            </h2>
            <p className="max-w-2xl text-xl leading-9 text-white/48">
              Fleet ka layout simple hai: clear roles, wide space, aur koi random button mashing nahi.
              Bas coordinated masti.
            </p>
          </div>

          <div data-pillar-grid className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.code}
                data-pillar-card
                className="group rounded-[1.75rem] border border-lime-300/12 bg-[#071006] p-7 transition-transform duration-300 hover:-translate-y-2 hover:border-lime-300/30 hover:bg-[#0b1708]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-sm uppercase tracking-[0.3em] text-lime-300/55">
                    {pillar.code}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.7)]" />
                </div>
                <h3 className="mt-16 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
                  {pillar.name}
                </h3>
                <p className="mt-6 text-lg leading-8 text-white/45">
                  {pillar.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
