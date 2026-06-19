'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AboutAdminPage() {
  const [authing, setAuthing] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [session, setSession] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsStatus, setSettingsStatus] = useState('');
  const [bridgeHeading, setBridgeHeading] = useState('');
  const [bridgeSubtitle, setBridgeSubtitle] = useState('');
  const [bridgeBackgroundUrl, setBridgeBackgroundUrl] = useState('');
  const [archivesBackgroundUrl, setArchivesBackgroundUrl] = useState('');
  const [archivesIntroYear, setArchivesIntroYear] = useState('');
  const [archivesIntroTitle, setArchivesIntroTitle] = useState('');
  const [archivesIntroDesc, setArchivesIntroDesc] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const detectMediaType = (url) => {
    const value = url.trim().toLowerCase();
    if (!value) return '';
    if (value.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/)) return 'image';
    if (value.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/)) return 'video';
    return 'link';
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
    setMediaType('');
    setMediaUrl('');
    setMediaFile(null);
    setMediaPreviewUrl('');
    setError('');
    setStatus('');
  };

  const handleMediaTypeChange = (value) => {
    setMediaType(value);
    setMediaUrl('');
    setMediaFile(null);
    setMediaPreviewUrl('');
  };

  const handleMediaFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setMediaFile(file);
    setMediaUrl('');

    if (file) {
      const type = file.type.toLowerCase();
      if (!mediaType) {
        if (type.startsWith('image/')) setMediaType('image');
        else if (type.startsWith('video/')) setMediaType('video');
      }
      setMediaPreviewUrl(URL.createObjectURL(file));
    } else {
      setMediaPreviewUrl('');
    }
  };

  const handleMediaUrlChange = (event) => {
    const value = event.target.value;
    setMediaUrl(value);
    setMediaPreviewUrl(value);
    if (!value.trim()) {
      return;
    }
    if (!mediaType) {
      setMediaType(detectMediaType(value));
    }
  };

  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const res = await fetch('/api/about-news');
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch {
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/about-settings');
      const data = await res.json();
      if (data) {
        setSettings(data);
        setBridgeHeading(data.bridge_heading || 'KHALAI MAKHLOOQ');
        setBridgeSubtitle(data.bridge_subtitle || 'From Stanton to Pyro, the route gets spicy. Crew tight, vibe light.');
        setBridgeBackgroundUrl(data.bridge_background_url || '/backgrounds/SC-3.22_20240301_203233_Zephyr-sun_f.png');
        setArchivesBackgroundUrl(data.archives_background_url || '/backgrounds/SC-3.22_20240110_133821_mT-flower-hill-sunset_f.png');
        setArchivesIntroYear(data.archives_intro_year || '2950');
        setArchivesIntroTitle(data.archives_intro_title || 'Genesis');
        setArchivesIntroDesc(data.archives_intro_desc || "Squad's first proper entry. Scene officially live.");
      }
    } catch {
      setSettings(null);
    } finally {
      setLoadingSettings(false);
    }
  };

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
    loadNews();
    loadSettings();
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
    setError('');
    setStatus('');

    if (!title.trim() || !body.trim()) {
      setError('Title and news body are required.');
      return;
    }

    if (!mediaType) {
      setError('Please choose a media type or select None.');
      return;
    }

    if (mediaType === 'link') {
      if (!mediaUrl.trim()) {
        setError('Please provide a media URL for the link type.');
        return;
      }
    } else if (!mediaFile && !mediaUrl.trim()) {
      setError('Please upload a file for image/video news items or provide a URL.');
      return;
    }

    setSaving(true);

    let bodyPayload;
    let headers = {};

    if (mediaFile) {
      bodyPayload = new FormData();
      bodyPayload.append('title', title.trim());
      bodyPayload.append('body', body.trim());
      bodyPayload.append('media_type', mediaType);
      bodyPayload.append('media_file', mediaFile);
      if (mediaUrl.trim()) {
        bodyPayload.append('media_url', mediaUrl.trim());
      }
    } else {
      bodyPayload = JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        media_url: mediaUrl.trim() || null,
        media_type: mediaType || detectMediaType(mediaUrl) || null,
      });
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch('/api/about-news', {
      method: 'POST',
      headers,
      body: bodyPayload,
    });

    const data = await res.json().catch(() => ({ error: 'Unable to parse response.' }));
    if (!res.ok) {
      setError(data?.error || 'Failed to publish news.');
      setSaving(false);
      return;
    }

    resetForm();
    setStatus('News published successfully.');
    setNews((prev) => [data, ...prev]);
    setSaving(false);
  };

  const handleSaveSettings = async (event) => {
    event.preventDefault();
    setSettingsError('');
    setSettingsStatus('');

    setSavingSettings(true);
    const res = await fetch('/api/about-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bridge_heading: bridgeHeading,
        bridge_subtitle: bridgeSubtitle,
        bridge_background_url: bridgeBackgroundUrl,
        archives_background_url: archivesBackgroundUrl,
        archives_intro_year: archivesIntroYear,
        archives_intro_title: archivesIntroTitle,
        archives_intro_desc: archivesIntroDesc,
      }),
    });

    const data = await res.json().catch(() => ({ error: 'Unable to parse response.' }));
    if (!res.ok) {
      setSettingsError(data?.error || 'Failed to save settings.');
      setSavingSettings(false);
      return;
    }

    setSettings(data);
    setSettingsStatus('About page settings saved successfully.');
    setSavingSettings(false);
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
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
              Signed in as <span className="font-semibold text-white">{session?.username || 'Admin'}</span>
            </div>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">Media Type</label>
                  <select
                    value={mediaType}
                    onChange={(e) => handleMediaTypeChange(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  >
                    <option value="">None</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="link">URL</option>
                  </select>
                  <p className="mt-2 text-xs text-gray-500">Upload image/video files or use a direct URL for link media.</p>
                </div>
                <div>
                  {mediaType === 'image' || mediaType === 'video' ? (
                    <>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">Upload {mediaType === 'image' ? 'Image' : 'Video'}</label>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <label
                            htmlFor="about-media-file-input"
                            className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-black hover:bg-emerald-400 transition"
                          >
                            Browse file
                          </label>
                          <span className="truncate rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-sm text-gray-300">
                            {mediaFile?.name || 'No file selected'}
                          </span>
                        </div>
                        <input
                          id="about-media-file-input"
                          type="file"
                          accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                          onChange={handleMediaFileChange}
                          className="hidden"
                        />
                        <label className="block text-sm font-semibold text-gray-300">Optional media URL</label>
                        <input
                          value={mediaUrl}
                          onChange={handleMediaUrlChange}
                          className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                          placeholder="Optional direct URL for a hosted file or preview"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Select a local {mediaType === 'image' ? 'image' : 'video'} file or optionally provide a direct URL.
                      </p>
                    </>
                  ) : (
                    <>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">Media URL</label>
                      <input
                        value={mediaUrl}
                        onChange={handleMediaUrlChange}
                        className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                        placeholder="https://example.com/media.jpg"
                      />
                    </>
                  )}
                </div>
              </div>
              {mediaPreviewUrl ? (
                <div className="rounded-2xl border border-white/10 bg-[#020406] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-emerald-500/60 mb-3">Preview</div>
                  {mediaFile ? (
                    mediaType === 'image' ? (
                      <img src={mediaPreviewUrl} alt="Preview" className="w-full rounded-2xl object-cover" />
                    ) : (
                      <video controls src={mediaPreviewUrl} className="w-full rounded-2xl bg-black" />
                    )
                  ) : detectMediaType(mediaPreviewUrl) === 'image' ? (
                    <img src={mediaPreviewUrl} alt="Preview" className="w-full rounded-2xl object-cover" />
                  ) : detectMediaType(mediaPreviewUrl) === 'video' ? (
                    <video controls src={mediaPreviewUrl} className="w-full rounded-2xl bg-black" />
                  ) : (
                    <a href={mediaPreviewUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline hover:text-white">
                      Open media link
                    </a>
                  )}
                </div>
              ) : null}
              {(error || status) ? (
                <div className={`rounded-2xl px-4 py-3 text-sm ${error ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'}`}>
                  {error || status}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  {saving ? 'Publishing…' : 'Publish News'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/10 transition"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </section>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">About Page Settings</h2>
              <p className="mt-2 text-sm text-gray-400 max-w-2xl">Edit background images, headings, and archive intro details shown on the public About page.</p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {savingSettings ? 'Saving…' : 'Save Settings'}
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Bridge Heading</label>
                <input
                  value={bridgeHeading}
                  onChange={(e) => setBridgeHeading(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="KHALAI MAKHLOOQ"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Bridge Subtitle</label>
                <textarea
                  value={bridgeSubtitle}
                  onChange={(e) => setBridgeSubtitle(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="From Stanton to Pyro, the route gets spicy..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Bridge Background URL</label>
                <input
                  value={bridgeBackgroundUrl}
                  onChange={(e) => setBridgeBackgroundUrl(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="https://example.com/bridge-bg.jpg"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Archives Background URL</label>
                <input
                  value={archivesBackgroundUrl}
                  onChange={(e) => setArchivesBackgroundUrl(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="https://example.com/archives-bg.jpg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Archive Intro Year</label>
                <input
                  value={archivesIntroYear}
                  onChange={(e) => setArchivesIntroYear(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="2950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Archive Intro Title</label>
                <input
                  value={archivesIntroTitle}
                  onChange={(e) => setArchivesIntroTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="Genesis"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">Archive Intro Description</label>
                <textarea
                  value={archivesIntroDesc}
                  onChange={(e) => setArchivesIntroDesc(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[#020406] px-4 py-3 text-white outline-none focus:border-emerald-500/40"
                  placeholder="Squad's first proper entry. Scene officially live."
                />
              </div>
            </div>
          </div>

          {settingsError || settingsStatus ? (
            <div className={`mt-6 rounded-2xl px-4 py-3 text-sm ${settingsError ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'}`}>
              {settingsError || settingsStatus}
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Recent News</h2>
            <button
              onClick={loadNews}
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
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-emerald-500/60">
                      {new Date(item.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {item.media_type ? (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gray-300">
                        {item.media_type}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-gray-400 whitespace-pre-wrap leading-relaxed">{item.body}</p>
                  {item.media_url ? (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-black">
                      {item.media_type === 'image' ? (
                        <img src={item.media_url} alt={item.title} className="w-full object-cover" />
                      ) : item.media_type === 'video' ? (
                        <video controls src={item.media_url} className="w-full bg-black" />
                      ) : (
                        <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="block p-4 text-emerald-300 underline hover:text-white">
                          {item.media_url}
                        </a>
                      )}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}