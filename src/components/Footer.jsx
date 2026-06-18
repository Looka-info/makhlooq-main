'use client';

import React from 'react';
import { motion } from 'motion/react';
import GridOverlay from './GridOverlay';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Team', href: '/team' },
  { label: 'Fleet', href: '/fleet' },
  { label: 'About', href: '/about' },
];

export default function Footer() {
  return (
    <footer className="footer relative overflow-hidden border-t border-lime-300/10 bg-[#020402] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(163,230,53,0.12),transparent_28%),radial-gradient(circle_at_84%_0%,rgba(255,255,255,0.06),transparent_22%),linear-gradient(180deg,transparent,rgba(0,0,0,0.75))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(163,230,53,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.08)_1px,transparent_1px)] [background-size:76px_76px]" />
      <GridOverlay id="footer-grid" triggerSelector=".footer" isFooter />

      <div className="relative z-10 mx-auto w-full max-w-none">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-lime-300/10 bg-white/[0.03] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Khalai Makhlooq" className="h-14 w-14 object-contain" />
              <div>
                <div className="font-mono text-xs font-black uppercase tracking-[0.34em] text-lime-300/55">Khalai Makhlooq</div>
                <div className="mt-2 text-4xl font-black uppercase tracking-[-0.08em] text-white sm:text-5xl">
                  KMHQ
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/50 sm:text-xl">
              A Star Citizen organization built around sharp coordination, capable crews, and a cinematic fleet presence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-lime-300/15 bg-lime-300/10 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.22em] text-lime-200">
                Ready
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.22em] text-white/45">
                Stay tuned
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="rounded-[2rem] border border-lime-300/10 bg-white/[0.03] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          >
            <div className="font-mono text-xs font-black uppercase tracking-[0.34em] text-lime-300/55">Navigate</div>
            <div className="mt-5 grid gap-3">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-lg font-black tracking-[-0.03em] text-white transition-colors hover:border-lime-300/25 hover:bg-lime-300/[0.04]"
                >
                  <span>{item.label}</span>
                  <span className="text-lime-300/40 transition-transform group-hover:translate-x-1">→</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="rounded-[2rem] border border-lime-300/10 bg-white/[0.03] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          >
            <div className="font-mono text-xs font-black uppercase tracking-[0.34em] text-lime-300/55">Comms</div>

            <div className="mt-5 space-y-4">
              <a
                href="mailto:info@khalai.makhlooq"
                className="block rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-lg font-black tracking-[-0.03em] text-white transition-colors hover:border-lime-300/25 hover:bg-lime-300/[0.04]"
              >
                info@khalai.makhlooq
              </a>
              <a
                href="https://discord.gg/kmhq"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-lg font-black tracking-[-0.03em] text-white transition-colors hover:border-lime-300/25 hover:bg-lime-300/[0.04]"
              >
                discord.gg/kmhq
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-lime-300/10 bg-lime-300/[0.04] p-4">
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-lime-300/50">Signal Log</div>
              <div className="mt-3 space-y-2 font-mono text-sm text-white/45">
                <div>System: calm</div>
                <div>Hangar: open</div>
                <div>Vibe: locked in</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="font-mono text-xs font-black uppercase tracking-[0.26em] text-white/30">
            © {new Date().getFullYear()} KHALAI MAKHLOOQ // SECTOR 7
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://discord.gg/kmhq"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs font-black uppercase tracking-[0.24em] text-white/40 transition-colors hover:text-lime-200"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
