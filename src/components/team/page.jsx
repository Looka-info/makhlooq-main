'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, ChevronDown, Users, Crown, Shield,
  Sword, User, X, ChevronRight, Calendar, Activity,
  Plus, Upload, Palette, Shield as ShieldIcon, LogIn,
  Terminal, Wifi, WifiOff, Clock, Zap
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { MSpaintDemo } from './MSpaintDemo';
import ProfileEditor from './ProfileEditor';

// ============================================================
// CONSTANTS
// ============================================================

const ROLES = [
  'Fleet Admiral', 'Commander', 'Admiral', 'Captain',
  'Lieutenant', 'Squadron Leader', 'Pilot', 'Engineer',
  'Medic', 'Scout', 'Comms Officer', 'Member'
];

const CATEGORIES = [
  'Command', 'Combat', 'Support', 'Exploration',
  'Communications', 'Engineering', 'General'
];

const STATUS_META = {
  online:  { color: '#00ff41', label: 'ONLINE',  dot: 'bg-[#00ff41] shadow-[0_0_8px_#00ff41] animate-pulse' },
  idle:    { color: '#f59e0b', label: 'IDLE',    dot: 'bg-amber-400' },
  dnd:     { color: '#ef4444', label: 'DND',     dot: 'bg-red-500' },
  offline: { color: '#2a3a2a', label: 'OFFLINE', dot: 'bg-[#1a3020]' },
};

const PRESET_COLORS = [
  '#10b981','#34d399','#6ee7b7','#a78bfa',
  '#f59e0b','#ef4444','#3b82f6','#ec4899',
  '#06b6d4','#84cc16','#f97316','#8b5cf6'
];

const ROLE_ORDER = {
  'Fleet Admiral':1,'Commander':2,'Admiral':3,'Captain':4,
  'Lieutenant':5,'Squadron Leader':6,'Pilot':7,'Engineer':8,
  'Medic':9,'Scout':10,'Comms Officer':11,'Member':12
};

// ============================================================
// UTILS
// ============================================================

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
};

const getRoleConfig = (role) => {
  const r = role?.toLowerCase() || '';
  if (r.includes('admiral') || r.includes('founder'))
    return { Icon: Crown,  accent: '#fbbf24', label: 'COMMAND' };
  if (r.includes('commander') || r.includes('captain'))
    return { Icon: Shield, accent: '#f87171', label: 'COMMAND' };
  if (r.includes('lead') || r.includes('lieutenant'))
    return { Icon: Sword,  accent: '#60a5fa', label: 'OFFICER' };
  return { Icon: Users, accent: '#00ff41', label: 'CREW' };
};

// ============================================================
// MEMBER CARD
// ============================================================

const MemberCard = ({ member, onClick }) => {
  const { Icon, accent } = getRoleConfig(member.role);
  const status = STATUS_META[member.status] || STATUS_META.offline;
  const initial = member.name?.[0]?.toUpperCase() || '?';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onClick(member)}
      className="group cursor-pointer relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #030f06 0%, #020d05 100%)',
        border: `1px solid #0f3a18`,
        borderRadius: '3px',
        fontFamily: "'Rajdhani', sans-serif",
        transition: 'border-color 0.2s',
      }}
      whileHover={{ borderColor: accent, transition: { duration: 0.15 } }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#00000012 3px,#00000012 4px)' }} />

      {/* Corner accents */}
      {['top-0 left-0 border-t border-l','top-0 right-0 border-t border-r',
        'bottom-0 left-0 border-b border-l','bottom-0 right-0 border-b border-r'].map((c,i) => (
        <div key={i}
          className={`absolute w-3 h-3 ${c} opacity-0 group-hover:opacity-100 transition-all duration-200`}
          style={{ borderColor: accent }} />
      ))}

      {/* Glitch bar */}
      <div className="absolute right-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: accent, animation: 'bar-flicker 0.5s steps(3) infinite' }} />

      <div className="relative p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>
          <span className="font-mono text-[8px] tracking-widest text-[#1a5a25] uppercase">
            {member.discord_uid?.slice(0,8) || '--------'}
          </span>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-xl font-bold overflow-hidden"
            style={{
              background: `${accent}15`,
              border: `1px solid ${accent}40`,
              clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
              color: accent,
            }}
          >
            {member.avatar_url
              ? <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
              : <span className="group-hover:animate-[text-glitch_0.6s_steps(1)_infinite]">{initial}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white tracking-wide truncate leading-tight group-hover:animate-[text-glitch_0.8s_steps(1)_infinite]">
              {member.name || member.discord_tag || 'UNKNOWN'}
            </h3>
            <span
              className="inline-flex items-center gap-1 mt-1 font-mono text-[9px] tracking-widest uppercase px-2 py-0.5"
              style={{
                color: accent,
                background: `${accent}12`,
                border: `1px solid ${accent}30`,
                borderRadius: '2px',
              }}
            >
              <Icon size={8} />
              {member.role || 'Member'}
            </span>
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <p className="font-mono text-[10px] text-[#2a5c35] group-hover:text-[#3a8c45] leading-relaxed mb-3
            border-l-2 border-[#0f3a18] group-hover:border-[#00ff4140] pl-2 line-clamp-2 transition-colors">
            {member.bio}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#0a2410] font-mono text-[8px] tracking-wide text-[#1a4a22] group-hover:border-[#0f5c1e]">
          <span className="uppercase text-[#2a5c35]">{member.category || 'GENERAL'}</span>
          <div className="flex items-center gap-1">
            <Clock size={8} />
            <span>{formatDate(member.joined_at)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// STATS BAR
// ============================================================

const StatsBar = ({ members }) => {
  const online  = members.filter(m => m.status === 'online').length;
  const command = members.filter(m =>
    ['commander','admiral','captain','lead'].some(r => m.role?.toLowerCase().includes(r))
  ).length;

  const stats = [
    { label: 'Personnel', value: members.length,  color: '#ffffff', Icon: Users    },
    { label: 'Active Now',    value: online,           color: '#10b981', Icon: Wifi, pulse: true },
    { label: 'Commanders',   value: command,          color: '#3b82f6', Icon: Shield   },
    { label: 'Divisions', value: CATEGORIES.length,color: '#8b5cf6', Icon: Filter   },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-white/5">
              <s.Icon size={18} className="text-white/60" />
            </div>
            {s.pulse && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />}
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">
            {s.value}
          </div>
          <div className="text-xs text-white/40 font-medium mt-1 uppercase tracking-wider">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================
// FILTER BAR
// ============================================================

const FilterBar = ({ search, setSearch, roleFilter, setRoleFilter, categoryFilter, setCategoryFilter }) => (
  <div className="grid gap-4 sm:grid-cols-[1.7fr_1fr_1fr]">
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/50 px-1">Search Personnel</label>
      <div className="relative group">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Enter name, tag or bio..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all placeholder:text-white/20"
        />
      </div>
    </div>

    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/50 px-1">Role</label>
      <select
        value={roleFilter}
        onChange={e => setRoleFilter(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none appearance-none transition-all cursor-pointer hover:bg-white/[0.08]"
      >
        <option value="" className="bg-[#0a0a0a]">All Roles</option>
        {ROLES.map(role => <option key={role} value={role} className="bg-[#0a0a0a]">{role}</option>)}
      </select>
    </div>

    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/50 px-1">Division</label>
      <select
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none appearance-none transition-all cursor-pointer hover:bg-white/[0.08]"
      >
        <option value="" className="bg-[#0a0a0a]">All Divisions</option>
        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>)}
      </select>
    </div>
  </div>
);

// ============================================================
// PROFILE MODAL
// ============================================================

const ProfileModal = ({ member, onClose }) => {
  if (!member) return null;
  const { Icon, accent } = getRoleConfig(member.role);
  const status = STATUS_META[member.status] || STATUS_META.offline;
  const initial = member.name?.[0]?.toUpperCase() || '?';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ background: 'rgba(1, 8, 3, 0.9)' }}
    >
      <motion.div
        className="relative w-full max-w-lg overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #020f05 0%, #010c04 100%)',
          border: `1px solid ${accent}40`,
          borderRadius: '4px',
          fontFamily: "'Rajdhani', sans-serif",
          boxShadow: `0 0 60px ${accent}10`,
        }}
        initial={{ scale: 0.92, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 24, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* HUD Header */}
        <div className="flex items-center justify-between px-4 h-9 border-b" style={{ borderColor: `${accent}25`, background: `${accent}08` }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-sm animate-pulse" style={{ background: accent }} />
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: accent }}>
              CITIZEN_DOSSIER // ACCESS_GRANTED
            </span>
          </div>
          <button onClick={onClose} className="transition-colors p-1" style={{ color: accent }}>
            <X size={14} />
          </button>
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,#00000018 3px,#00000018 4px)' }} />

        {/* Corner brackets */}
        {['top-2 left-2 border-t border-l','top-2 right-2 border-t border-r',
          'bottom-2 left-2 border-b border-l','bottom-2 right-2 border-b border-r'].map((c,i) => (
          <div key={i} className={`absolute w-4 h-4 ${c} pointer-events-none`}
            style={{ borderColor: `${accent}50` }} />
        ))}

        <div className="relative px-6 pt-5 pb-6">
          {/* Top section */}
          <div className="flex gap-5 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="w-24 h-24 flex items-center justify-center text-4xl font-bold overflow-hidden"
                style={{
                  background: `${accent}10`,
                  border: `2px solid ${accent}60`,
                  clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
                  color: accent,
                }}
              >
                {member.avatar_url
                  ? <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                  : <span className="animate-[text-glitch_1.5s_steps(1)_infinite]">{initial}</span>
                }
              </div>
              {/* Status pill */}
              <div className="mt-2 flex items-center justify-center gap-1.5 py-1 border font-mono text-[8px] tracking-widest uppercase"
                style={{ borderColor: `${accent}25`, background: `${accent}08`, color: accent }}>
                <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </div>
            </div>

            {/* Name block */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white tracking-tight leading-none mb-2">
                {member.name || 'UNKNOWN_SUBJECT'}
              </h2>
              <div
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-2 py-1 mb-3"
                style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}30`, borderRadius:'2px' }}
              >
                <Icon size={10} />{member.role || 'MEMBER'}
              </div>
              {/* Meta fields */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: 'DIVISION', val: member.category || 'GENERAL' },
                  { label: 'DEPLOYED', val: formatDate(member.joined_at) },
                  { label: 'SEC_LEVEL', val: member.is_admin ? 'ALPHA' : 'SIGMA' },
                  { label: 'UID', val: member.discord_uid?.slice(0,10) || '0x??????' },
                ].map(f => (
                  <div key={f.label} className="border-l-2 pl-2" style={{ borderColor: `${accent}30` }}>
                    <div className="font-mono text-[7px] tracking-[0.2em] text-[#2a5c35] uppercase mb-0.5">{f.label}</div>
                    <div className="font-mono text-[10px] text-white uppercase tracking-wide truncate">{f.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="border-t pt-4" style={{ borderColor: `${accent}15` }}>
            <div className="font-mono text-[8px] tracking-[0.2em] text-[#2a5c35] uppercase mb-2">SUBJECT_BIO //</div>
            <p className="font-mono text-[11px] leading-relaxed" style={{ color: `${accent}90` }}>
              {member.bio || 'NO BIO DATA FOUND IN SECURE DATABASE.'}
            </p>
          </div>
        </div>

        {/* Footer shimmer */}
        <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// JOIN CTA
// ============================================================

const JoinCommunityCTA = () => (
  <section className="relative mt-20 overflow-hidden">
    <div
      className="relative p-12 text-center overflow-hidden bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-xl"
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
          Recruitment Open
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl">
          Join the <span className="text-white/40 font-light italic">Khalai Makhlooq</span> Strategic Fleet
        </h2>
        <p className="text-white/40 text-sm max-w-lg font-medium leading-relaxed">
          Become part of the most advanced tactical fleet in the verse.
          Connect, operate, and climb the ranks in a professional environment.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <a
            href="https://discord.gg/K7SfxPSwXk" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-2xl hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            Join Discord <ChevronRight size={16} />
          </a>
          <button
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-sm tracking-widest uppercase rounded-2xl hover:bg-white/10 transition-all active:scale-95"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  </section>
);

// ============================================================
// ADD MEMBER MODAL
// ============================================================

const AddMemberModal = ({ onClose, onAdded }) => {
  const blank = {
    discord_uid:'', discord_tag:'', name:'', role:'Member',
    category:'General', node_color:'#10b981', bio:'', status:'offline', is_admin:false, avatar_url:''
  };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const save = async () => {
    if (!form.discord_uid || !form.name) { setError('Discord UID and name are required.'); return; }
    setSaving(true);
    const { error } = await supabase.from('team_members').insert(form);
    if (error) { setError(error.message); setSaving(false); return; }
    onAdded(); onClose();
  };

  const inputCls = "w-full px-4 py-3 text-sm text-emerald-400 placeholder:text-emerald-900 focus:outline-none transition-all";
  const inputStyle = { background:'#020d05', border:'1px solid #0f3a18', borderRadius:'12px', fontFamily:"'Share Tech Mono', monospace" };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ background: 'rgba(2,13,5,0.95)' }}
    >
      <motion.div
        className="w-full max-w-md overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        style={{ background:'#020d05', border:'1px solid #0f5c1e', borderRadius:'24px' }}
        initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-emerald-500 uppercase font-bold">Deploy New Personnel</span>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors p-1"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {[
            { label:'DISCORD_UID *', key:'discord_uid', type:'text', placeholder: 'e.g. 309682434507800578' },
            { label:'DISCORD_TAG',   key:'discord_tag', type:'text', placeholder: 'e.g. Commander#0001' },
            { label:'DISPLAY_NAME *',key:'name',        type:'text', placeholder: 'e.g. John Doe' },
            { label:'AVATAR_URL',    key:'avatar_url',  type:'url',  placeholder: 'https://...'  },
          ].map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="block font-mono text-[9px] tracking-[0.2em] text-emerald-500/50 uppercase font-bold px-1">{f.label}</label>
              <input type={f.type} value={form[f.key]}
                placeholder={f.placeholder}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className={inputCls} style={inputStyle}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            {[
              { label:'ROLE', key:'role', opts:ROLES },
              { label:'DIVISION', key:'category', opts:CATEGORIES },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className="block font-mono text-[9px] tracking-[0.2em] text-emerald-500/50 uppercase font-bold px-1">{f.label}</label>
                <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className={inputCls} style={{ ...inputStyle, color:'#10b981' }}>
                  {f.opts.map(o => <option key={o} value={o} className="bg-[#020d05]">{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-[9px] tracking-[0.2em] text-emerald-500/50 uppercase font-bold px-1">TACTICAL BIO</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              placeholder="Enter subject background data..."
              className={inputCls + ' resize-none h-24'} style={inputStyle} />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-[9px] tracking-[0.2em] text-emerald-500/50 uppercase font-bold px-1">SIGNATURE COLOR</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => setForm(p => ({ ...p, node_color:c }))}
                  className="aspect-square rounded-lg border-2 transition-all hover:scale-110 active:scale-95"
                  style={{ background:c, borderColor: form.node_color===c ? 'white' : 'transparent', boxShadow: form.node_color===c ? `0 0 15px ${c}40` : 'none' }} />
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer py-3 px-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group">
            <input type="checkbox" checked={form.is_admin}
              onChange={e => setForm(p => ({ ...p, is_admin: e.target.checked }))}
              className="w-4 h-4 rounded border-white/10 bg-black accent-emerald-500" />
            <span className="font-mono text-[10px] tracking-widest text-emerald-500/60 uppercase font-bold group-hover:text-emerald-400 transition-colors">Grant Command Clearance (Admin)</span>
          </label>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="font-mono text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}

          <button onClick={save} disabled={saving}
            className="w-full py-4 font-bold text-sm tracking-[0.2em] uppercase transition-all disabled:opacity-50 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            style={{ background:'#10b981', color:'#010f04', borderRadius:'14px', marginTop:'8px' }}>
            {saving ? 'SYNCHRONIZING…' : 'INITIALIZE DEPLOYMENT'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// EDIT PROFILE MODAL
// ============================================================

const EditProfileModal = ({ member, onClose, onUpdated }) => {
  const [form, setForm] = useState({ ...member });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...updateData } = form;
    const { error } = await supabase.from('team_members').update(updateData).eq('id', member.id);
    if (error) { setError(error.message); setSaving(false); return; }
    onUpdated(); onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ background: 'rgba(2,13,5,0.95)' }}
    >
      <motion.div
        className="w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        style={{ background:'#020d05', border:'1px solid #0f5c1e', borderRadius:'24px' }}
        initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-emerald-500" />
            <span className="font-mono text-xs tracking-[0.3em] text-emerald-500 uppercase font-bold">Edit Personnel Dossier</span>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors p-1"><X size={20} /></button>
        </div>

        <div className="p-8">
          <ProfileEditor 
            member={member} 
            form={form} 
            setForm={setForm} 
            onUploadAvatar={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              // Add avatar upload logic here if needed
              // For now we'll just alert that storage needs setup
              alert("Storage bucket 'avatars' needs to be created in Supabase for uploads to work.");
            }} 
            uploading={false} 
          />
          
          <div className="mt-8 flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button onClick={save} disabled={saving}
              className="flex-[2] py-4 bg-emerald-500 text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:opacity-50">
              {saving ? 'UPDATING DOSSIER…' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function FleetDirectoryPage() {
  const [members, setMembers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [roleFilter, setRoleFilter]     = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [session, setSession]             = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('team_members').select('*').order('role', { ascending:true });
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUserLogin = useCallback(async (user) => {
    const dId = user.user_metadata?.provider_id || user.user_metadata?.sub || user.id;
    const { data: existing } = await supabase.from('team_members').select('*').eq('discord_uid', dId).single();
    
    if (!existing) {
      // Create profile for new authenticated user
      await supabase.from('team_members').insert({
        discord_uid: dId,
        discord_tag: user.user_metadata?.custom_claims?.global_name || user.user_metadata?.full_name || user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'New Member',
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        role: 'Member',
        status: 'online',
        joined_at: new Date().toISOString()
      });
      fetchMembers();
    } else if (existing.status !== 'online') {
      // Mark as online
      await supabase.from('team_members').update({ status: 'online' }).eq('discord_uid', dId);
      fetchMembers();
    }
  }, [fetchMembers]);

  useEffect(() => {
    fetchMembers();

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) handleUserLogin(s.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) handleUserLogin(s.user);
    });

    const sub = supabase.channel('team_members_changes')
      .on('postgres_changes', { event:'*', schema:'public', table:'team_members' }, fetchMembers)
      .subscribe();

    return () => {
      subscription.unsubscribe();
      sub.unsubscribe();
    };
  }, [fetchMembers, handleUserLogin]);

  const loginWithDiscord = () => {
    supabase.auth.signInWithOAuth({ 
      provider: 'discord', 
      options: { redirectTo: window.location.origin + '/team' } 
    });
  };

  const logout = () => supabase.auth.signOut();

  const currentUserMember = useMemo(() => {
    if (!session?.user) return null;
    const dId = session.user.user_metadata?.provider_id || session.user.user_metadata?.sub || session.user.id;
    return members.find(m => m.discord_uid === dId);
  }, [session, members]);

  const isAdmin = currentUserMember?.is_admin || false;

  const filteredMembers = useMemo(() => {
    let f = [...members];
    if (search) {
      const q = search.toLowerCase();
      f = f.filter(m => m.name?.toLowerCase().includes(q) || m.discord_tag?.toLowerCase().includes(q) || m.bio?.toLowerCase().includes(q));
    }
    if (roleFilter) f = f.filter(m => m.role === roleFilter);
    if (categoryFilter) f = f.filter(m => m.category === categoryFilter);
    f.sort((a,b) => {
      const oa = ROLE_ORDER[a.role] || 99, ob = ROLE_ORDER[b.role] || 99;
      return oa !== ob ? oa - ob : (a.name||'').localeCompare(b.name||'');
    });
    return f;
  }, [members, search, roleFilter, categoryFilter]);

  const onlineCount = members.filter(m => m.status === 'online').length;

  return (
    <div className="min-h-screen text-white bg-[#0a0a0a] selection:bg-emerald-500/30" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* ── HEADER ── */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                Fleet Management System v2.0
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                Team <span className="text-white/20">Directory</span>
              </h1>
              <div className="flex items-center gap-4 text-xs font-medium text-white/40 uppercase tracking-widest">
                <span>{members.length} Total Personnel</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-emerald-400">{onlineCount} Currently Active</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {session ? (
                <>
                  {currentUserMember && (
                    <button onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white/10 transition-all active:scale-95">
                      <User size={14} /> My Profile
                    </button>
                  )}
                  {isAdmin && (
                    <button onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-black font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <Plus size={14} /> Deploy Member
                    </button>
                  )}
                  <button onClick={logout}
                    className="flex items-center gap-2 px-5 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-red-500/20 transition-all active:scale-95">
                    <LogOut size={14} /> Exit
                  </button>
                </>
              ) : (
                <button onClick={loginWithDiscord}
                  className="flex items-center gap-3 px-6 py-3 bg-[#5865F2] text-white font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-[#4752C4] transition-all active:scale-95 shadow-[0_0_20px_rgba(88,101,242,0.3)]">
                  <LogIn size={16} /> Sign in with Discord
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatsBar members={members} />

        {/* Filters */}
        <div className="mt-10 mb-8">
          <FilterBar
            search={search} setSearch={setSearch}
            roleFilter={roleFilter} setRoleFilter={setRoleFilter}
            categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
          />
        </div>

        {/* Grid Area */}
        <div className="mt-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-white/5 rounded-2xl animate-spin" />
                <div className="absolute inset-2 border-2 border-emerald-500/30 rounded-xl animate-spin" style={{ animationDirection:'reverse', animationDuration:'0.8s' }} />
                <Activity size={20} className="absolute inset-0 m-auto text-emerald-500" />
              </div>
              <span className="text-xs font-bold tracking-[0.4em] text-white/20 uppercase animate-pulse">
                Synchronizing Database
              </span>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white/[0.02] border border-white/5 rounded-3xl">
              <div className="p-5 rounded-full bg-white/5">
                <WifiOff size={40} className="text-white/20" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white/60 uppercase tracking-widest">No Personnel Found</p>
                <p className="text-xs text-white/20 uppercase tracking-[0.2em] mt-1">Adjust search or filter parameters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredMembers.map(member => (
                  <MemberCard key={member.id} member={member} onClick={setSelectedMember} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer Area */}
        {!loading && filteredMembers.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
            <span>{filteredMembers.length} Registered Personnel</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{filteredMembers.filter(m => m.status==='online').length} Online</span>
              </div>
            </div>
          </div>
        )}

        {/* Paint Board Area */}
        <div className="mt-20">
          <MSpaintDemo />
        </div>

        {/* Recruitment CTA */}
        <div className="mt-24">
          <JoinCommunityCTA />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedMember && <ProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAddModal && (
          <AddMemberModal onClose={() => setShowAddModal(false)} onAdded={fetchMembers} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEditModal && currentUserMember && (
          <EditProfileModal 
            member={currentUserMember} 
            onClose={() => setShowEditModal(false)} 
            onUpdated={fetchMembers} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
