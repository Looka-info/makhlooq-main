'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Rocket, Shield, LogOut, ArrowLeft } from 'lucide-react';

export function AuthScreen({ text = 'Initializing Secure Link...' }) {
  return (
    <div className="min-h-screen bg-[#020408] text-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">{text}</p>
    </div>
  );
}

export function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-[#020408] text-white flex items-center justify-center p-6"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 border border-emerald-500/15 rounded-3xl p-10 backdrop-blur-xl max-w-sm w-full text-center shadow-2xl"
      >
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <Rocket size={36} className="text-emerald-400" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500 mb-3">Fleet Command</div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
        <p className="text-gray-500 text-sm mb-8">Sign in with your Discord account to manage fleet assets.</p>
        <button
          onClick={onLogin}
          className="w-full py-4 rounded-xl bg-[#5865F2] text-white font-bold hover:bg-[#4752C4] transition-all shadow-[0_0_24px_rgba(88,101,242,0.25)] flex items-center justify-center gap-3 text-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.053a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Sign in with Discord
        </button>
        <Link href="/fleet" className="inline-flex items-center gap-2 mt-8 text-gray-600 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">
          <ArrowLeft size={12} /> Back to Fleet
        </Link>
      </motion.div>
    </div>
  );
}

export function DeniedScreen({ onLogout }) {
  return (
    <div className="min-h-screen bg-[#020408] text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="bg-red-950/20 border border-red-500/15 rounded-3xl p-10 backdrop-blur-xl max-w-sm w-full text-center shadow-2xl"
      >
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <Shield size={36} className="text-red-400" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500 mb-3">Access Denied</div>
        <h1 className="text-3xl font-bold text-white mb-2">Unauthorized</h1>
        <p className="text-gray-400 text-sm mb-8">Your account does not have administrative clearance for Fleet Command.</p>
        <button onClick={onLogout} className="w-full py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm">
          <LogOut size={16} /> Sign Out
        </button>
        <Link href="/fleet" className="inline-flex items-center gap-2 mt-6 text-gray-600 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">
          <ArrowLeft size={12} /> Back to Fleet
        </Link>
      </motion.div>
    </div>
  );
}
