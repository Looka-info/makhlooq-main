'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function AboutNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch('/api/about-news')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setNews(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setNews([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#040806] text-white border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="mb-12 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.45em] text-emerald-500/50 mb-4">
            ◈ Latest Dispatches ◈
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">
            News from the bridge
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {loading ? (
            <div className="col-span-2 rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-gray-400">
              Loading news...
            </div>
          ) : news.length === 0 ? (
            <div className="col-span-2 rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-gray-400">
              No news has been posted yet.
            </div>
          ) : (
            news.map((item) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 shadow-[0_24px_90px_rgba(0,0,0,0.25)]"
              >
                <div className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-500/60 mb-3">
                  {new Date(item.published_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">{item.body}</p>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
