'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = [
  {
    kicker: '01 / Scene',
    title: 'One signal. Full squad.',
    copy: 'Comms clean, moves sharp, aur orbit mein fazool ghoomna band. Jab KMHQ moves, sab ko pata chal jata hai.',
  },
  {
    kicker: '02 / Entry',
    title: 'Pehle pohanchte hain, phir poochte hain.',
    copy: 'Positioning strong, scouting smart, aur pressure itna smooth ke dusri side ko loading screen yaad aa jaye.',
  },
  {
    kicker: '03 / Backup',
    title: 'Fleet ka jugaad nahi, system hai.',
    copy: 'Logistics, recovery, escort, intel: sab ek hi machine ka part. Koi akela nahi chalta, convoy mein vibe hoti hai.',
  },
];

const SIGNALS = ['STRIKE', 'ESCORT', 'HAUL', 'SCAN', 'RECOVER', 'HOLD', 'EXPAND'];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-manifesto-line]',
        { yPercent: 115, rotateX: -35, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        '[data-doctrine-card]',
        { y: 70, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-doctrine-grid]',
            start: 'top 78%',
          },
        }
      );

      gsap.to('[data-manifesto-stack]', {
        y: -90,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      gsap.to('[data-doctrine-visual]', {
        y: -56,
        scale: 1.035,
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
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#040704] py-28 text-white md:py-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[5%] h-[34rem] w-[34rem] rounded-full bg-lime-400/10 blur-[140px]" />
        <div className="absolute bottom-[-12%] right-[-6%] h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(163,230,53,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-50 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <div className="relative z-10 w-full px-3 sm:px-5 2xl:px-8">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-sm bg-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.8)]" />
              <span className="font-mono text-base font-bold uppercase tracking-[0.35em] text-lime-300/80">
                Fleet Ka Scene
              </span>
            </div>
            <p className="max-w-4xl text-2xl leading-10 text-white/48 md:text-3xl md:leading-[1.25]">
              Khalai Makhlooq koi boring history lecture nahi. Ye crew, ships,
              signal aur pressure ka combo hai. Space bhi dekhe aur bole: acha bhai, samajh gaya.
            </p>
          </div>

          <div className="rounded-2xl border border-lime-300/15 bg-lime-300/5 px-6 py-5 font-mono text-base uppercase tracking-[0.25em] text-lime-200/70">
            KMHQ / Scene Active
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)] lg:items-end">
          <div data-manifesto-stack className="font-black uppercase leading-[0.78] tracking-[-0.09em] text-white will-change-transform">
            {['Move', 'Like A', 'Full Squad'].map((line) => (
              <div key={line} className="overflow-hidden pb-2">
                <div
                  data-manifesto-line
                  className="text-[23vw] text-transparent [-webkit-text-stroke:1.3px_rgba(190,242,100,0.5)] md:text-[15vw] lg:text-[10.5vw]"
                >
                  {line}
                </div>
              </div>
            ))}
          </div>

          <motion.div
            data-doctrine-visual
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[2rem] border border-lime-300/15 bg-black/35 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <img
              src="/backgrounds/SC-4.0_20250225_100437_Carrack-Over-Bloom_f.png"
              alt="Khalai Makhlooq fleet command"
              className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040704] via-[#040704]/65 to-transparent" />
            <div className="relative z-10 min-h-[480px] content-end">
              <div className="mb-5 font-mono text-base uppercase tracking-[0.35em] text-lime-300/70">
                Hangar posture
              </div>
              <h3 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white md:text-7xl">
                Calm dimagh. Dangerous aim.
              </h3>
            </div>
          </motion.div>
        </div>

        <div data-doctrine-grid className="mt-16 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <div
              key={item.kicker}
              data-doctrine-card
              className="group relative min-h-[360px] overflow-hidden rounded-[1.75rem] border border-lime-300/12 bg-white/[0.025] p-8 transition-transform duration-300 hover:-translate-y-2 hover:border-lime-300/30"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="mb-10 font-mono text-sm uppercase tracking-[0.28em] text-lime-300/55">
                {item.kicker}
              </div>
              <h3 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-white md:text-5xl">
                {item.title}
              </h3>
              <p className="mt-8 text-xl leading-9 text-white/48">
                {item.copy}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden border-y border-lime-300/10 py-5">
          <div className="flex animate-[marquee_28s_linear_infinite] whitespace-nowrap">
            {[...SIGNALS, ...SIGNALS, ...SIGNALS].map((signal, index) => (
              <span
                key={`${signal}-${index}`}
                className="mx-7 font-mono text-2xl font-bold uppercase tracking-[0.35em] text-lime-300/40"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
