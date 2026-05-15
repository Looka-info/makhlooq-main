'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function TeamMemberProfile({ params }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('discord_uid', params.username)
        .single();
      setMember(data);
      setLoading(false);
    };
    fetchMember();
  }, [params.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040806] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-[#040806] text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Member Not Found</h1>
        <Link href="/team" className="text-emerald-400 hover:underline text-sm">← Back to Team</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040806] text-white px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/team" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Team Network
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr] items-start">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
            {member.avatar_url ? (
              <img src={member.avatar_url} alt={member.name} className="h-80 w-full rounded-2xl object-cover border border-emerald-500/20" />
            ) : (
              <div className="h-80 w-full rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-7xl font-bold text-emerald-400">{member.name?.[0]}</span>
              </div>
            )}
            <div className="mt-6 space-y-3">
              <div className="text-sm uppercase tracking-[0.3em] text-emerald-400">{member.role}</div>
              <h1 className="text-4xl font-bold text-white">{member.name}</h1>
              <p className="text-sm text-gray-500 font-mono">{member.discord_tag || 'No Discord tag'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
              <h2 className="text-2xl font-semibold text-white">Bio</h2>
              <p className="mt-4 text-gray-300 leading-8">{member.bio || 'No bio available.'}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-4">Info</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Category:</span> <span className="text-white ml-2">{member.category}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className="text-white ml-2 capitalize">{member.status}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
