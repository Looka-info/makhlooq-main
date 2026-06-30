'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import AboutNews from '../../../src/components/about/AboutNews';
import { Shield, Target, Crosshair, ChevronDown, Anchor, Globe, Sword } from 'lucide-react';

import { useLivePreview } from '@payloadcms/live-preview-react';

export default function AboutPageClient({ data: initialData, newsPosts }) {
  const { data } = useLivePreview({
    initialData,
    serverURL: (typeof window !== 'undefined' && window.__SERVER_URL__) || process.env.NEXT_PUBLIC_SERVER_URL || 'https://kmhq.org',
    depth: 2,
  });

  const hero = data?.hero || {};
  const divisions = data?.divisions || {};
  const fleet = data?.fleet || {};
  const legacy = data?.legacy || {};

  const iconMap = {
    "Security & Combat": Shield,
    "Logistics & Trade": Target,
    "Deep Exploration": Crosshair,
  };

  const divisionCards = divisions.cards || [
    { title: "Security & Combat", desc: "Elite combat wings specialized in escort, defense, and aggressive negotiations. We ensure the safety of our operations across the verse." },
    { title: "Logistics & Trade", desc: "The backbone of our operations, moving high-value assets securely across systems. Our trade networks are unmatched." },
    { title: "Deep Exploration", desc: "Charting unknown territories and securing valuable intelligence and resources before they hit the open market." }
  ];

  useEffect(() => {
    // Lenis smooth scroll initialization
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      wheelMultiplier: 0.9,
    });

    let rafId;
    function raf(time) {
      if (!document.hidden) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#020402] relative text-white selection:bg-lime-400/30 flex flex-col">
      <Header siteSettings={data?.siteSettings} />

      <main className="flex-1 flex flex-col w-full">

        {/* Section 1: Hero */}
        <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
          {/* Fixed Background Image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url('${hero.backgroundImage || "/backgrounds/9a5b333b-3981-4d6a-a235-7e91fc1c6ff8.jpg"}')` }}
          />
          <div className="absolute inset-0 z-0 bg-black/40 bg-gradient-to-t from-[#020402] via-black/20 to-black/40" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          >
            <div className="font-mono text-sm font-black uppercase tracking-[0.4em] text-lime-400/80 mb-6 drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]">
              {hero.kicker || "KMHQ Organization"}
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-tight mb-8">
              {hero.heading ? (
                hero.heading.includes("Makhlooq") ? (
                  <>
                    {hero.heading.split("Makhlooq")[0]}
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-lime-300 to-lime-600">Makhlooq</span>
                    {hero.heading.split("Makhlooq")[1]}
                  </>
                ) : (
                  hero.heading
                )
              ) : (
                <>We Are <span className="text-transparent bg-clip-text bg-gradient-to-br from-lime-300 to-lime-600">Makhlooq</span></>
              )}
            </h1>
            <p className="mx-auto max-w-3xl text-xl md:text-2xl leading-relaxed text-white/80 font-light">
              {hero.description || "A premier Star Citizen organization dedicated to excellence across all sectors. We operate with precision, coordination, and overwhelming force."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-lime-400/50 animate-bounce"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* Section 2: Core Divisions */}
        <section className="relative w-full py-32 px-6 bg-[#020402]">
          {/* Subtle noise and radial gradient */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] [background-image:linear-gradient(rgba(163,230,53,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(101,163,13,0.08),transparent)]" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
                {divisions.heading ? (
                  divisions.heading.includes("Divisions") ? (
                    <>
                      {divisions.heading.split("Divisions")[0]}
                      <span className="text-lime-400">Divisions</span>
                      {divisions.heading.split("Divisions")[1]}
                    </>
                  ) : (
                    divisions.heading
                  )
                ) : (
                  <>Our <span className="text-lime-400">Divisions</span></>
                )}
              </h2>
              <div className="w-24 h-1 bg-lime-400/30 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {divisionCards.map((item, idx) => {
                const Icon = iconMap[item.title] || Shield;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                    className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 hover:border-lime-400/30 transition-all duration-500 hover:-translate-y-2 backdrop-blur-md"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl border border-lime-400/20 bg-lime-400/10 flex items-center justify-center mb-8 text-lime-400 shadow-[0_0_30px_rgba(132,204,22,0.15)] group-hover:shadow-[0_0_30px_rgba(132,204,22,0.3)] transition-all">
                        <Icon size={32} />
                      </div>
                      <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-wide">{item.title}</h3>
                      <p className="text-white/50 leading-relaxed text-base">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: The Fleet */}
        <section className="relative w-full py-40 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url('${fleet.backgroundImage || "/backgrounds/SC-4.5.0_20251229_131102_Hathor-orbital-laser_f.png"}')` }}
          />
          <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-[2px]" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
                {fleet.heading ? (
                  fleet.heading.includes("Firepower") ? (
                    <>
                      {fleet.heading.split("Firepower")[0]}
                      <span className="text-lime-400">Firepower</span>
                      {fleet.heading.split("Firepower")[1]}
                    </>
                  ) : (
                    fleet.heading
                  )
                ) : (
                  <>Unmatched <span className="text-lime-400">Firepower</span></>
                )}
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                {fleet.description || "Our fleet is a testament to our ambition. From agile light fighters to capital-class dreadnoughts, KMHQ possesses the logistical and combative capabilities to tackle any objective, anywhere in the galaxy."}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-lime-400/80 font-mono text-sm uppercase tracking-widest bg-lime-400/10 border border-lime-400/20 px-4 py-2 rounded-full">
                  <Anchor size={16} /> Capital Ships
                </div>
                <div className="flex items-center gap-2 text-lime-400/80 font-mono text-sm uppercase tracking-widest bg-lime-400/10 border border-lime-400/20 px-4 py-2 rounded-full">
                  <Sword size={16} /> Fighters
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-auto md:h-[500px] rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <img src={fleet.imageSrc || "/backgrounds/SC-4.4.0_20251214_152954_Wolf-Yela-rings_f.png"} alt="Fleet in action" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-lime-400 font-mono text-xs uppercase tracking-[0.3em] mb-2">{fleet.imageLabel || "Operation: Zenith"}</div>
                <div className="text-white font-bold text-xl uppercase tracking-wide">{fleet.imageHeading || "Deep Space Deployment"}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 4: History / Operations */}
        <section className="relative w-full py-32 px-6 bg-[#020402]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(101,163,13,0.05),transparent)]" />
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Globe size={48} className="mx-auto text-lime-400/50 mb-8" />
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-8">
                {legacy.heading ? (
                  legacy.heading.includes("Supremacy") ? (
                    <>
                      {legacy.heading.split("Supremacy")[0]}
                      <span className="text-lime-400">Supremacy</span>
                      {legacy.heading.split("Supremacy")[1]}
                    </>
                  ) : (
                    legacy.heading
                  )
                ) : (
                  <>A Legacy of <span className="text-lime-400">Supremacy</span></>
                )}
              </h2>
              <p className="text-xl text-white/60 leading-relaxed max-w-4xl mx-auto">
                {legacy.description || "Founded by a core group of veteran pilots, Makhlooq has grown from a specialized strike team into a multi-system powerhouse. We believe in quality over quantity, ensuring every member of our organization represents the pinnacle of skill and dedication."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 5: News */}
        <section className="relative w-full pb-32 pt-10 px-6 bg-[#020402]">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-[3rem] border border-lime-300/10 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-white/[0.02]">
              <AboutNews initialNews={newsPosts} />
            </div>
          </div>
        </section>
      </main>
      <Footer siteSettings={data?.siteSettings} />
    </div>
  );
}
