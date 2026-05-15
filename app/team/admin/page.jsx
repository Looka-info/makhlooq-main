'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit3, Save, X, Shield, Search, LogOut, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// Modular Components
import { 
  ColorPicker, 
  AddMemberModal, 
  STATUS_COLORS, 
  ROLES, 
  CATS 
} from '../../../src/components/team/AdminComponents';

export default function AdminPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [session, setSession] = useState(null);
  const [authing, setAuthing] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetch = async (userSession) => {
    setLoading(true);
    let currentAuthed = false;

    if (userSession) {
      const dId = userSession.user?.user_metadata?.provider_id || 
                  userSession.user?.user_metadata?.sub || 
                  userSession.user?.identities?.[0]?.id;
      if (dId) {
        const { data: adminCheck } = await supabase
          .from('team_members')
          .select('is_admin')
          .eq('discord_uid', dId)
          .single();
        if (adminCheck?.is_admin) {
          setAuthed(true);
          currentAuthed = true;
        } else {
          setAuthed(false);
        }
      }
    }

    if (currentAuthed) {
      const { data } = await supabase.from('team_members').select('*').order('joined_at');
      setMembers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetch(session);
      else setAuthing(false);
      setAuthing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetch(session);
      else {
        setAuthed(false);
        setMembers([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithDiscord = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin + '/team/admin' }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const startEdit = (m) => { setEditId(m.id); setEditData({ ...m }); };
  const cancelEdit = () => { setEditId(null); setEditData({}); };

  const saveEdit = async () => {
    setSaving(true);
    const { name, node_color, role, category, status, bio, is_admin, avatar_url } = editData;
    await supabase.from('team_members').update({ name, node_color, role, category, status, bio, is_admin, avatar_url }).eq('id', editId);
    await fetch(session);
    cancelEdit();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm('Remove this member from the roster?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    await fetch(session);
  };

  const syncDiscord = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/discord/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully synced ${data.synced} members!`);
        await fetch(session);
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
    setSyncing(false);
  };

  const filtered = filter
    ? members.filter(m => [m.name, m.role, m.category].join(' ').toLowerCase().includes(filter.toLowerCase()))
    : members;

  if (authing) {
    return (
      <div className="min-h-screen bg-[#040806] text-white flex flex-col items-center justify-center p-6 gap-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Initializing Secure Link...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#040806] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 border border-emerald-500/10 rounded-3xl p-10 backdrop-blur-xl"
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <Shield size={40} className="text-emerald-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
            <p className="text-gray-500 text-sm mb-8 uppercase tracking-widest font-mono">Restricted Access</p>
            <button
              onClick={loginWithDiscord}
              className="w-full py-4 rounded-xl bg-[#5865F2] text-white font-bold hover:bg-[#4752C4] transition-all shadow-[0_0_20px_rgba(88,101,242,0.2)] flex items-center justify-center gap-3"
            >
              <img src="https://assets-global.website-files.com/6257adef93467e5028da4f2d/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="" className="w-6" />
              Sign in with Discord
            </button>
            <Link href="/team" className="inline-flex items-center gap-2 mt-8 text-gray-500 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">
              <ArrowLeft size={14} /> Return to Network
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#040806] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/5 border border-red-500/10 rounded-3xl p-10 backdrop-blur-xl"
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <Shield size={40} className="text-red-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400 text-sm mb-8">Identification confirmed, but administrative clearance was not found for this account.</p>
            <button
              onClick={logout}
              className="w-full py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all mb-4 flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Sign Out
            </button>
            <Link href="/team" className="inline-flex items-center gap-2 mt-4 text-gray-600 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">
              <ArrowLeft size={14} /> Back to Network
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040806] text-white selection:bg-emerald-500/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.06),transparent_55%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center justify-between">
            <Link href="/team" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors text-sm font-medium group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Team Graph
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all"
            >
              <LogOut size={14} /> End Session
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-black uppercase tracking-widest">Administrator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Fleet Management</h1>
              <p className="text-gray-500 text-sm">Operational control over personnel and network topology</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="Filter personnel…"
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-emerald-500/40 w-48 transition-all focus:w-64"
                />
              </div>
              <button
                onClick={syncDiscord}
                disabled={syncing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Syncing...' : 'Sync Discord'}
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <Plus size={16} /> Deploy Member
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Personnel', value: members.length },
            { label: 'Active Roster', value: members.filter(m => m.status === 'online').length },
            { label: 'Command Clearance', value: members.filter(m => m.is_admin).length },
            { label: 'Display Count', value: filtered.length },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-emerald-500/10 bg-[#040c08]/50 px-6 py-5 backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">{s.label}</div>
              <div className="text-3xl font-bold text-white font-mono">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table Container */}
        <div className="rounded-3xl border border-white/5 bg-[#040c08]/40 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  {['Personnel', 'Tactical Role', 'Network Status', 'Neural Color', 'Clearance', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest animate-pulse">Synchronizing Data...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-500 font-mono text-xs uppercase tracking-widest">No matching personnel records found</td></tr>
                ) : filtered.map(m => {
                  const isEditing = editId === m.id;
                  const d = isEditing ? editData : m;
                  return (
                    <tr key={m.id} className="group hover:bg-white/2 transition-colors">
                      {/* Member */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-xl overflow-hidden border-2 flex-shrink-0 shadow-lg"
                            style={{ borderColor: d.node_color || '#10b981' }}
                          >
                            {m.avatar_url
                              ? <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center font-bold" style={{ background: d.node_color || '#10b981', color: '#040806' }}>{m.name?.[0]}</div>
                            }
                          </div>
                          <div className="flex flex-col">
                            {isEditing ? (
                              <div className="space-y-2">
                                <input value={d.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs outline-none focus:border-emerald-500/40" placeholder="Name" />
                                <input value={d.avatar_url || ''} onChange={e => setEditData(p => ({ ...p, avatar_url: e.target.value }))} className="w-full rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs outline-none focus:border-emerald-500/40" placeholder="Avatar URL" />
                              </div>
                            ) : (
                              <>
                                <div className="text-white font-bold tracking-tight">{m.name}</div>
                                <div className="text-gray-600 text-[10px] font-mono">{m.discord_tag || 'DISCORD_N/A'}</div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role / Cat */}
                      <td className="px-6 py-5">
                        {isEditing ? (
                          <div className="space-y-2">
                            <select value={d.role} onChange={e => setEditData(p => ({ ...p, role: e.target.value }))} className="w-full rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs outline-none focus:border-emerald-500/40">
                              {ROLES.map(r => <option key={r} value={r} className="bg-[#0a1a12]">{r}</option>)}
                            </select>
                            <select value={d.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value }))} className="w-full rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs outline-none focus:border-emerald-500/40">
                              {CATS.map(c => <option key={c} value={c} className="bg-[#0a1a12]">{c}</option>)}
                            </select>
                          </div>
                        ) : (
                          <div>
                            <div className="text-emerald-400 font-medium text-xs uppercase tracking-wider">{m.role}</div>
                            <div className="text-gray-600 text-[10px] uppercase tracking-widest">{m.category}</div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {isEditing ? (
                          <select value={d.status} onChange={e => setEditData(p => ({ ...p, status: e.target.value }))} className="rounded-lg border border-emerald-500/20 bg-white/5 px-3 py-1.5 text-white text-xs outline-none focus:border-emerald-500/40">
                            {['online', 'idle', 'dnd', 'offline'].map(s => <option key={s} value={s} className="bg-[#0a1a12]">{s}</option>)}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[m.status] || STATUS_COLORS.offline, boxShadow: `0 0 10px ${STATUS_COLORS[m.status] || STATUS_COLORS.offline}` }} />
                            <span className="text-gray-400 text-xs font-medium capitalize">{m.status}</span>
                          </div>
                        )}
                      </td>

                      {/* Node Color */}
                      <td className="px-6 py-5">
                        {isEditing ? (
                          <div className="flex items-center gap-3">
                            <ColorPicker value={d.node_color} onChange={c => setEditData(p => ({ ...p, node_color: c }))} />
                            <span className="text-white text-xs font-mono bg-white/5 px-2 py-1 rounded">{d.node_color}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg border border-white/10" style={{ background: m.node_color || '#10b981' }} />
                            <span className="text-gray-600 text-xs font-mono">{m.node_color}</span>
                          </div>
                        )}
                      </td>

                      {/* Admin toggle */}
                      <td className="px-6 py-5">
                        {isEditing ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={d.is_admin} onChange={e => setEditData(p => ({ ...p, is_admin: e.target.checked }))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-500 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-black"></div>
                          </label>
                        ) : (
                          <span className={m.is_admin ? 'text-emerald-400' : 'text-gray-700'}>
                            <Shield size={18} fill={m.is_admin ? 'currentColor' : 'none'} className="opacity-40" />
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button onClick={saveEdit} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all disabled:opacity-50">
                              <Save size={14} /> {saving ? '...' : 'Commit'}
                            </button>
                            <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-400 text-xs font-bold hover:text-white hover:bg-white/5 transition-all">
                              <X size={14} /> Abort
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(m)} className="p-2 rounded-xl border border-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 transition-all" title="Edit Record">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => remove(m.id)} className="p-2 rounded-xl border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-all" title="Delete Record">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} onAdded={() => fetch(session)} />}
      </AnimatePresence>
    </div>
  );
}
