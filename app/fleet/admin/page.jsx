'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Search, Trash2, Edit3, Save, X, Shield, Users,
  RefreshCw, ExternalLink, ToggleLeft, ToggleRight, Loader2, CheckCircle2, AlertCircle,
  LogOut, UserPlus, UserMinus,
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
function FleetRow({ cfg, onEdit, onDelete, onToggle, toggling, onManageMembers }) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="px-5 py-5">
        <div className="flex flex-col gap-1">
          <span className="text-white font-bold text-sm tracking-wide">{cfg.display_name || cfg.slug}</span>
          <a
            href={`https://fleetyards.net/fleets/${cfg.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-500 text-[10px] font-mono hover:text-emerald-400 transition-colors w-fit"
          >
            {cfg.slug}
            <ExternalLink size={10} />
          </a>
        </div>
      </td>
      <td className="px-5 py-5">
        <StatusBadge enabled={cfg.enabled} />
      </td>
      <td className="px-5 py-5">
        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${cfg.fleet_type === 'rare' ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20 shadow-[0_0_10px_rgba(163,230,53,0.1)]' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
          {cfg.fleet_type || 'small'}
        </span>
      </td>
      <td className="px-5 py-5">
        <span className="text-gray-300 text-xs font-medium truncate max-w-[120px] block">{cfg.ceo_name || '—'}</span>
      </td>
      <td className="px-5 py-5 text-center">
        <span className="inline-flex items-center justify-center min-w-[28px] h-[28px] rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs shadow-[0_0_10px_rgba(16,185,129,0.1)]">×{cfg.quantity || 1}</span>
      </td>
      <td className="px-5 py-5">
        <span className="text-gray-500 text-xs font-mono bg-white/5 px-2 py-1 rounded-md">{cfg.sort_order ?? 0}</span>
      </td>
      <td className="px-5 py-5">
        <span className="text-gray-600 text-[10px] font-mono uppercase tracking-wider">
          {cfg.created_at ? new Date(cfg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
        </span>
      </td>
      <td className="px-5 py-5">
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
            onClick={() => onManageMembers(cfg)}
            title="Manage Members"
            className="p-2 rounded-lg border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            <Users size={14} />
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
    <tr className="bg-emerald-500/[0.03] border-y border-emerald-500/20 shadow-[inset_4px_0_0_rgba(16,185,129,1)] relative z-10">
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
        <select
          value={data.fleet_type || 'small'}
          onChange={e => onChange('fleet_type', e.target.value)}
          className="w-full rounded-lg border border-emerald-500/20 bg-white/5 px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
        >
          <option value="small">Small</option>
          <option value="rare">Rare</option>
        </select>
      </td>
      <td className="px-5 py-3">
        <input
          value={data.ceo_name || ''}
          onChange={e => onChange('ceo_name', e.target.value)}
          placeholder="CEO Name"
          className="w-full rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
        />
      </td>
      <td className="px-5 py-3">
        <input
          type="number"
          value={data.quantity || 1}
          min="1"
          onChange={e => onChange('quantity', parseInt(e.target.value, 10) || 1)}
          className="w-16 rounded-lg border border-emerald-500/20 bg-white/5 px-2 py-1.5 text-white text-xs font-mono outline-none focus:border-emerald-500/50 transition-colors text-center"
        />
      </td>
      <td className="px-5 py-3">
        <input
          type="number"
          value={data.sort_order ?? 0}
          onChange={e => onChange('sort_order', parseInt(e.target.value, 10))}
          className="w-16 rounded-lg border border-emerald-500/20 bg-white/5 px-2 py-1.5 text-white text-xs font-mono outline-none focus:border-emerald-500/50 transition-colors"
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
  const [fleetType, setFleetType] = useState('small');
  const [ceoName, setCeoName] = useState('');
  const [quantity, setQuantity] = useState(1);
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
    const err = await onAdd({ 
      slug: slug.trim(), 
      display_name: displayName.trim() || slug.trim(), 
      sort_order: sortOrder, 
      enabled: true,
      fleet_type: fleetType,
      ceo_name: ceoName.trim(),
      quantity: quantity
    });
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
      <div className="absolute inset-0 bg-[#020408]/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-[2rem] border border-white/[0.07] bg-[#050B08] shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
      >
        <div className="p-8">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <X size={16} />
        </button>

<div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight leading-none">Add Fleet Asset</h2>
              <div className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest mt-1">Registry Configuration</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main lookup */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">FleetYards Slug / Identifier</label>
            <div className="flex gap-2">
              <input
                value={slug}
                onChange={e => { setSlug(e.target.value); setValidation(null); setError(''); }}
                placeholder="e.g. origin-jumpworks-890-jump"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white text-sm font-mono outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all"
              />
              <button
                onClick={handleValidate}
                disabled={validating || !slug.trim()}
                className="px-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 text-white font-bold transition-all disabled:opacity-50 disabled:hover:bg-white/5 flex items-center gap-2 text-sm"
              >
                {validating ? <Loader2 size={16} className="animate-spin text-emerald-500" /> : <Search size={16} className="text-emerald-500" />}
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

          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Custom Display Name (optional)"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all"
            />
          </div>

          {/* CEO Name - full width so it's always visible */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">CEO Name</label>
            <input
              value={ceoName}
              onChange={e => setCeoName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all"
            />
          </div>

          {/* Fleet Type */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">Fleet Type</label>
            <div className="flex bg-white/[0.02] rounded-xl border border-white/10 overflow-hidden p-1">
              <button
                type="button"
                onClick={() => setFleetType('small')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${fleetType === 'small' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Small
              </button>
              <button
                type="button"
                onClick={() => setFleetType('rare')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${fleetType === 'rare' ? 'bg-lime-500/20 text-lime-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Rare
              </button>
            </div>
          </div>

          {/* Quantity and Sort Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white text-sm font-mono outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={e => setSortOrder(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white text-sm font-mono outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all text-center"
              />
            </div>
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
              className="w-full py-4 mt-2 rounded-xl bg-emerald-500 text-black font-black uppercase tracking-widest text-sm hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Registering...' : 'Register Asset to Fleet'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────── Manage Members Modal ───────── */
function ManageMembersModal({ fleet, onClose }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fleet-members?fleetId=${fleet.id}`);
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch { setMembers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMembers(); }, [fleet.id]);

  const handleAdd = async () => {
    if (!name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/fleet-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fleet_config_id: fleet.id, name: name.trim(), role: role.trim() || 'Member' }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed to add.'); return; }
      setName(''); setRole('');
      await fetchMembers();
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/fleet-members/${id}`, { method: 'DELETE' });
    await fetchMembers();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[#020408]/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/[0.07] bg-[#050B08] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[80vh]"
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-white/[0.06] shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black uppercase tracking-tight text-white leading-none">Fleet Members</h2>
            <div className="text-[10px] font-mono text-blue-400/50 uppercase tracking-widest mt-1 truncate">
              {fleet.display_name || fleet.slug}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 size={20} className="animate-spin text-blue-400/50 mr-2" />
              <span className="text-xs font-mono uppercase tracking-widest">Loading...</span>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-xs font-mono uppercase tracking-widest">
              No members yet. Add one below.
            </div>
          ) : (
            members.map(m => (
              <div key={m.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] group">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 text-[10px] font-black uppercase">
                  {m.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{m.name}</div>
                  <div className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">{m.role || 'Member'}</div>
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove member"
                >
                  <UserMinus size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add member form */}
        <div className="p-4 border-t border-white/[0.06] shrink-0 space-y-3">
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={12} /> {error}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Member name"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all"
            />
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Role (e.g. Pilot)"
              className="w-28 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all"
            />
            <button
              onClick={handleAdd}
              disabled={saving || !name.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm transition-all disabled:opacity-50 shrink-0"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              Add
            </button>
          </div>
          <div className="text-[10px] font-mono text-gray-600 text-center">
            {members.length} member{members.length !== 1 ? 's' : ''} in this fleet
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
  const [searchQ, setSearchQ] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [error, setError] = useState('');

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

  const handleLogout = async () => {
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

  const filtered = searchQ
    ? configs.filter(c =>
        [c.slug, c.display_name].join(' ').toLowerCase().includes(searchQ.toLowerCase())
      )
    : configs;

  const enabledCount = configs.filter(c => c.enabled).length;

  if (authing) return <AuthScreen />;
  if (accessDenied) return <DeniedScreen onLogout={handleLogout} />;
  if (!authed) return <LoginScreen onLogin={() => window.location.href = '/api/auth/discord/login?returnTo=/fleet/admin'} />;

  return (
    <div className="min-h-[100dvh] bg-[#020402] text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.1),transparent)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-[calc(100dvh-4rem)]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 shrink-0">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-mono font-black uppercase tracking-[0.35em] text-emerald-500 mb-2">
              <Shield size={14} className="animate-pulse" /> KMHQ Secure
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-4">
              Fleet <span className="text-emerald-500">Registry</span>
            </h1>
            <p className="text-gray-400 text-sm mt-3 max-w-xl leading-relaxed">
              Manage the master list of approved ship configurations. Ships added here are deployed instantly to the public Fleet Command interface.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchConfigs()}
              disabled={loading}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all disabled:opacity-50 group"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:text-emerald-400 transition-colors'} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <Plus size={18} /> New Asset
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Filters and Stats Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search registry..."
              className="w-full rounded-full border border-white/10 bg-white/[0.02] pl-11 pr-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all backdrop-blur-md"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col px-5 py-2 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">Total Assets</span>
              <span className="text-white font-black text-lg leading-none">{configs.length}</span>
            </div>
            <div className="flex flex-col px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <span className="text-[9px] font-mono font-bold text-emerald-500/70 uppercase tracking-widest">Active</span>
              <span className="text-emerald-400 font-black text-lg leading-none">{enabledCount}</span>
            </div>
          </div>
        </div>

        {/* Registry Table Container */}
        <div className="flex-1 relative rounded-[2rem] border border-white/[0.07] bg-[#050B08]/80 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden flex flex-col">
          {error && (
            <div className="m-4 shrink-0 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="flex-1 overflow-auto custom-scrollbar">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center text-gray-500 gap-4">
                <Loader2 size={32} className="animate-spin text-emerald-500/50" />
                <span className="font-mono text-[10px] uppercase tracking-widest">Accessing Registry Data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Search size={24} className="text-gray-600" />
                </div>
                <p className="font-mono text-xs uppercase tracking-widest">No matching registry entries found.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left border-collapse">
                <thead className="sticky top-0 bg-[#050B08]/90 backdrop-blur-md z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                  <tr>
                    {['Asset ID / Fleet', 'Status', 'Class', 'CEO Name', 'Qty', 'Sort', 'Registered', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map(cfg =>
                    editId === cfg.id
                      ? <EditRow key={cfg.id} data={editData} onChange={handleEditChange} onSave={handleEditSave} onCancel={cancelEdit} saving={editSaving} />
                      : <FleetRow key={cfg.id} cfg={cfg} onEdit={startEdit} onDelete={handleDelete} onToggle={handleToggle} toggling={toggling} />
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Info box */}
        <div className="shrink-0 mt-6 rounded-[1.5rem] border border-emerald-500/10 bg-emerald-500/[0.02] p-5 text-sm text-gray-400 space-y-1.5 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div>
            <div className="text-emerald-500/70 font-mono font-bold text-[10px] uppercase tracking-[0.2em] mb-1">System Architecture</div>
            <p className="text-xs">
              <strong className="text-white font-medium">Validation Required</strong>: All entries cross-referenced via FleetYards secure API.<br/>
              Target Database: <code className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-1 py-0.5 rounded ml-1">fleet_configs</code>
            </p>
          </div>
          <div className="text-right text-xs">
            Admin access managed via <strong className="text-white">Discord Auth</strong>.
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && <AddFleetModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  );
}
