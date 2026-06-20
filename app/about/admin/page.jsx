'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function AboutAdminPage() {
  // Auth state
  const [authing, setAuthing] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [session, setSession] = useState(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('news');
  
  // News state
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  
  // Settings state
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsStatus, setSettingsStatus] = useState('');
  
  // Figma-like editing state
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [hoveredField, setHoveredField] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  
  // Bridge settings
  const [bridgeHeading, setBridgeHeading] = useState('');
  const [bridgeSubtitle, setBridgeSubtitle] = useState('');
  const [bridgeBackgroundUrl, setBridgeBackgroundUrl] = useState('');
  const [bridgeBackgroundFile, setBridgeBackgroundFile] = useState(null);
  
  // Archives settings
  const [archivesBackgroundUrl, setArchivesBackgroundUrl] = useState('');
  const [archivesBackgroundFile, setArchivesBackgroundFile] = useState(null);
  const [archivesIntroYear, setArchivesIntroYear] = useState('');
  const [archivesIntroTitle, setArchivesIntroTitle] = useState('');
  const [archivesIntroDesc, setArchivesIntroDesc] = useState('');
  
  // News form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mediaType, setMediaType] = useState('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  
  const editFieldRef = useRef(null);

  // Utility functions
  const detectMediaType = (url) => {
    const value = url.trim().toLowerCase();
    if (!value) return 'none';
    if (value.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/)) return 'image';
    if (value.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/)) return 'video';
    return 'link';
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
    setMediaType('none');
    setMediaUrl('');
    setMediaFile(null);
    setMediaPreviewUrl('');
    setError('');
    setStatus('');
  };

  // Media handlers
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
      if (type.startsWith('image/')) setMediaType('image');
      else if (type.startsWith('video/')) setMediaType('video');
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
    if (mediaType === 'none') {
      setMediaType(detectMediaType(value));
    }
  };

  // Background file handlers
  const handleBridgeBackgroundFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setBridgeBackgroundFile(file);
    if (!file) {
      setBridgeBackgroundUrl('');
    }
  };

  const handleArchivesBackgroundFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setArchivesBackgroundFile(file);
    if (!file) {
      setArchivesBackgroundUrl('');
    }
  };

  // Data loading functions
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

  // Auth functions
  const loginWithDiscord = () => {
    window.location.href = '/api/auth/discord/login?returnTo=/about/admin';
  };

  const logout = async () => {
    await fetch('/api/auth/discord/logout', { method: 'POST' });
    window.location.reload();
  };

  // Form submission handlers
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!title.trim() || !body.trim()) {
      setError('Title and news body are required.');
      return;
    }

    if (mediaType === 'link' && !mediaUrl.trim()) {
      setError('Please provide a media URL for the link type.');
      return;
    }

    if ((mediaType === 'image' || mediaType === 'video') && !mediaFile && !mediaUrl.trim()) {
      setError('Please upload a file or provide a URL for image/video news items.');
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
        media_type: mediaType !== 'none' ? mediaType : null,
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
    setStatus('News published successfully! 🎉');
    setNews((prev) => [data, ...prev]);
    setSaving(false);
    
    setTimeout(() => setStatus(''), 5000);
  };

  const handleSaveSettings = async (event) => {
    event?.preventDefault();
    setSettingsError('');
    setSettingsStatus('');

    setSavingSettings(true);
    
    let bodyPayload;
    let headers = {};

    if (bridgeBackgroundFile || archivesBackgroundFile) {
      bodyPayload = new FormData();
      bodyPayload.append('bridge_heading', bridgeHeading);
      bodyPayload.append('bridge_subtitle', bridgeSubtitle);
      bodyPayload.append('archives_intro_year', archivesIntroYear);
      bodyPayload.append('archives_intro_title', archivesIntroTitle);
      bodyPayload.append('archives_intro_desc', archivesIntroDesc);
      
      if (bridgeBackgroundFile) {
        bodyPayload.append('bridge_background_file', bridgeBackgroundFile);
      } else if (bridgeBackgroundUrl) {
        bodyPayload.append('bridge_background_url', bridgeBackgroundUrl);
      }
      
      if (archivesBackgroundFile) {
        bodyPayload.append('archives_background_file', archivesBackgroundFile);
      } else if (archivesBackgroundUrl) {
        bodyPayload.append('archives_background_url', archivesBackgroundUrl);
      }
    } else {
      bodyPayload = JSON.stringify({
        bridge_heading: bridgeHeading,
        bridge_subtitle: bridgeSubtitle,
        bridge_background_url: bridgeBackgroundUrl,
        archives_background_url: archivesBackgroundUrl,
        archives_intro_year: archivesIntroYear,
        archives_intro_title: archivesIntroTitle,
        archives_intro_desc: archivesIntroDesc,
      });
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch('/api/about-settings', {
      method: 'POST',
      headers,
      body: bodyPayload,
    });

    const data = await res.json().catch(() => ({ error: 'Unable to parse response.' }));
    if (!res.ok) {
      setSettingsError(data?.error || 'Failed to save settings.');
      setSavingSettings(false);
      return;
    }

    setSettings(data);
    setBridgeBackgroundUrl(data.bridge_background_url || '');
    setArchivesBackgroundUrl(data.archives_background_url || '');
    setBridgeBackgroundFile(null);
    setArchivesBackgroundFile(null);
    setSettingsStatus('Settings saved successfully! 🎉');
    setSavingSettings(false);
    
    setTimeout(() => setSettingsStatus(''), 5000);
  };

  // Figma-like editing functions
  const startEditing = (fieldName, currentValue) => {
    setEditingField(fieldName);
    setEditingValue(currentValue);
    setTimeout(() => {
      if (editFieldRef.current) {
        editFieldRef.current.focus();
        editFieldRef.current.select();
      }
    }, 0);
  };

  const commitEdit = () => {
    if (editingField) {
      const fieldSetters = {
        bridgeHeading: setBridgeHeading,
        bridgeSubtitle: setBridgeSubtitle,
        archivesIntroYear: setArchivesIntroYear,
        archivesIntroTitle: setArchivesIntroTitle,
        archivesIntroDesc: setArchivesIntroDesc,
        title: setTitle,
        body: setBody,
      };
      
      if (fieldSetters[editingField]) {
        fieldSetters[editingField](editingValue);
      }
      
      setEditingField(null);
      setEditingValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && editingField) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === 'Escape' && editingField) {
      setEditingField(null);
      setEditingValue('');
    }
  };

  // Click outside to commit edit
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingField && editFieldRef.current && !editFieldRef.current.contains(e.target)) {
        commitEdit();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingField, editingValue]);

  // Load session on mount
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

  // Load data when authenticated
  useEffect(() => {
    if (!authed) return;
    loadNews();
    loadSettings();
  }, [authed]);

  // EditableField Component
  const EditableField = ({ 
    fieldName, 
    value, 
    onChange, 
    multiline = false, 
    className = "",
    placeholder = "Click to edit",
    preview = false,
    previewStyle = {}
  }) => {
    const isEditing = editingField === fieldName;
    const isHovered = hoveredField === fieldName;
    const isSelected = selectedElement === fieldName;

    if (isEditing) {
      return (
        <div className="relative">
          {multiline ? (
            <textarea
              ref={editFieldRef}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full rounded-xl border-2 border-blue-400 bg-gray-900/50 px-4 py-3 text-white outline-none transition-all shadow-lg shadow-blue-400/20 ${className}`}
              rows={3}
              autoFocus
            />
          ) : (
            <input
              ref={editFieldRef}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full rounded-xl border-2 border-blue-400 bg-gray-900/50 px-4 py-3 text-white outline-none transition-all shadow-lg shadow-blue-400/20 ${className}`}
              autoFocus
            />
          )}
          <div className="absolute -top-2 -right-2 flex gap-1">
            <button
              type="button"
              onClick={commitEdit}
              className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs hover:bg-blue-400 transition"
              title="Done (Enter)"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => setEditingField(null)}
              className="w-6 h-6 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs hover:bg-gray-500 transition"
              title="Cancel (Esc)"
            >
              ✕
            </button>
          </div>
          <div className="absolute -bottom-6 left-0 text-xs text-blue-400 opacity-75">
            Press Enter to save • Esc to cancel
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative group cursor-text transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-400 rounded-xl' : ''
        } ${isHovered ? 'ring-1 ring-blue-400/50 rounded-xl' : ''}`}
        onMouseEnter={() => setHoveredField(fieldName)}
        onMouseLeave={() => setHoveredField(null)}
        onClick={() => setSelectedElement(fieldName)}
      >
        {preview && value ? (
          <div className={`rounded-xl overflow-hidden border border-white/10 ${isHovered ? 'border-blue-400/50' : ''}`} style={previewStyle}>
            <div className="relative">
              {value}
              {isHovered && (
                <div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                  onDoubleClick={() => startEditing(fieldName, value)}
                >
                  <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                    Double-click to edit
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            onDoubleClick={() => startEditing(fieldName, value)}
            className={`rounded-xl border px-4 py-3 transition-all duration-200 ${
              isHovered 
                ? 'border-blue-400/50 bg-gray-900/50 shadow-lg shadow-blue-400/10' 
                : 'border-white/10 bg-gray-900/30'
            } ${multiline ? 'min-h-[60px]' : ''} ${className}`}
          >
            <div className={`${value ? 'text-gray-200' : 'text-gray-500'} select-none`}>
              {value || placeholder}
            </div>
            
            {isHovered && (
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 flex gap-1">
                <div 
                  className="bg-blue-500 text-white px-2 py-1 rounded-full text-[10px] font-medium shadow-lg cursor-pointer hover:bg-blue-400 transition"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    startEditing(fieldName, value);
                  }}
                >
                  Double-click
                </div>
              </div>
            )}
          </div>
        )}
        
        {isSelected && !isHovered && (
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full border-2 border-gray-900" />
        )}
      </div>
    );
  };

  // Loading state
  if (authing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="mt-6 text-lg text-gray-300 font-medium">Verifying admin access...</p>
          <p className="mt-2 text-sm text-gray-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-6">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Access Required</h1>
            <p className="mt-3 text-gray-400">Sign in with Discord to manage the About page content.</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={loginWithDiscord}
              className="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-lg font-semibold text-white hover:bg-indigo-500 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
                </svg>
                Sign in with Discord
              </span>
            </button>
            
            <Link href="/about" className="block w-full text-center py-3 text-gray-400 hover:text-white transition">
              ← Return to About Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main Admin Panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">
                <span className="text-emerald-400">About</span> Admin
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Figma Mode</span>
              </h1>
              <nav className="hidden sm:flex items-center gap-2 ml-8">
                <button
                  onClick={() => setActiveTab('news')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'news'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  📝 News Manager
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'settings'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  ⚙️ Page Settings
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                {session?.username || 'Admin'}
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                Sign Out
              </button>
              <Link href="/about" className="px-4 py-2 rounded-xl text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition">
                View Page
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="sm:hidden flex gap-2 pb-3">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'news'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📝 News
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'news' && (
          <div className="space-y-8">
            {/* News Publisher */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Create News Item</h2>
                  <p className="mt-1 text-sm text-gray-400">Double-click fields to edit inline</p>
                </div>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
                >
                  Clear Form
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <EditableField
                      fieldName="title"
                      value={title}
                      onChange={setTitle}
                      placeholder="What's new in the verse?"
                      className="text-lg font-semibold"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Content <span className="text-red-400">*</span>
                    </label>
                    <EditableField
                      fieldName="body"
                      value={body}
                      onChange={setBody}
                      multiline
                      placeholder="Share the details..."
                    />
                  </div>
                </div>

                {/* Media Section */}
                <div className="bg-gray-900/30 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4">Media Attachment</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {[
                        { value: 'none', label: 'None', icon: '🚫' },
                        { value: 'image', label: 'Image', icon: '🖼️' },
                        { value: 'video', label: 'Video', icon: '🎬' },
                        { value: 'link', label: 'Link', icon: '🔗' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleMediaTypeChange(type.value)}
                          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            mediaType === type.value
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gray-800/50 text-gray-400 border border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="block text-lg mb-1">{type.icon}</span>
                          {type.label}
                        </button>
                      ))}
                    </div>

                    {mediaType !== 'none' && (
                      <div className="space-y-3">
                        {(mediaType === 'image' || mediaType === 'video') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Upload File
                            </label>
                            <div className="flex items-center gap-3">
                              <label className="cursor-pointer px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition text-sm font-medium">
                                Browse Files
                                <input
                                  type="file"
                                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                                  onChange={handleMediaFileChange}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-sm text-gray-400 truncate">
                                {mediaFile?.name || 'No file selected'}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {mediaType === 'link' ? 'URL' : 'Or paste a URL'}
                          </label>
                          <input
                            value={mediaUrl}
                            onChange={handleMediaUrlChange}
                            className="w-full rounded-2xl border border-white/10 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 transition text-sm"
                            placeholder={mediaType === 'link' ? 'https://...' : 'Optional direct URL'}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {mediaPreviewUrl && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
                      <div className="bg-gray-900/50 px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">Preview</span>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaPreviewUrl('');
                            setMediaFile(null);
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="p-4">
                        {mediaFile || detectMediaType(mediaPreviewUrl) === 'image' ? (
                          <img src={mediaPreviewUrl} alt="Preview" className="w-full rounded-xl max-h-64 object-cover" />
                        ) : detectMediaType(mediaPreviewUrl) === 'video' ? (
                          <video controls src={mediaPreviewUrl} className="w-full rounded-xl max-h-64 bg-black" />
                        ) : (
                          <a href={mediaPreviewUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 break-all">
                            {mediaPreviewUrl}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}
                
                {status && (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2">
                    <span>✅</span> {status}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-black hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <span>📢</span> Publish News
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recent News */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Recent News</h2>
                  <p className="mt-1 text-sm text-gray-400">{news.length} items published</p>
                </div>
                <button
                  onClick={loadNews}
                  className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition flex items-center gap-2"
                >
                  <span>🔄</span> Refresh
                </button>
              </div>

              {loadingNews ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl bg-gray-900/30 p-6 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
                      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">📭</span>
                  <p className="text-gray-400">No news items yet. Create your first update!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {news.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-gray-900/30 border border-white/5 p-6 hover:border-white/10 transition">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-mono text-emerald-400/60">
                          {new Date(item.published_at).toLocaleDateString(undefined, { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {item.media_type && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                            {item.media_type === 'image' ? '🖼️' : item.media_type === 'video' ? '🎬' : '🔗'} {item.media_type}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">{item.body}</p>
                      {item.media_url && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                          {item.media_type === 'image' ? (
                            <img src={item.media_url} alt={item.title} className="w-full object-cover max-h-48" />
                          ) : item.media_type === 'video' ? (
                            <video controls src={item.media_url} className="w-full max-h-48 bg-black" />
                          ) : (
                            <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="block p-4 text-emerald-400 hover:text-emerald-300 break-all">
                              {item.media_url}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 sticky top-20 z-40 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">Page Settings</h2>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400" /> 
                      Double-click to edit
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> 
                      Click to select
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {savingSettings ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>💾</span> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {loadingSettings ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                <div className="space-y-6 animate-pulse">
                  <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-12 bg-gray-700 rounded-2xl"></div>
                  <div className="h-12 bg-gray-700 rounded-2xl"></div>
                  <div className="h-24 bg-gray-700 rounded-2xl"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bridge Section */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🌉</span>
                    <div>
                      <h3 className="text-xl font-bold">Bridge Hero Section</h3>
                      <p className="text-sm text-gray-400">Main heading area configuration</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Heading Text</label>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">H1</span>
                      </div>
                      <EditableField
                        fieldName="bridgeHeading"
                        value={bridgeHeading}
                        onChange={setBridgeHeading}
                        placeholder="Enter bridge heading..."
                        className="text-lg font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Subtitle Text</label>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Paragraph</span>
                      </div>
                      <EditableField
                        fieldName="bridgeSubtitle"
                        value={bridgeSubtitle}
                        onChange={setBridgeSubtitle}
                        multiline
                        placeholder="Enter bridge subtitle..."
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Background Image</label>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Image</span>
                      </div>
                      
                      {bridgeBackgroundUrl && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-white/10">
                          <img
                            src={bridgeBackgroundUrl}
                            alt="Bridge background"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition text-sm font-medium text-center">
                          {bridgeBackgroundFile?.name || '📁 Replace Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBridgeBackgroundFileChange}
                            className="hidden"
                          />
                        </label>
                        {bridgeBackgroundUrl && (
                          <button
                            type="button"
                            onClick={() => setBridgeBackgroundUrl('')}
                            className="px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Archives Section */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">📚</span>
                    <div>
                      <h3 className="text-xl font-bold">Archives Section</h3>
                      <p className="text-sm text-gray-400">Timeline intro and background</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Background Image</label>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Image</span>
                      </div>
                      
                      {archivesBackgroundUrl && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-white/10">
                          <img
                            src={archivesBackgroundUrl}
                            alt="Archives background"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition text-sm font-medium text-center">
                          {archivesBackgroundFile?.name || '📁 Replace Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleArchivesBackgroundFileChange}
                            className="hidden"
                          />
                        </label>
                        {archivesBackgroundUrl && (
                          <button
                            type="button"
                            onClick={() => setArchivesBackgroundUrl('')}
                            className="px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-300">Year</label>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Text</span>
                        </div>
                        <EditableField
                          fieldName="archivesIntroYear"
                          value={archivesIntroYear}
                          onChange={setArchivesIntroYear}
                          placeholder="2950"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-300">Title</label>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">H2</span>
                        </div>
                        <EditableField
                          fieldName="archivesIntroTitle"
                          value={archivesIntroTitle}
                          onChange={setArchivesIntroTitle}
                          placeholder="Genesis"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Paragraph</span>
                      </div>
                      <EditableField
                        fieldName="archivesIntroDesc"
                        value={archivesIntroDesc}
                        onChange={setArchivesIntroDesc}
                        multiline
                        placeholder="Enter archives description..."
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">👁️</span>
                    <div>
                      <h3 className="text-lg font-semibold">Live Preview</h3>
                      <p className="text-sm text-gray-400">Real-time preview of your changes</p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={bridgeBackgroundUrl || '/placeholder-bg.jpg'}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent flex flex-col justify-center p-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                          {bridgeHeading || 'KHALAI MAKHLOOQ'}
                        </h1>
                        <p className="text-lg text-gray-300">
                          {bridgeSubtitle || 'Your subtitle appears here'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {settingsError && (
                  <div className="rounded-3xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-300 flex items-center gap-2">
                    <span>⚠️</span> {settingsError}
                  </div>
                )}
                
                {settingsStatus && (
                  <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 text-sm text-emerald-300 flex items-center gap-2">
                    <span>✅</span> {settingsStatus}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}