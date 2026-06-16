'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Search, Trash2, Edit3, Save, X,
  RefreshCw, ExternalLink, ToggleLeft, ToggleRight, Loader2, CheckCircle2, AlertCircle,
  LogOut,
} from 'lucide-react';
import { AuthScreen, LoginScreen, DeniedScreen } from '../../../src/components/fleet/admin/FleetAdminAuth';

/* ───────── Helper: validate a slug via FleetYards ───────── */
async function validateFleetyardsSlug(slug) {
  const res = await fetch(`/api/fleetyards/search?slug=${encodeURIComponent(slug)}`);
  return res.json();
}

/* ───────── Status badge ───────── */
function StatusBadge({ enabled }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
      enabled
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        : 'bg-white/5 border-white/10 text-gray-500'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
      {enabled ? 'Active' : 'Disabled'}
    </span>
  );
}

/* ───────── Single fleet row ───────── */
function FleetRow({ cfg, onEdit, onDelete, onToggle, toggling }) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-white font-bold text-sm">{cfg.display_name || cfg.slug}</span>
          <a
            href={`https://fleetyards.net/fleets/${cfg.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 text-[10px] font-mono hover:text-emerald-400 transition-colors w-fit"
          >
            {cfg.slug}
            <ExternalLink size={9} />
          </a>
        </div>
      </td>
      <td className="px-5 py-4">
        <StatusBadge enabled={cfg.enabled} />
      </td>
      <td className="px-5 py-4">
        <span className="text-gray-600 text-xs font-mono">{cfg.sort_order ?? 0}</span>
      </td>
      <td className="px-5 py-4">
        <span className="text-gray-700 text-[10px] font-mono">
          {cfg.created_at ? new Date(cfg.created_at).toLocaleDateString() : '—'}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggle(cfg)}
            disabled={toggling === cfg.id}
            title={cfg.enabled ? 'Disable fleet' : 'Enable fleet'}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all disabled:opacity-50"
          >
            {toggling === cfg.id
              ? <Loader2 size={14} className="animate-spin" />
              : cfg.enabled ? <ToggleRight size={14} /> : <ToggleLeft size={14} />
            }
          </button>
          <button
            onClick={() => onEdit(cfg)}
            title="Edit"
            className="p-2 rounded-lg border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(cfg.id, cfg.display_name || cfg.slug)}
            title="Remove"
            className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ───────── Edit row ───────── */
function EditRow({ data, onChange, onSave, onCancel, saving }) {
  return (
    <tr className="bg-emerald-500/[0.03] border-l-2 border-l-emerald-500">
      <td className="px-5 py-3">
        <div className="space-y-1.5">
          <input
            value={data.slug || ''}
            onChange={e => onChange('slug', e.target.value)}
            placeholder="fleetyards-slug"
            className="w-full rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs font-mono outline-none focus:border-emerald-500/50 transition-colors"
          />
          <input
            value={data.display_name || ''}
            onChange={e => onChange('display_name', e.target.value)}
            placeholder="Display Name"
            className="w-full rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </td>
      <td className="px-5 py-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!data.enabled}
            onChange={e => onChange('enabled', e.target.checked)}
            className="accent-emerald-500"
          />
          <span className="text-xs text-gray-400">Enabled</span>
        </label>
      </td>
      <td className="px-5 py-3">
        <input
          type="number"
          value={data.sort_order ?? 0}
          onChange={e => onChange('sort_order', parseInt(e.target.value, 10))}
          className="w-20 rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs font-mono outline-none focus:border-emerald-500/50 transition-colors"
        />
      </td>
      <td className="px-5 py-3" />
      <td className="px-5 py-3">
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
          >
            <Save size={12} /> {saving ? '…' : 'Save'}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 text-xs font-bold hover:bg-white/5 transition-all"
          >
            <X size={12} /> Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ───────── Add Fleet Modal ───────── */
function AddFleetModal({ onClose, onAdd }) {
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState(null); // { found, fleet } | null
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    if (!slug.trim()) return;
    setValidating(true);
    setValidation(null);
    setError('');
    try {
      const result = await validateFleetyardsSlug(slug.trim());
      setValidation(result);
      if (result.found && result.fleet?.name && !displayName) {
        setDisplayName(result.fleet.name);
      }
    } catch {
      setError('Validation failed — check your connection.');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!slug.trim()) { setError('Slug is required.'); return; }
    setSaving(true);
    setError('');
    const err = await onAdd({ slug: slug.trim(), display_name: displayName.trim() || slug.trim(), sort_order: sortOrder, enabled: true });
    setSaving(false);
    if (err) { setError(err); } else { onClose(); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-[#040c08] p-8 shadow-2xl"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
      >
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <X size={16} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Fleet Registry</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Add FleetYards Slug</h2>
          <p className="text-gray-500 text-sm mt-1">Enter a FleetYards fleet slug or ship model slug, then validate it before adding.</p>
        </div>

        <div className="space-y-4">
          {/* Slug + validate */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">FleetYards Fleet or Model Slug *</label>
            <div className="flex gap-2">
              <input
                value={slug}
                onChange={e => { setSlug(e.target.value); setValidation(null); }}
                onKeyDown={e => e.key === 'Enter' && handleValidate()}
                placeholder="e.g. 100i, arrow, or khalai-makhlooq"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm font-mono outline-none focus:border-emerald-500/40 transition-colors"
              />
              <button
                onClick={handleValidate}
                disabled={validating || !slug.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
              >
                {validating ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                Validate
              </button>
            </div>

            {/* Validation result */}
            {validation && (
              <div className={`mt-2 flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
                validation.found
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/20 bg-red-500/10 text-red-400'
              }`}>
                {validation.found
                  ? <CheckCircle2 size={14} />
                  : <AlertCircle size={14} />
                }
                {validation.found
                  ? `Found: "${validation.fleet?.name || slug}" — ${validation.fleet?.memberCount ?? '?'} members`
                  : 'Fleet not found on FleetYards. Double-check the slug.'
                }
              </div>
            )}
          </div>

          {/* Display name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Display Name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Display name (auto-filled after validate)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/40 transition-colors"
            />
          </div>

          {/* Sort order */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(parseInt(e.target.value, 10))}
              className="w-32 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm font-mono outline-none focus:border-emerald-500/40 transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={saving || !slug.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {saving ? 'Adding…' : 'Add Fleet'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────── Main Admin Page ───────── */
export default function FleetAdminPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [toggling, setToggling] = useState(null);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fleet-configs');
      const data = await res.json();
      setConfigs(Array.isArray(data) ? data : []);
    } catch {
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadAdminSession = async () => {
      setAuthing(true);
      const deniedFromRedirect = window.location.search.includes('denied=1');
      const res = await fetch('/api/auth/discord/session?admin=1', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!mounted) return;

      if (res.ok && data?.admin) {
        setAuthed(true);
        setAccessDenied(false);
        setAdminUser(data.user || null);
        await fetchConfigs();
      } else {
        setAuthed(false);
        setAccessDenied(res.status === 403 || deniedFromRedirect);
        setAdminUser(null);
        setConfigs([]);
        setLoading(false);
      }

      if (mounted) setAuthing(false);
    };

    loadAdminSession();

    return () => {
      mounted = false;
    };
  }, [fetchConfigs]);

  const loginWithDiscord = () => {
    window.location.href = '/api/auth/discord/login?returnTo=/fleet/admin';
  };

  const logout = async () => {
    await fetch('/api/auth/discord/logout', { method: 'POST' });
    setAuthed(false);
    setAccessDenied(false);
    setAdminUser(null);
    setConfigs([]);
  };

  const handleAdd = async (form) => {
    const res = await fetch('/api/fleet-configs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Failed to add fleet.';
    await fetchConfigs();
    return null;
  };

  const handleToggle = async (cfg) => {
    setToggling(cfg.id);
    await fetch(`/api/fleet-configs/${cfg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !cfg.enabled }),
    });
    await fetchConfigs();
    setToggling(null);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}" from the fleet registry?`)) return;
    await fetch(`/api/fleet-configs/${id}`, { method: 'DELETE' });
    await fetchConfigs();
  };

  const startEdit = (cfg) => { setEditId(cfg.id); setEditData({ ...cfg }); };
  const cancelEdit = () => { setEditId(null); setEditData({}); };
  const handleEditChange = (key, val) => setEditData(p => ({ ...p, [key]: val }));

  const handleEditSave = async () => {
    setEditSaving(true);
    await fetch(`/api/fleet-configs/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    cancelEdit();
    await fetchConfigs();
    setEditSaving(false);
  };

  const filtered = filter
    ? configs.filter(c =>
        [c.slug, c.display_name].join(' ').toLowerCase().includes(filter.toLowerCase())
      )
    : configs;

  const enabledCount = configs.filter(c => c.enabled).length;

  if (authing) return <AuthScreen />;
  if (accessDenied) return <DeniedScreen onLogout={logout} />;
  if (!authed) return <LoginScreen onLogin={loginWithDiscord} />;

  return (
    <div className="min-h-screen bg-[#040806] text-white selection:bg-emerald-500/30">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(74,109,86,0.08),transparent_60%)]" />

      <div className="relative z-10 w-full px-3 sm:px-5 2xl:px-8 pt-8 pb-24">

        {/* Top Nav */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/fleet" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors text-xs uppercase tracking-widest font-bold group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Fleet
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={fetchConfigs} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-gray-400 text-xs font-bold hover:text-emerald-400 hover:border-emerald-500/20 transition-all">
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Fleet Command</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Fleet Registry</h1>
            <p className="text-gray-500 text-sm">
              Manage which FleetYards fleets or ship models are displayed on the fleet page.
              Data is fetched live from <span className="text-emerald-400/70 font-mono">api.fleetyards.net</span>.
              {adminUser?.name ? <span className="block mt-1 text-gray-600">Signed in as {adminUser.name}</span> : null}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-400 transition-colors" />
              <input
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Search fleets…"
                className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-emerald-500/40 w-44 transition-all focus:w-60"
              />
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              <Plus size={16} /> Add Slug
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Fleets', value: configs.length },
            { label: 'Active', value: enabledCount },
            { label: 'Disabled', value: configs.length - enabledCount },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-white/5 bg-[#040c08]/60 p-5 backdrop-blur-xl">
              <div className="text-3xl font-bold font-mono text-white mb-1">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-white/5 bg-[#040c08]/40 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/5">
                  {['Fleet', 'Status', 'Order', 'Added', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest animate-pulse">Loading Fleet Registry…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-20 text-center text-gray-500 font-mono text-xs uppercase tracking-widest">
                    {configs.length === 0 ? 'No fleets configured. Add one to get started.' : 'No results match your filter.'}
                  </td></tr>
                ) : filtered.map(cfg =>
                  editId === cfg.id
                    ? <EditRow key={cfg.id} data={editData} onChange={handleEditChange} onSave={handleEditSave} onCancel={cancelEdit} saving={editSaving} />
                    : <FleetRow key={cfg.id} cfg={cfg} onEdit={startEdit} onDelete={handleDelete} onToggle={handleToggle} toggling={toggling} />
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-8 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5 text-sm text-gray-400 space-y-1.5">
          <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">How it works</div>
          <p>• Each entry can be a FleetYards public fleet slug or a model slug like <code className="text-emerald-400 font-mono text-xs">100i</code>.</p>
          <p>• <strong className="text-white">Validate</strong> a slug before adding to confirm it exists on FleetYards.</p>
          <p>• <strong className="text-white">Disable</strong> a slug to hide it temporarily without deleting the config.</p>
          <p>• Supabase table: <code className="text-emerald-400 font-mono text-xs">fleet_configs</code></p>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && <AddFleetModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  );
}
