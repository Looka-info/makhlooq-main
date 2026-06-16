'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle, LogOut, Shield } from 'lucide-react';
import Header from '../../../src/components/Header';

// Modular Components
import ProfileEditor from '../../../src/components/team/ProfileEditor';

export default function UserProfilePage() {
  const [session, setSession]   = useState(null);
  const [member, setMember]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');
  const [uploading, setUploading] = useState(false);

  // Form state
  const [form, setForm] = useState({ node_color: '#10b981', bio: '', status: 'online' });

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      setLoading(true);
      const res = await fetch('/api/auth/discord/session', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!mounted) return;

      if (!res.ok || !data.authenticated) {
        setSession(null);
        setMember(null);
        setLoading(false);
        return;
      }

      setSession(data.user);
      if (data.member) {
        setMember(data.member);
        setForm({
          node_color: data.member.node_color || '#10b981',
          bio: data.member.bio || '',
          status: data.member.status || 'online',
        });
        setError('');
      } else {
        setMember(null);
        setError(`Tumhari Discord ID roster mein nahi mili: ${data.user?.discordId}. Admin ko ping karo, woh scene set kar dega.`);
      }

      setLoading(false);
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const loginWithDiscord = () => {
    setError('');
    window.location.href = '/api/auth/discord/login?returnTo=/team/profile';
  };

  const logout = async () => {
    await fetch('/api/auth/discord/logout', { method: 'POST' });
    setSession(null);
    setMember(null);
  };

  const save = async () => {
    if (!member) return;
    setSaved(false);
    const res = await fetch('/api/team/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ node_color: form.node_color, bio: form.bio, status: form.status }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || 'Profile save nahi hui. Ek dafa phir try karo.');
    } else {
      setMember(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch('/api/team/profile', { method: 'POST', body: formData });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) setError(data.error || 'Avatar upload ne nakhra kar diya.');
    else setMember(data);
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#040806] text-white flex flex-col selection:bg-emerald-500/30">
      <Header />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.06),transparent_60%)]" />

      <div className="relative z-10 w-full px-3 sm:px-5 2xl:px-8 pt-28 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center justify-between">
            <Link href="/team" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors text-sm font-medium group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Team pe wapas
            </Link>
            {session && (
              <button onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm transition-all font-bold uppercase tracking-widest">
                <LogOut size={16} /> Logout Scene
              </button>
            )}
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Meri Profile</h1>
            <p className="text-gray-500 text-sm">Apna avatar, bio, aur status ka scene set karo</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Profile ka signal aa raha hai...</p>
          </div>
        )}

        {/* Discord Login */}
        {!loading && !session && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-white/5 bg-[#040c08]/40 p-12 text-center max-w-md mx-auto mt-10 backdrop-blur-xl"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#5865F2]/10 flex items-center justify-center mx-auto mb-8 border border-[#5865F2]/20 shadow-[0_0_30px_rgba(88,101,242,0.1)]">
              <Shield size={40} className="text-[#5865F2]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Discord Se Entry</h2>
            <p className="text-gray-400 text-sm mb-8">Pehle Discord se aao, phir profile ki masti unlock.</p>
            <button
              onClick={loginWithDiscord}
              className="w-full py-4 rounded-xl bg-[#5865F2] text-white font-bold hover:bg-[#4752C4] transition-all shadow-[0_0_20px_rgba(88,101,242,0.2)] flex items-center justify-center gap-3"
            >
              <img src="https://assets-global.website-files.com/6257adef93467e5028da4f2d/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="" className="w-6" />
              Discord Se Sync Karo
            </button>
            {error && <p className="text-red-400 text-xs mt-6 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>}
          </motion.div>
        )}

        {/* Not Registered Error */}
        {!loading && session && !member && error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-red-500/10 bg-red-500/5 p-12 text-center max-w-md mx-auto mt-10 backdrop-blur-xl"
          >
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <Shield size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Roster Mein Naam Nahi</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">{error}</p>
            <Link href="/team" className="block w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all mb-4">
              Team Pe Wapas
            </Link>
            <button onClick={logout} className="text-gray-600 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">
              Logout
            </button>
          </motion.div>
        )}

        {/* Editor */}
        {!loading && session && member && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <ProfileEditor 
              member={member} 
              form={form} 
              setForm={setForm} 
              onUploadAvatar={uploadAvatar} 
              uploading={uploading} 
            />

            {/* Action Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
              <div className="bg-[#0a1a12]/80 border border-emerald-500/20 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Changes ready hain</span>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {saved && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 text-emerald-400 text-xs font-bold mr-2"
                      >
                        <CheckCircle size={14} /> Profile Set Ho Gayi
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={save}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <Save size={16} /> Save Karo
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
