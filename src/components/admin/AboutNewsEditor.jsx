'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Save, Image as ImageIcon, Loader2, Send, X, AlertCircle, CheckCircle2, Edit3, Trash2, Plus } from 'lucide-react';

export default function AboutNewsEditor() {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');
  const [keepMedia, setKeepMedia] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [status, setStatus] = useState(null); // { type: 'error' | 'success', message: '' }
  
  const fileInputRef = useRef(null);

  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const res = await fetch('/api/about-news');
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setStatus({ type: 'error', message: 'Only image or video files are allowed.' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setMediaFile(file);
    setMediaPreviewUrl(objectUrl);
    setKeepMedia(false); // New file means we overwrite old media
    setStatus(null);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreviewUrl('');
    setKeepMedia(false); // Explicitly clear media
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setBody('');
    setPublishedAt('');
    setMediaFile(null);
    setMediaPreviewUrl('');
    setKeepMedia(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setStatus(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setBody(item.body || '');
    setPublishedAt(item.published_at ? item.published_at.substring(0, 10) : '');
    setMediaPreviewUrl(item.media_url || '');
    setMediaFile(null);
    setKeepMedia(true);
    setStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/about-news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus({ type: 'success', message: 'News dispatch deleted successfully.' });
        if (editingId === id) resetForm();
        fetchNews();
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.error || 'Failed to delete news.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'A network error occurred.' });
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !body.trim()) {
      setStatus({ type: 'error', message: 'Title and body are required.' });
      return;
    }

    setSaving(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (publishedAt) {
      formData.append('published_at', publishedAt);
    }

    if (editingId) {
      formData.append('keep_media', keepMedia);
    }

    if (mediaFile) {
      formData.append('media_file', mediaFile);
      formData.append('media_type', mediaFile.type.startsWith('video/') ? 'video' : 'image');
    }

    const url = editingId ? `/api/about-news/${editingId}` : '/api/about-news';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setStatus({ type: 'success', message: `News dispatch ${editingId ? 'updated' : 'published'} successfully!` });
        resetForm();
        fetchNews();
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.error || `Failed to ${editingId ? 'update' : 'publish'} news.` });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'A network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-24">
      {status && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${
          status.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.message}
        </div>
      )}

      {/* Editor Form */}
      <div className="bg-[#050B08] rounded-[2rem] border border-white/[0.07] p-8 shadow-[0_0_50px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              {editingId ? <Edit3 size={24} className="text-blue-500" /> : <Send size={24} className="text-emerald-500" />}
              {editingId ? 'Edit Dispatch' : 'Post News Dispatch'}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {editingId ? 'Update an existing news dispatch.' : 'Publish a new dispatch to the About page. It will instantly appear in the "News from the bridge" section.'}
            </p>
          </div>
          {editingId && (
            <button 
              onClick={resetForm}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Server Migration Complete"
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Body</label>
            <textarea 
              rows="6"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the main content of the dispatch..."
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all resize-y"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Date (Optional)</label>
            <input 
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Attached Media (Optional)</label>
            
            {mediaPreviewUrl ? (
              <div className="relative rounded-xl border border-white/10 overflow-hidden bg-black max-h-[300px] flex items-center justify-center group">
                {mediaPreviewUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/) || mediaFile?.type.startsWith('video/') ? (
                  <video src={mediaPreviewUrl} className="w-full h-full object-contain" controls />
                ) : (
                  <img src={mediaPreviewUrl} className="w-full h-full object-contain" alt="Preview" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeMedia(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm pointer-events-auto hover:bg-red-600 transition-colors"
                  >
                    <X size={16} /> Remove Media
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
              >
                <ImageIcon size={24} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Click to upload image or video</span>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Supported: JPG, PNG, WEBP, MP4, WEBM</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*,video/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.07] flex justify-end">
          <button
            onClick={handlePublish}
            disabled={saving || !title.trim() || !body.trim()}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:shadow-none ${
              editingId 
                ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
            }`}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Publish Dispatch')}
          </button>
        </div>
      </div>

      {/* Dispatches List */}
      <div className="bg-[#050B08] rounded-[2rem] border border-white/[0.07] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6">Manage Dispatches</h3>
        
        {loadingNews ? (
          <div className="py-12 flex flex-col items-center justify-center text-emerald-500/50 gap-4">
            <Loader2 size={32} className="animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Loading Dispatches...</span>
          </div>
        ) : news.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border border-white/5 rounded-xl bg-white/[0.02]">
            <p className="font-mono text-xs uppercase tracking-widest">No dispatches found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${editingId === item.id ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'}`}>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                    {new Date(item.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h4 className="text-white font-bold truncate">{item.title}</h4>
                  <p className="text-gray-400 text-xs truncate mt-1">{item.body}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/20"
                    title="Edit Dispatch"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={deletingId === item.id}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 disabled:opacity-50"
                    title="Delete Dispatch"
                  >
                    {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
