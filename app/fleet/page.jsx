'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

import FleetShipDetails from '../../src/components/fleet/FleetShipDetails';
import FleetShipSelector from '../../src/components/fleet/FleetShipSelector';
import FleetHUD from '../../src/components/fleet/FleetHUD';
import FleetIntro from '../../src/components/fleet/FleetIntro';
import PageNavigationButtons from '../../src/components/PageNavigationButtons';

// Three.js cannot run on the server
const FleetScene = dynamic(
  () => import('../../src/components/fleet/FleetScene'),
  { ssr: false, loading: () => null }
);

/* ─────────────────── Helpers ─────────────────── */

const getShipType = (model = {}) => {
  const c = (model.classification || model.classificationLabel || '').toLowerCase();
  if (c.includes('capital') || c.includes('battleship') || c.includes('carrier') || c.includes('corvette')) return 'capital';
  if (c.includes('fighter') || c.includes('interceptor') || c.includes('gunship')) return 'fighter';
  if (c.includes('explorer') || c.includes('scout')) return 'explorer';
  if (c.includes('freighter') || c.includes('industrial') || c.includes('hauler') || c.includes('transport')) return 'industrial';
  if (c.includes('luxury') || c.includes('yacht')) return 'luxury';
  return 'medium';
};

const getAccentColor = (classification = '') => {
  const n = classification.toLowerCase();
  if (n.includes('fighter') || n.includes('interceptor')) return '#ff3366';
  if (n.includes('explore') || n.includes('scout')) return '#ffaa00';
  if (n.includes('industrial') || n.includes('freighter') || n.includes('transport')) return '#44ff88';
  if (n.includes('luxury') || n.includes('yacht')) return '#aa88ff';
  if (n.includes('capital') || n.includes('command') || n.includes('corvette')) return '#10b981';
  return '#4fc3f7';
};

const mapVehicleToShip = (vehicle) => {
  const model = vehicle.model || {};
  const media = model.media || {};
  const metrics = model.metrics || {};
  const name = model.name || vehicle.name || 'Unknown Vessel';
  const classification = model.classificationLabel || model.classification || 'Unknown';
  const manufacturer = model.manufacturer?.name || 'Unknown Manufacturer';

  return {
    id: vehicle.id || vehicle.slug || `${name}-${vehicle.serial || 'unknown'}`,
    name,
    manufacturer,
    class: classification,
    role: model.focus || classification,
    crew: model.crew?.maxLabel || (model.crew?.max ? String(model.crew.max) : 'N/A'),
    length: metrics.lengthLabel || (metrics.length ? `${metrics.length}m` : 'N/A'),
    mass: metrics.massLabel || (metrics.mass ? `${metrics.mass} kg` : 'N/A'),
    cargo: metrics.cargoLabel || (metrics.cargo ? `${metrics.cargo} SCU` : 'N/A'),
    topSpeed: model.speeds?.maxSpeed ? `${model.speeds.maxSpeed} m/s` : 'N/A',
    description: model.description || 'No description available.',
    modelPath: '',
    thumbnail:
      media.frontView?.url ||
      media.angledView?.url ||
      media.storeImage ||
      media.holo ||
      '/backgrounds/SC-3.24_20241207_170744_Hornets-Over-Lake_f.png',
    meshType: getShipType(model),
    accentColor: getAccentColor(classification),
    weapons: vehicle.activeLoadout ? 'Configured Loadout' : 'Standard Loadout',
    features: [
      model.productionStatus || 'Production status unknown',
      model.hasPaints ? 'Custom Paint Available' : null,
    ].filter(Boolean),
    specs: {
      shields: { label: 'Shield Status', value: model.hasModules ? 'Equipped' : 'Unknown', pct: model.hasModules ? 72 : 18 },
      armor: { label: 'Armor Status', value: model.hasPaints ? 'Painted' : 'Unpainted', pct: model.hasPaints ? 60 : 35 },
      firepower: { label: 'Weapons', value: vehicle.activeLoadout ? 'Configured' : 'Unknown', pct: vehicle.activeLoadout ? 55 : 20 },
      speed: { label: 'Top Speed', value: model.speeds?.maxSpeed ? `${model.speeds.maxSpeed} m/s` : 'N/A', pct: model.speeds?.maxSpeed ? Math.min(100, model.speeds.maxSpeed / 6) : 10 },
      stealth: { label: 'Stealth', value: 'Standard', pct: 35 },
    },
  };
};

/* Fallback placeholder for when API has no data */
const FALLBACK_SHIP = {
  id: 'placeholder',
  name: 'Loading Fleet…',
  manufacturer: 'Khalai Makhlooq',
  class: 'Fleet',
  role: 'Standby',
  crew: '—', length: '—', mass: '—', cargo: '—', topSpeed: '—',
  description: 'Fetching fleet data from FleetYards…',
  modelPath: '', thumbnail: '/backgrounds/SC-3.19_20230524_130313_Fleet-selfie_ILW2953_f.png',
  meshType: 'capital', accentColor: '#10b981', weapons: '—', features: [],
  specs: {
    shields: { label: 'Shields', value: '—', pct: 0 },
    armor: { label: 'Armor', value: '—', pct: 0 },
    firepower: { label: 'Firepower', value: '—', pct: 0 },
    speed: { label: 'Speed', value: '—', pct: 0 },
    stealth: { label: 'Stealth', value: '—', pct: 0 },
  },
};

/* ─────────────────── Page ─────────────────── */

export default function FleetPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Fleet configs from Supabase (admin-managed)
  const [fleetConfigs, setFleetConfigs] = useState([]);
  const [selectedFleetIdx, setSelectedFleetIdx] = useState(0);

  // Ships fetched from FleetYards for the selected fleet
  const [ships, setShips] = useState([FALLBACK_SHIP]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingShips, setLoadingShips] = useState(false);
  const [apiError, setApiError] = useState('');

  // Fleet info banner
  const [fleetInfo, setFleetInfo] = useState(null);
  const [loadingFleetInfo, setLoadingFleetInfo] = useState(false);

  /* ── Step 1: Load admin-configured fleet slugs from Supabase ── */
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const res = await fetch('/api/fleet-configs');
        const data = await res.json();
        const enabled = Array.isArray(data) ? data.filter(c => c.enabled) : [];
        setFleetConfigs(enabled);
      } catch {
        // If Supabase is unreachable, fall back to the default slug
        setFleetConfigs([{ slug: 'khalai-makhlooq', display_name: 'Khalai Makhlooq' }]);
      }
    };
    loadConfigs();
  }, []);

  /* ── Step 2: When configs load or selected fleet changes, fetch from FleetYards ── */
  const currentConfig = fleetConfigs[selectedFleetIdx] || null;

  useEffect(() => {
    if (!currentConfig) return;

    const fetchData = async () => {
      setLoadingShips(true);
      setLoadingFleetInfo(true);
      setApiError('');
      setShips([FALLBACK_SHIP]);
      setSelectedIndex(0);

      try {
        // Fetch fleet info and vehicles in parallel
        const [infoRes, vehiclesRes] = await Promise.all([
          fetch(`/api/fleetyards/fleet-info?slug=${encodeURIComponent(currentConfig.slug)}`),
          fetch(`/api/fleetyards/vehicles?slug=${encodeURIComponent(currentConfig.slug)}&perPage=100`),
        ]);

        if (infoRes.ok) {
          const infoData = await infoRes.json();
          setFleetInfo(infoData);
        }

        const vehiclesData = await vehiclesRes.json();
        if (!vehiclesRes.ok) throw new Error(vehiclesData?.error || `FleetYards error (${vehiclesRes.status})`);

        const apiShips = Array.isArray(vehiclesData) ? vehiclesData.map(mapVehicleToShip) :
          Array.isArray(vehiclesData.items) ? vehiclesData.items.map(mapVehicleToShip) : [];

        if (apiShips.length > 0) {
          setShips(apiShips);
          setSelectedIndex(0);
        } else {
          setApiError('No public vehicles found for this fleet on FleetYards.');
          setShips([FALLBACK_SHIP]);
        }
      } catch (err) {
        setApiError(err?.message || 'Failed to fetch fleet data from FleetYards.');
        setShips([FALLBACK_SHIP]);
      } finally {
        setLoadingShips(false);
        setLoadingFleetInfo(false);
      }
    };

    fetchData();
  }, [currentConfig?.slug]);

  /* ── Navigation ── */
  const goPrev = useCallback(() => {
    if (ships.length === 0) return;
    setSelectedIndex(i => (i - 1 + ships.length) % ships.length);
  }, [ships.length]);

  const goNext = useCallback(() => {
    if (ships.length === 0) return;
    setSelectedIndex(i => (i + 1) % ships.length);
  }, [ships.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  // Clamp selectedIndex if ships change
  useEffect(() => {
    if (ships.length > 0 && selectedIndex >= ships.length) setSelectedIndex(0);
  }, [ships.length, selectedIndex]);

  const selectedShip = ships[selectedIndex] || ships[0] || FALLBACK_SHIP;
  const shipCount = ships.length;

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setIsReady(true);
  }, []);

  return (
    <div className="fleet-page">
      {/* Cinematic intro */}
      <AnimatePresence>
        {showIntro && <FleetIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Header */}
      <header className="fleet-header">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest hidden sm:inline">Base</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span className="text-sm font-bold font-mono tracking-[0.15em] text-white">
            FLEET<span className="text-emerald-400">CMD</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {fleetConfigs.length > 1 && (
            <select
              value={selectedFleetIdx}
              onChange={e => { setSelectedFleetIdx(Number(e.target.value)); setFleetInfo(null); }}
              className="bg-black/50 border border-white/10 text-white text-xs font-mono rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500/40 transition-colors"
            >
              {fleetConfigs.map((cfg, i) => (
                <option key={cfg.id || cfg.slug} value={i}>{cfg.display_name || cfg.slug}</option>
              ))}
            </select>
          )}
          <span className="fleet-status-badge">Online</span>
        </div>
      </header>

      <PageNavigationButtons current="/fleet" />

      {/* Fleet info banner */}
      {loadingFleetInfo ? (
        <div className="mx-auto mb-6 max-w-4xl rounded-2xl border border-emerald-500/10 bg-black/40 p-4 backdrop-blur flex items-center gap-3 text-sm text-gray-500">
          <Loader2 size={14} className="animate-spin text-emerald-500" />
          Loading fleet data from FleetYards…
        </div>
      ) : fleetInfo ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 max-w-4xl rounded-2xl border border-emerald-500/20 bg-black/40 p-4 backdrop-blur"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-mono mb-0.5">{fleetInfo.name || currentConfig?.display_name || 'Fleet'}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">{fleetInfo.slug || currentConfig?.slug}</p>
            </div>
            <div className="flex gap-6 text-sm">
              {fleetInfo.memberCount !== undefined && (
                <div className="text-center">
                  <div className="text-emerald-400 font-bold font-mono">{fleetInfo.memberCount}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Members</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-emerald-400 font-bold font-mono">{loadingShips ? '…' : shipCount}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Vessels</div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* API error notice */}
      {apiError && !loadingShips && (
        <div className="mx-auto mb-6 max-w-4xl rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-yellow-400 text-sm font-mono">{apiError}</p>
        </div>
      )}

      {/* Main 3-column layout */}
      <div className="fleet-layout">
        {/* Left: Ship list */}
        <FleetShipSelector
          ships={ships}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          loading={loadingShips}
          apiError={apiError}
        />

        {/* Center: 3D Viewport */}
        <main className="fleet-viewport">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a1a12_0%,_#020403_100%)]" />

          <div className="absolute inset-0">
            {isReady && <FleetScene selectedShip={selectedShip} />}
          </div>

          <FleetHUD
            ship={selectedShip}
            currentIndex={selectedIndex}
            totalShips={shipCount}
            loading={loadingShips}
            onPrev={goPrev}
            onNext={goNext}
            onResetCamera={() => {}}
          />
        </main>

        {/* Right: Details panel */}
        <FleetShipDetails ship={selectedShip} />
      </div>
    </div>
  );
}
