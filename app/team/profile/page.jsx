'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle, LogOut, Shield } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import PageNavigationButtons from '../../../src/components/PageNavigationButtons';

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) lookup(session);
      else setLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) lookup(session);
      else { setMember(null); setLoading(false); }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const loginWithDiscord = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin + '/team/profile' }
    });
    if (error) setError(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const lookup = async (sess) => {
    setLoading(true);
    setError('');
    
    const dId = sess.user?.user_metadata?.provider_id || 
                sess.user?.user_metadata?.sub || 
                sess.user?.identities?.[0]?.id;
    
    if (!dId) {
      setError('Neural link failed: Discord UID extraction unsuccessful. Please re-authenticate.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('discord_uid', dId)
      .single();

    if (error || !data) {
      setError(`Roster record not found for UID: ${dId}. Please contact a Fleet Administrator for deployment.`);
      setMember(null);
    } else {
      setMember(data);
      setForm({ 
        node_color: data.node_color || '#10b981', 
        bio: data.bio || '', 
        status: data.status || 'online' 
      });
    }
    setLoading(false);
  };

  const save = async () => {
    if (!member) return;
    setSaved(false);
    const { error } = await supabase
      .from('team_members')
      .update({ node_color: form.node_color, bio: form.bio, status: form.status })
      .eq('discord_uid', member.discord_uid);

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;
    setUploading(true);
    setError('');

    const ext  = file.name.split('.').pop();
    const path = `avatars/${member.discord_uid}.${ext}`;

    const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (uploadErr) { setError(uploadErr.message); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);

    const { error: updateErr } = await supabase
      .from('team_members')
      .update({ avatar_url: publicUrl })
      .eq('discord_uid', member.discord_uid);

    if (updateErr) setError(updateErr.message);
    else setMember(prev => ({ ...prev, avatar_url: publicUrl }));
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#040806] text-white flex flex-col selection:bg-emerald-500/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.06),transparent_60%)]" />

      <div className="relative z-10 max-w-3xl mx-auto w-full px-6 pt-12 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center justify-between">
            <Link href="/team" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors text-sm font-medium group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Team Graph
            </Link>
            {session && (
              <button onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm transition-all font-bold uppercase tracking-widest">
                <LogOut size={16} /> End Session
              </button>
            )}
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Personnel Profile</h1>
            <p className="text-gray-500 text-sm">Customize your presence within the tactical network</p>
          </div>
        </div>

        <PageNavigationButtons current="/team" />

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Synchronizing Neural Link...</p>
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
            <h2 className="text-2xl font-bold text-white mb-3">Identity Verification</h2>
            <p className="text-gray-400 text-sm mb-8">Verification required to access personnel customization protocols.</p>
            <button
              onClick={loginWithDiscord}
              className="w-full py-4 rounded-xl bg-[#5865F2] text-white font-bold hover:bg-[#4752C4] transition-all shadow-[0_0_20px_rgba(88,101,242,0.2)] flex items-center justify-center gap-3"
            >
              <img src="https://assets-global.website-files.com/6257adef93467e5028da4f2d/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="" className="w-6" />
              Sync with Discord
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
            <h2 className="text-2xl font-bold text-white mb-3">Unregistered Personnel</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">{error}</p>
            <Link href="/team" className="block w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all mb-4">
              Return to Network
            </Link>
            <button onClick={logout} className="text-gray-600 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">
              Sign Out
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
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Changes Pending</span>
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
                        <CheckCircle size={14} /> Profile Synchronized
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={save}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <Save size={16} /> Update Profile
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
