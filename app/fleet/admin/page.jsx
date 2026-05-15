'use client';
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, LogOut } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// Modular Components
import { AuthScreen, LoginScreen, DeniedScreen } from '../../../src/components/fleet/admin/FleetAdminAuth';
import FleetAdminStats from '../../../src/components/fleet/admin/FleetAdminStats';
import FleetAdminTable from '../../../src/components/fleet/admin/FleetAdminTable';
import FleetAdminAddModal from '../../../src/components/fleet/admin/FleetAdminAddModal';

export default function FleetAdminPage() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // TEMPORARY BYPASS: Set authed to true and authing to false
  const [session, setSession] = useState({ user: { id: 'local-dev' } });
  const [authed, setAuthed] = useState(true);
  const [authing, setAuthing] = useState(false);
  
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchShips = async () => {
    setLoading(true);
    const { data } = await supabase.from('fleet_ships').select('*').order('created_at');
    setShips(data || []);
    setLoading(false);
  };

  const checkAuth = async (s) => {
    // Auth check logic retained for when you want to re-enable it
    if (!s) { setAuthing(false); return; }
    const dId = s.user?.user_metadata?.provider_id || s.user?.user_metadata?.sub || s.user?.identities?.[0]?.id;
    if (dId) {
      const { data } = await supabase.from('team_members').select('is_admin').eq('discord_uid', dId).single();
      if (data?.is_admin) { 
        setAuthed(true); 
        await fetchShips(); 
      }
    }
    setAuthing(false);
  };

  useEffect(() => {
    // TEMPORARY BYPASS: Fetch ships immediately without auth check
    fetchShips();

    /* Commented out auth listener for now
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      checkAuth(s);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) checkAuth(s); else { setAuthed(false); setShips([]); }
    });
    
    return () => subscription.unsubscribe();
    */
  }, []);

  const loginWithDiscord = () => {
    supabase.auth.signInWithOAuth({ 
      provider: 'discord', 
      options: { redirectTo: window.location.origin + '/fleet/admin' } 
    });
  };
  
  const logout = () => supabase.auth.signOut();

  const handleSaveShip = async (id, updatedData) => {
    const { id: _, created_at, ...rest } = updatedData;
    await supabase.from('fleet_ships').update(rest).eq('id', id);
    await fetchShips();
  };

  const handleDeleteShip = async (id) => {
    await supabase.from('fleet_ships').delete().eq('id', id);
    await fetchShips();
  };

  const handleAddShip = async (form) => {
    const { error } = await supabase.from('fleet_ships').insert(form);
    if (error) return error.message;
    await fetchShips();
    return null;
  };

  const filtered = filter
    ? ships.filter(s => [s.name, s.manufacturer, s.role, s.ship_class]
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase()))
    : ships;

  // --- Render Auth Screens ---
  if (authing) return <AuthScreen />;
  if (!session) return <LoginScreen onLogin={loginWithDiscord} />;
  if (!authed) return <DeniedScreen onLogout={logout} />;

  // --- Main Admin Dashboard ---
  return (
    <div className="min-h-screen bg-[#040806] text-white selection:bg-emerald-500/30">
      {/* Background Effect */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(74,109,86,0.08),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-24">
        
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/fleet" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors text-xs uppercase tracking-widest font-bold group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Fleet View
          </Link>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-gray-400 text-xs font-bold hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10 transition-all">
            <LogOut size={14} /> End Session
          </button>
        </div>

        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Secure Link Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Fleet Registry</h1>
            <p className="text-gray-500 text-sm">Manage ships, assign 3D models, and configure HUD properties.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
                placeholder="Search fleet…"
                className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-emerald-500/40 w-48 transition-all focus:w-64" 
              />
            </div>
            <button 
              onClick={() => setShowAdd(true)} 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              <Plus size={16} /> Register Ship
            </button>
          </div>
        </div>

        {/* Modular Stats Component */}
        <FleetAdminStats ships={ships} filtered={filtered} />

        {/* Modular Table Component */}
        <FleetAdminTable 
          ships={filtered} 
          loading={loading} 
          onSave={handleSaveShip} 
          onDelete={handleDeleteShip} 
        />
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <FleetAdminAddModal 
            onClose={() => setShowAdd(false)} 
            onAdd={handleAddShip} 
          />
        )}
      </AnimatePresence>
      
    </div>
  );
}
