'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, Loader2 } from 'lucide-react';

import Header from '../../src/components/Header';
import FleetScene from '../../src/components/fleet/FleetScene';
import FleetShipDetails from '../../src/components/fleet/FleetShipDetails';
import FleetShipSelector from '../../src/components/fleet/FleetShipSelector';

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
  if (n.includes('fighter') || n.includes('interceptor')) return '#a3e635';
  if (n.includes('explore') || n.includes('scout')) return '#22c55e';
  if (n.includes('industrial') || n.includes('freighter') || n.includes('transport')) return '#65a30d';
  if (n.includes('luxury') || n.includes('yacht')) return '#84cc16';
  if (n.includes('capital') || n.includes('command') || n.includes('corvette')) return '#d9f99d';
  return '#4ade80';
};

const mapVehicleToShip = (vehicle) => {
  const model = vehicle.model || vehicle || {};
  const media = model.media || {};
  const metrics = model.metrics || {};
  const name = vehicle.name || model.name || 'Unknown Vessel';
  const classification = model.classificationLabel || model.classification || 'Unknown';

  const normalizeAssetUrl = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.replace(/(\.(?:gltf|glb))\/?$/i, '$1').trim();
  };

  return {
    id: vehicle.id || vehicle.slug || `${name}-${vehicle.serial || 'unknown'}`,
    slug: model.slug || vehicle.modelSlug || vehicle.model_slug || vehicle.slug || '',
    name,
    manufacturer: model.manufacturer?.name || 'Unknown Manufacturer',
    class: classification,
    role: model.focus || classification,
    crew: model.crew?.maxLabel || (model.crew?.max ? String(model.crew.max) : 'N/A'),
    length: metrics.lengthLabel || (metrics.length ? `${metrics.length}m` : 'N/A'),
    mass: metrics.massLabel || (metrics.mass ? `${metrics.mass} kg` : 'N/A'),
    cargo: metrics.cargoLabel || (metrics.cargo ? `${metrics.cargo} SCU` : 'N/A'),
    topSpeed: model.speeds?.maxSpeed ? `${model.speeds.maxSpeed} m/s` : 'N/A',
    price: model.price,
    pledgePrice: model.pledgePrice,
    priceLabel: model.priceLabel,
    pledgePriceLabel: model.pledgePriceLabel,
    description: model.description || 'No description available.',
    modelPath: normalizeAssetUrl(media.holo?.url || ''),
    holoUrl: normalizeAssetUrl(media.holo?.url || ''),
    thumbnail:
      media.storeImage?.mediumUrl ||
      media.storeImage?.url ||
      media.angledViewColored?.mediumUrl ||
      media.angledView?.mediumUrl ||
      media.frontViewColored?.mediumUrl ||
      media.frontView?.mediumUrl ||
      media.fleetchartImage ||
      '',
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

const getModelSlug = (item = {}) => {
  const model = item.model && typeof item.model === 'object' ? item.model : item;
  return (
    model?.slug ||
    item?.slug ||
    item?.model_slug ||
    item?.modelSlug ||
    ''
  );
};

const getModelName = (item = {}) => {
  const model = item.model && typeof item.model === 'object' ? item.model : item;
  return model?.name || item?.name || 'Unknown Vessel';
};

const dedupeItems = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = getModelSlug(item) || item.id || `${getModelName(item)}-${item.serial || ''}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const formatCurrency = (value) => {
  if (!Number.isFinite(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

const getShipPrice = (ship) => {
  const raw = ship?.pledgePrice ?? ship?.price ?? ship?.pledgePriceLabel ?? ship?.priceLabel ?? 0;
  const number = Number(String(raw).replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) ? number : 0;
};

const getShipValue = (ship) => getShipPrice(ship.model || ship);

function MiniBlocks({ count = 0, color = '#9AD84A', max = 40 }) {
  const blocks = Array.from({ length: Math.max(0, Math.min(max, Number(count) || 0)) });

  return (
    <div className="flex max-w-[92px] flex-wrap gap-[3px]">
      {blocks.map((_, index) => (
        <span key={index} className="h-2 w-2 rounded-[1px]" style={{ background: color }} />
      ))}
    </div>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  let cursor = 0;
  const gradientStops = segments.map((segment) => {
    const start = cursor;
    const end = cursor + (segment.value / total) * 360;
    cursor = end;
    return `${segment.color} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.05)]"
        style={{ background: `conic-gradient(${gradientStops}, rgba(255,255,255,0.04) ${cursor}deg 360deg)` }}
      />
      <div className="absolute inset-[34px] rounded-full bg-[#202020] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]" />
      <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent_49.5%,rgba(255,255,255,0.07)_50%,transparent_50.5%),linear-gradient(30deg,transparent_49.5%,rgba(255,255,255,0.05)_50%,transparent_50.5%),linear-gradient(150deg,transparent_49.5%,rgba(255,255,255,0.05)_50%,transparent_50.5%)]" />
      <div className="relative text-center">
        <div className="text-3xl font-semibold text-white">{formatNumber(total)}</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">Fleet Size</div>
      </div>
    </div>
  );
}

function FleetValueChart({ ships, totalValue }) {
  const shipValues = ships
    .map(getShipValue)
    .filter((value) => value > 0)
    .sort((a, b) => b - a);
  const cumulativeValues = shipValues.reduce((values, value) => {
    values.push((values.at(-1) || 0) + value);
    return values;
  }, []);
  const rawValues = cumulativeValues.length > 1 ? cumulativeValues : [0, totalValue || 0];
  const maximum = Math.max(...rawValues, 1);
  const values = rawValues.map((value) => value / maximum);
  const width = 360;
  const height = 210;
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - value * height;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,${height} ${points} ${width},${height}`;
  const markerIndex = Math.max(0, Math.floor((values.length - 1) * 0.6));
  const markerX = values.length > 1 ? (markerIndex / (values.length - 1)) * 100 : 0;
  const markerY = 100 - values[markerIndex] * 100;
  const tooltipValue = rawValues[markerIndex] || totalValue;

  return (
    <div className="relative h-[250px] overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-x-0 bottom-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fleet-value-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>
        {values.map((_, index) => (
          <line
            key={index}
            x1={(index / (values.length - 1)) * width}
            x2={(index / (values.length - 1)) * width}
            y1="0"
            y2={height}
            stroke="rgba(255,255,255,0.10)"
            strokeDasharray="4 4"
          />
        ))}
        <polygon points={area} fill="url(#fleet-value-fill)" />
        <polyline points={points} fill="none" stroke="#ffffff" strokeWidth="2" />
      </svg>
      <div
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white/60 shadow-[0_0_20px_rgba(255,255,255,0.7)]"
        style={{ left: `${markerX}%`, top: `${markerY}%` }}
      />
      <div className="absolute right-3 top-5 rounded-md bg-[#9AD84A] px-3 py-2 text-[9px] font-semibold text-[#1b1b1b] shadow-xl">
        <div>{formatNumber(markerIndex + 1)} ships loaded</div>
        <div className="mt-1">Cumulative value:</div>
        <div>{formatCurrency(tooltipValue)}</div>
      </div>
    </div>
  );
}

function FleetDashboard({ ships, selectedShip, totalShips, totalMembers, totalMaxCrew, totalValue, segments }) {
  const crew = Number(totalMaxCrew) || 0;
  const members = Number(totalMembers) || 0;
  const topSegments = segments.slice(0, 3);
  const segmentTotal = topSegments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  return (
    <section className="fleet-dashboard-grid">
      <div className="fleet-dashboard-card overflow-hidden">
        <div className="p-5">
          <h2 className="text-sm font-semibold text-white">Fleet stats</h2>
          <div className="relative mt-4 h-44 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="absolute inset-x-8 bottom-0 h-16 rounded-full bg-white/10 blur-2xl" />
            {selectedShip?.thumbnail ? (
              <img
                src={selectedShip.thumbnail}
                alt={selectedShip?.name || 'Selected fleet ship'}
                className="relative z-10 h-full w-full object-cover drop-shadow-[0_25px_25px_rgba(0,0,0,0.45)]"
              />
            ) : (
              <div className="relative z-10 flex h-full w-full items-center justify-center text-center text-xs uppercase tracking-[0.3em] text-white/35">
                No public image
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-white/10">
          {[
            { label: 'Fleet value', value: formatCurrency(totalValue) },
            { label: 'Crew cap', value: formatNumber(crew) },
            { label: 'Fleets', value: formatNumber(members) },
          ].map((item, index) => (
            <div key={item.label} className={`p-4 ${index > 0 ? 'border-l border-white/10' : ''}`}>
              <div className="text-[10px] text-white/60">{item.label}</div>
              <div className="mt-3 text-2xl font-medium tracking-tight text-white">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="rounded-b-[18px] border-t border-white/10 bg-[#111111] p-5 text-white">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">Status Overview</h3>
            <button className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">Live</button>
          </div>
          <div className="flex h-5 overflow-hidden rounded-md bg-white/5">
            {topSegments.map((segment) => (
              <div
                key={segment.label}
                style={{
                  background: segment.color,
                  width: `${(segment.value / segmentTotal) * 100}%`,
                }}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-5 text-[10px] text-white/45">
            {topSegments.map((segment) => (
              <span key={segment.label} className="inline-flex items-center gap-2">
                <i className="h-2 w-2 rounded-sm" style={{ background: segment.color }} />
                {segment.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="fleet-dashboard-card overflow-hidden">
        <div className="p-5">
          <h2 className="text-sm font-semibold text-white">Fleet Size</h2>
          <DonutChart segments={segments} />
        </div>
        <div className="rounded-b-[18px] border-t border-white/10 bg-[#111111] p-5 text-white">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {topSegments.map((segment) => (
              <div key={segment.label} className="flex items-start gap-3">
                <MiniBlocks count={segment.value} color={segment.color} />
                <div>
                  <div className="text-sm font-semibold">{formatNumber(segment.value)}</div>
                  <div className="text-[10px] text-white/45">{segment.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fleet-dashboard-card p-5">
        <div className="flex items-start justify-between">
          <h2 className="text-sm font-semibold text-white">Fleet Valuation</h2>
          <button className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/70">
            <CalendarDays size={14} />
          </button>
        </div>
        <div className="mt-5 text-4xl font-light tracking-tight text-white">
          {formatCurrency(totalValue)}
        </div>
        <div className="mt-3 text-xs text-white/55">
          Based on current public ship prices
        </div>
        <FleetValueChart ships={ships} totalValue={totalValue} />
      </div>
    </section>
  );
}

function FleetCommandBriefing({ ships, selectedShip, totalValue, totalMaxCrew }) {
  const rows = [
    {
      label: 'Hangar',
      metric: ships.length,
      title: 'Full Fleet Lineup',
      body: 'All KMHQ heavy metal is lined up here with style. Click on any ship you like to switch the scene.',
    },
    {
      label: 'Vibe',
      metric: selectedShip?.holoUrl ? '3D Ready' : 'Chill View',
      title: 'Showroom mood',
      body: 'Sometimes a full 3D flex, sometimes a clean cinematic card. Either way, the ship scene stays tight.',
    },
    {
      label: 'Pick',
      metric: selectedShip?.name || 'Standby',
      title: 'Choose your ride',
      body: selectedShip?.name
        ? `${selectedShip.name} is now in the spotlight. Click another ride to give it the stage.`
        : 'Select a ship and the hangar focus will instantly shift to it.',
    },
  ];

  return (
    <section className="relative mt-8 overflow-hidden rounded-[2.5rem] border border-lime-300/10 bg-white/[0.025] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(163,230,53,0.14),transparent_32%),radial-gradient(circle_at_90%_0%,rgba(34,197,94,0.10),transparent_28%),linear-gradient(120deg,rgba(255,255,255,0.04),transparent_48%)]" />
      <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-mono text-sm font-black uppercase tracking-[0.36em] text-lime-300/60">Hangar Mood</p>
          <h2 className="mt-5 text-[18vw] font-black uppercase leading-[0.78] tracking-[-0.1em] text-transparent [-webkit-text-stroke:1px_rgba(217,249,157,0.28)] md:text-[9rem] lg:text-[10rem]">
            Big
            <span className="block text-white [-webkit-text-stroke:0]">Toys</span>
          </h2>
          <p className="mt-7 max-w-xl text-xl leading-relaxed text-white/52">
            A little flex, a little command, a little cinematic showroom. The KMHQ fleet scene is simple: pick a ship, enjoy the view.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-lime-300/10 bg-black/35 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.28em] text-lime-300/45">Value</div>
              <div className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">{formatCurrency(totalValue)}</div>
            </div>
            <div className="rounded-3xl border border-lime-300/10 bg-black/35 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.28em] text-lime-300/45">Crew Cap</div>
              <div className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">{formatNumber(totalMaxCrew)}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {rows.map((item, index) => (
            <motion.div
              key={item.label}
              className="group overflow-hidden rounded-[1.6rem] border border-lime-300/10 bg-black/35 p-5 text-left transition-colors hover:border-lime-300/35 hover:bg-lime-300/[0.04]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ x: 6 }}
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="font-mono text-xs font-black uppercase tracking-[0.3em] text-lime-300/45">{item.label}</div>
                  <div className="mt-3 text-2xl font-black tracking-[-0.05em] text-white md:text-3xl">{item.title}</div>
                </div>
                <div className="max-w-[180px] truncate rounded-2xl border border-lime-300/15 bg-lime-300/10 px-4 py-3 text-right font-mono text-sm font-black uppercase tracking-[0.16em] text-lime-200">
                  {item.metric}
                </div>
              </div>
              <p className="mt-5 text-lg leading-relaxed text-white/52">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FleetPage() {
  const [ships, setShips] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedShipDetails, setSelectedShipDetails] = useState(null);
  const [loadingSelectedShip, setLoadingSelectedShip] = useState(false);
  const [loadingShips, setLoadingShips] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoadingShips(true);
      setApiError('');

      try {
        const configsRes = await fetch('/api/fleet-configs');
        const configsData = await configsRes.json();
        if (!configsRes.ok) throw new Error(configsData?.error || `Fleet config error (${configsRes.status})`);

        const configs = Array.isArray(configsData) ? configsData : [];
        const activeConfigs = configs.filter(cfg => cfg.enabled !== false);
        const sourceConfigs = activeConfigs.length > 0 ? activeConfigs : configs;

        if (sourceConfigs.length === 0) {
          const modelsRes = await fetch('/api/fleetyards/models?all=1&perPage=200');
          const modelsData = await modelsRes.json();
          if (!modelsRes.ok) throw new Error(modelsData?.error || `FleetYards models error (${modelsRes.status})`);

          const modelItems = Array.isArray(modelsData?.items) ? modelsData.items : [];
          const modelShips = modelItems
            .filter(model => model?.slug && model?.name)
            .map((model) => {
              return {
                ...mapVehicleToShip(model),
                fleetSlug: '',
                sourceFleet: 'FleetYards public catalog',
              };
            });

          if (!cancelled) {
            setShips(modelShips);
          }
          return;
        }

        const fleetResults = await Promise.all(
          sourceConfigs.map(async (cfg) => {
            const fleetRes = await fetch(`/api/fleetyards/vehicles?slug=${encodeURIComponent(cfg.slug)}&all=1&perPage=200`);
            const fleetData = await fleetRes.json().catch(() => ({}));

            if (fleetRes.ok) {
              const items = Array.isArray(fleetData?.items) ? fleetData.items : [];
              return items.map((item) => ({ ...item, __fleetSlug: cfg.slug, __fleetName: cfg.display_name || cfg.slug, __sourceType: 'fleet' }));
            }

            const modelRes = await fetch(`/api/fleetyards/models?slugs=${encodeURIComponent(cfg.slug)}&fresh=1`, { cache: 'no-store' });
            const modelData = await modelRes.json().catch(() => ({}));
            const model = Array.isArray(modelData?.items) ? modelData.items.find(item => item && !item.error) : null;

            if (modelRes.ok && model) {
              return [{ ...model, __fleetSlug: '', __fleetName: cfg.display_name || model.name || cfg.slug, __sourceType: 'model' }];
            }

            console.warn(`FleetYards slug "${cfg.slug}" failed as fleet and model`, {
              fleet: fleetData?.error,
              model: modelData?.error || modelData?.items?.[0]?.error,
            });
            return [];
          })
        );

        const combinedItems = dedupeItems(fleetResults.flat());
        const enrichedShips = combinedItems.map((item) => {
          const ship = mapVehicleToShip(item);
          return {
            ...ship,
            sourceFleet: item.__fleetName || '',
            fleetSlug: item.__fleetSlug || '',
          };
        });

        if (!cancelled) {
          setShips(enrichedShips);
        }
      } catch (err) {
        if (!cancelled) {
          setApiError(err?.message || 'Failed to fetch public ship data from FleetYards.');
          setShips([]);
        }
      } finally {
        if (!cancelled) setLoadingShips(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

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

  useEffect(() => {
    if (ships.length > 0 && selectedIndex >= ships.length) setSelectedIndex(0);
  }, [ships.length, selectedIndex]);

  const selectedShip = ships[selectedIndex] || null;
  const activeShip = selectedShipDetails || selectedShip;

  useEffect(() => {
    let cancelled = false;

    const fetchSelectedShip = async () => {
      setSelectedShipDetails(null);

      if (!selectedShip?.slug) {
        setLoadingSelectedShip(false);
        return;
      }

      setLoadingSelectedShip(true);

      try {
        const res = await fetch(`/api/fleetyards/models?slugs=${encodeURIComponent(selectedShip.slug)}&fresh=1`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `FleetYards model error (${res.status})`);

        const model = Array.isArray(data?.items) ? data.items.find(item => !item?.error) : null;
        if (!model || cancelled) return;

        setSelectedShipDetails({
          ...selectedShip,
          ...mapVehicleToShip(model),
          id: selectedShip.id,
          fleetSlug: selectedShip.fleetSlug,
          sourceFleet: selectedShip.sourceFleet,
        });
      } catch (err) {
        if (!cancelled) {
          console.warn('Selected FleetYards model refresh failed:', err);
        }
      } finally {
        if (!cancelled) setLoadingSelectedShip(false);
      }
    };

    fetchSelectedShip();

    return () => {
      cancelled = true;
    };
  }, [selectedShip]);

  const shipCount = ships.length;
  const totalShips = shipCount;
  const totalMembers = new Set(ships.map(ship => ship.fleetSlug).filter(Boolean)).size;
  const totalMaxCrew = ships.reduce((sum, ship) => {
    const crewMax = Number(String(ship.crew || '').split('-').pop()?.replace(/[^0-9]/g, ''));
    return sum + (Number.isFinite(crewMax) ? crewMax : 0);
  }, 0);
  const totalValue = ships.reduce((sum, ship) => sum + getShipValue(ship), 0);
  const classificationSegments = [
    { label: 'Combat', value: ships.filter(ship => /fighter|interceptor|gunship|combat|capital corvette/i.test(`${ship.class} ${ship.role}`)).length, color: '#a3e635' },
    { label: 'Industry', value: ships.filter(ship => /industrial|freighter|transport|hauler|salvage/i.test(`${ship.class} ${ship.role}`)).length, color: '#16a34a' },
    { label: 'Exploration', value: ships.filter(ship => /explorer|scout|exploration/i.test(`${ship.class} ${ship.role}`)).length, color: '#4ade80' },
    { label: 'Other', value: ships.filter(ship => !/fighter|interceptor|gunship|combat|capital corvette|industrial|freighter|transport|hauler|salvage|explorer|scout|exploration/i.test(`${ship.class} ${ship.role}`)).length, color: '#365314' },
  ].filter(item => item.value > 0);
  const activeFleetName = 'Khalai Makhlooq Fleet';

  return (
    <div className="fleet-page">
      <Header />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(163,230,53,0.16),transparent_30rem),radial-gradient(circle_at_82%_4%,rgba(34,197,94,0.10),transparent_26rem),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_22%,rgba(0,0,0,0.75))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(163,230,53,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.08)_1px,transparent_1px)] [background-size:76px_76px]" />

      <div className="relative z-10 w-full px-4 pb-12 pt-24 sm:px-6 2xl:px-8">
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="grid min-h-[calc(100vh-7rem)] gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(520px,1.05fr)] lg:items-stretch"
        >
          <div className="flex flex-col justify-between rounded-[2.75rem] border border-lime-300/10 bg-black/30 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-9">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.26em] text-lime-200">
                  {loadingShips ? 'Hangar Heating Up' : 'Hangar Open'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.26em] text-white/45">
                  {activeFleetName}
                </span>
              </div>

              <div className="mt-9 leading-[0.78] tracking-[-0.12em]">
                <div className="text-[21vw] font-black uppercase text-transparent [-webkit-text-stroke:1px_rgba(217,249,157,0.30)] md:text-[10rem] xl:text-[12rem]">Fleet</div>
                <div className="text-[21vw] font-black uppercase text-white md:text-[10rem] xl:text-[12rem]">Command</div>
              </div>

              <p className="mt-7 max-w-3xl text-xl leading-relaxed text-white/52 md:text-2xl">
                The KMHQ space garage. Big ships, clean cards, chill flex. Select whichever ride you like, and the page will set the scene.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Ships Ready', value: formatNumber(totalShips) },
                { label: 'Total Flex', value: formatCurrency(totalValue) },
                { label: 'Crew Seats', value: formatNumber(totalMaxCrew) },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="rounded-[1.5rem] border border-lime-300/10 bg-white/[0.035] p-5"
                  whileHover={{ y: -4, borderColor: 'rgba(190,242,100,0.32)' }}
                >
                  <div className="font-mono text-xs font-black uppercase tracking-[0.24em] text-lime-300/45">{item.label}</div>
                  <div className="mt-3 text-3xl font-black tracking-[-0.07em] text-white md:text-4xl">{item.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="fleet-active-card relative min-h-[620px] overflow-hidden rounded-[2.75rem] border border-lime-300/10 bg-[#050805] shadow-[0_34px_140px_rgba(0,0,0,0.5)]"
            whileHover={{ scale: 0.998 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(163,230,53,0.18),transparent_38%),linear-gradient(180deg,transparent,rgba(0,0,0,0.85))]" />
            {activeShip?.thumbnail ? (
              <img
                src={activeShip.thumbnail}
                alt={activeShip.name}
                className="absolute inset-0 h-full w-full object-cover opacity-[0.62] saturate-[0.9] transition-transform duration-700 hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,0,0,0.24)_55%,rgba(0,0,0,0.78))]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="font-mono text-xs font-black uppercase tracking-[0.34em] text-lime-300/60">Active Asset</div>
                  <h1 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.08em] text-white md:text-7xl">
                    {activeShip?.name || 'Fleet Incoming'}
                  </h1>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/56">
                    {activeShip?.manufacturer || 'KMHQ'} / {activeShip?.role || 'Hangar Pick'}
                  </p>
                </div>
                <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 py-3 text-right font-mono text-xs font-black uppercase tracking-[0.22em] text-lime-200 backdrop-blur">
                  {activeShip?.holoUrl ? '3D Scene' : 'Photo Scene'}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { label: 'Class', value: activeShip?.class || 'Unknown' },
                  { label: 'Crew', value: activeShip?.crew || 'N/A' },
                  { label: 'Cargo', value: activeShip?.cargo || 'N/A' },
                  { label: 'Price', value: activeShip ? formatCurrency(getShipValue(activeShip)) : '$0.00' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur">
                    <div className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-lime-300/45">{item.label}</div>
                    <div className="mt-2 truncate text-lg font-black tracking-[-0.04em] text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {loadingShips ? (
          <div className="mt-6 rounded-2xl border border-lime-300/10 bg-lime-300/[0.035] p-4 text-sm font-semibold text-lime-100/60">
            <Loader2 size={14} className="mr-2 inline animate-spin text-lime-200/70" />
            Opening hangar, just a sec...
          </div>
        ) : null}

        {apiError && !loadingShips && (
          <div className="mt-6 rounded-2xl border border-red-400/15 bg-red-500/[0.035] p-4">
            <p className="text-sm font-semibold text-white/55">
              Hangar got a bit moody. Try reloading, the scene should come right back.
            </p>
          </div>
        )}

        <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
          <main data-no-site-fx className="fleet-viewport relative min-h-[760px] overflow-hidden rounded-[2.5rem] border border-lime-300/10 bg-[#030503] shadow-[0_30px_120px_rgba(0,0,0,0.42)]">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] border border-white/5" />
            <div className="pointer-events-none absolute left-6 top-6 z-20">
              <div className="font-mono text-xs font-black uppercase tracking-[0.32em] text-lime-300/55">Ship Stage</div>
              <div className="mt-2 text-3xl font-black uppercase tracking-[-0.06em] text-white md:text-4xl">{activeShip?.name || 'Pick a Ride'}</div>
            </div>
            {loadingSelectedShip ? (
              <div className="absolute right-6 top-6 z-20 rounded-full border border-lime-300/15 bg-black/60 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-lime-100/55 backdrop-blur">
                New ride incoming...
              </div>
            ) : null}
            <FleetScene selectedShip={activeShip} />
          </main>

          <FleetShipDetails ship={activeShip} />
        </section>

        <section className="mt-6">
          <FleetShipSelector
            ships={ships}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            loading={loadingShips}
            apiError={apiError}
            totalValue={totalValue}
            totalCrew={totalMaxCrew}
          />
        </section>

        <FleetCommandBriefing
          ships={ships}
          selectedShip={activeShip}
          totalValue={totalValue}
          totalMaxCrew={totalMaxCrew}
        />
      </div>
    </div>
  );
}
