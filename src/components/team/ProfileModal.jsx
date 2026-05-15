'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const STATUS_META = {
  online: { color: '#22c55e', label: 'Online' },
  idle: { color: '#f59e0b', label: 'Idle' },
  dnd: { color: '#ef4444', label: 'Do Not Disturb' },
  offline: { color: '#4b5563', label: 'Offline' },
};

export default function ProfileModal({ member, onClose }) {
  if (!member) return null;
  const color = member.node_color || '#10b981';
  const status = STATUS_META[member.status] || STATUS_META.offline;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,8,6,0.9)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #0d1a12 0%, #070f09 100%)',
          border: `1px solid ${color}30`,
        }}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white/40 hover:text-white transition-colors">
          <X size={18} />
        </button>

        <div className="relative h-32 w-full overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}30 0%, transparent 100%)` }} />
          {member.avatar_url && (
            <img src={member.avatar_url} alt="" className="w-full h-full object-cover opacity-30 blur-sm scale-110" />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d1a12 0%, transparent 100%)' }} />
          
          <div className="absolute left-6 -bottom-6 w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-xl" style={{ borderColor: color }}>
            {member.avatar_url ? (
              <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ background: color, color: '#040806' }}>
                {member.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="pt-10 px-6 pb-6">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-xl font-bold text-white tracking-tight">{member.name}</h3>
            {member.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                {member.category}
              </span>
            )}
          </div>
          <p className="text-emerald-400 text-sm font-medium mb-3">{member.role}</p>
          
          {member.bio && (
            <p className="text-gray-400 text-sm leading-relaxed mb-4 border-l-2 pl-3 border-emerald-500/20">{member.bio}</p>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Status</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: status.color, boxShadow: `0 0 8px ${status.color}` }} />
                <span className="text-white text-xs font-medium">{status.label}</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Joined</div>
              <div className="text-white text-xs font-medium">
                {member.joined_at ? new Date(member.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
