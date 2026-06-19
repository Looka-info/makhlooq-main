'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AboutAdminPage() {
  const [authing, setAuthing] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [session, setSession] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      setAuthing(true);
      const res = await fetch('/api/auth/discord/session?admin=1', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));

      if (!mounted) return;
      if (res.ok && data?.admin) {
        setSession(data.user);
        setAuthed(true);
        setAuthing(false);
      } else {
        setSession(data.user || null);
        setAuthed(false);
        setAuthing(false);
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!authed) return;

    let mounted = true;
    setLoadingNews(true);

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
        setLoadingNews(false);
      });

    return () => {
      mounted = false;
    };
  }, [authed]);

  const loginWithDiscord = () => {
    window.location.href = '/api/auth/discord/login?returnTo=/about/admin';
  };

  const logout = async () => {
    await fetch('/api/auth/discord/logout', { method: 'POST' });
    window.location.reload();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and news body are required.');
      return;
    }

    setSaving(true);
    setError('');

    const res = await fetch('/api/about-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body: body.trim() }),
    });

    const data = await res.json().catch(() => ({ error: 'Unable to parse response.' }));
    if (!res.ok) {
      setError(data?.error || 'Failed to publish news.');
      setSaving(false);
      return;
    }

    setTitle('');
    setBody('');
    setNews((prev) => [data, ...prev]);
    setSaving(false);
  };

  if (authing) {
    return (
      <div className="min-h-screen bg-[#020402] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="mt-4 text-sm text-gray-400">Checking admin access…</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#020402] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#04100c]/80 p-10 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">About News Admin</h1>
            <p className="mt-3 text-gray-400">Secure admin access is required to post updates on the About page.</p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={loginWithDiscord}
              className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black hover:bg-emerald-400 transition"
            >
              Sign in with Discord
            </button>
            <Link href="/about" className="text-center text-sm text-gray-400 hover:text-white transition">Return to About</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020402] text-white pb-20">
      <div className="mx-auto max-w-6xl px-6 pt-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">About News Admin</h1>
            <p className="mt-2 text-gray-400 max-w-2xl">
              Publish updates for the About page and manage daily news from the Khalai Makhlooq bridge.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={logout}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Sign Out
            </button>
            <Link href="/about" className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/15 transition">
              Back to About
            </Link>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-bold">Publish a News Item</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="Enter the news headline"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="Write the full news copy here"
                />
              </div>
              {error ? <div className="text-sm text-red-400">{error}</div> : null}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black hover:bg-emerald-400 transition disabled:opacity-50"
              >
                {saving ? 'Publishing…' : 'Publish News'}
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Recent News</h2>
              <button
                onClick={() => setNews([]) || setLoadingNews(true) || window.location.reload()}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-300 hover:bg-white/10 transition"
              >
                Refresh
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {loadingNews ? (
                <div className="rounded-2xl border border-white/10 bg-[#020406] p-6 text-center text-gray-400">Loading news…</div>
              ) : news.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#020406] p-6 text-gray-400">No news items yet.</div>
              ) : (
                news.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-[#020406] p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-emerald-500/60 mb-2">
                      {new Date(item.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-gray-400 whitespace-pre-wrap leading-relaxed">{item.body}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
