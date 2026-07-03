'use client';

import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE — matching the original chart
// Yellow  = single role positions
// Red     = training positions
// Orange  = dual role positions
// Silver  = not part of Polaris crew
// Special = command/unique
// ─────────────────────────────────────────────────────────────────────────────
const YELLOW  = '#fcce14';
const RED     = '#fe7070';
const SILVER  = '#cbc2a3';
const ORANGE  = '#cc4e00';
const GREEN   = '#008a0e';
const PURPLE  = '#635dff';
const BLUE    = '#1071e5';

// ─────────────────────────────────────────────────────────────────────────────
// CHART DATA — "Ranks and Roles for Star Citizen 1.0"
//
// Each track is a horizontal lane. Nodes go left→right in rank order.
// Color legend from original chart.
// ─────────────────────────────────────────────────────────────────────────────

const TRACKS = [
  // ── FLIGHT TRACK ─────────────────────────────────────────────────────────
  {
    id: 'flight',
    label: 'FLIGHT',
    icon: '✈',
    nodes: [
      { id: 'f0', label: 'FLIGHT\nSCHOOL', rank: 'REQ',  color: RED,    req: 'Recruitment requirement' },
      { id: 'f1', label: 'PILOT\nCADET',   rank: 'E1',   color: RED,    req: 'Flight School Test 50%+' },
      { id: 'f2', label: 'COPILOT',        rank: 'O1',   color: ORANGE, req: 'Flight School Test 75%+\nMulticrew vessel 4h' },
      { id: 'f3', label: 'PILOT',          rank: 'O2',   color: YELLOW, req: 'Flight School Test 75%+\nMulticrew vessel 8h' },
      { id: 'f4', label: 'FLIGHT\nLIEUTENANT', rank: 'O2', color: YELLOW, req: 'Officers Interview\nCombat School Passed\n8h personal spacecraft' },
      { id: 'f5', label: 'FLIGHT\nCAPTAIN',rank: 'O3',   color: YELLOW, req: 'Flight Lt experience: 2 battles' },
      { id: 'f6', label: 'SQUADRON\nLEADER', rank: 'O4', color: YELLOW, req: 'Flight Captain experience: 5 battles' },
      { id: 'f7', label: 'WING\nCOMMANDER', rank: 'C1',  color: YELLOW, req: 'Squadron Leader: 10 battles, 1 war' },
    ],
  },

  // ── SHIP CREW TRACK ───────────────────────────────────────────────────────
  {
    id: 'starman',
    label: 'SHIP CREW',
    icon: '🛸',
    nodes: [
      { id: 's0', label: 'ORDINARY\nSTARMAN', rank: 'E1', color: SILVER, req: 'Basic crew member' },
      { id: 's1', label: 'ADEPT\nSTARMAN',   rank: 'E3', color: RED,    req: 'Adept Starman Test Passed' },
    ],
  },

  // ── ENGINEERING TRACK ─────────────────────────────────────────────────────
  {
    id: 'engineering',
    label: 'ENGINEERING',
    icon: '⚙',
    nodes: [
      { id: 'e1', label: 'ENGINEERING\nPRIVATE',  rank: 'E3', color: RED,    req: 'Adept Starman Test\nShip & component knowledge' },
      { id: 'e2', label: 'SHIP\nENGINEER',        rank: 'E4', color: ORANGE, req: 'Extensive ship knowledge\nMultitool mastery' },
      { id: 'e3', label: 'ENGINEERING\nOFFICER',  rank: 'O1', color: YELLOW, req: 'Officers Interview\nEngineering experience' },
      { id: 'e4', label: 'HANGAR\nENGINEER',      rank: 'O2', color: ORANGE, req: 'Hangar & Upper Deck specialist' },
    ],
  },

  // ── LOGISTICS TRACK ───────────────────────────────────────────────────────
  {
    id: 'logistics',
    label: 'LOGISTICS',
    icon: '📦',
    nodes: [
      { id: 'l1', label: 'LOGISTICS\nPRIVATE',     rank: 'E3', color: RED,    req: 'Adept Starman Test\nBasic cargo knowledge' },
      { id: 'l2', label: 'LOGISTICS\nOFFICER',     rank: 'O1', color: YELLOW, req: 'Officers Interview\nCargo hauling rep 3+' },
      { id: 'l3', label: 'LOGISTICS\nCOORDINATOR', rank: 'O3', color: ORANGE, req: 'Advanced procurement knowledge' },
    ],
  },

  // ── GUNNERY TRACK ─────────────────────────────────────────────────────────
  {
    id: 'gunnery',
    label: 'GUNNERY',
    icon: '🎯',
    nodes: [
      { id: 'g1', label: 'GUNNERY\nPRIVATE',  rank: 'E3', color: RED,    req: 'Adept Starman Test\nBasic turret training' },
      { id: 'g2', label: 'GUNMASTER',          rank: 'E4', color: ORANGE, req: 'Advanced turret knowledge' },
      { id: 'g3', label: 'GUN\nSPECIALIST',   rank: 'O1', color: YELLOW, req: 'Mastery of ship weapon systems' },
    ],
  },

  // ── GROUND INFANTRY TRACK ─────────────────────────────────────────────────
  {
    id: 'ground',
    label: 'GROUND OPS',
    icon: '⚔',
    nodes: [
      { id: 'i0', label: 'ORDINARY\nENLISTMENT',  rank: 'E1', color: SILVER, req: 'Basic FPS training' },
      { id: 'i1', label: 'GUNMAN',               rank: 'E2', color: SILVER, req: 'Basic weapon & loadout knowledge' },
      { id: 'i2', label: 'GUNMAN\nFIRST CLASS',  rank: 'E3', color: SILVER, req: 'Ground vehicle operation' },
      { id: 'i3', label: 'GROUND\nINFANTRY',     rank: 'E4', color: RED,    req: 'Combat School Test 50%+' },
      { id: 'i4', label: 'WEAPONS\nSPECIALIST',  rank: 'E5', color: ORANGE, req: 'Combat School Test 75%+' },
      { id: 'i5', label: 'COMBAT\nCAPTAIN',      rank: 'O3', color: YELLOW, req: 'Officers Interview\nFPS Tactics & Comms' },
    ],
  },

  // ── MEDICAL TRACK ─────────────────────────────────────────────────────────
  {
    id: 'medical',
    label: 'MEDICAL',
    icon: '✚',
    nodes: [
      { id: 'm1', label: 'MEDIC',              rank: 'E2', color: RED,    req: 'Basic medical training' },
      { id: 'm2', label: 'MEDICAL\nOFFICER',   rank: 'O1', color: YELLOW, req: 'Advanced medical knowledge' },
      { id: 'm3', label: 'SURGEON',            rank: 'O3', color: YELLOW, req: 'Full medical mastery' },
    ],
  },

  // ── COMMAND TRACK ─────────────────────────────────────────────────────────
  {
    id: 'command',
    label: 'COMMAND',
    icon: '★',
    nodes: [
      { id: 'c1', label: 'COMMANDING\nOFFICER',     rank: 'C1', color: YELLOW, req: 'Board approval\n50 battles, 5 wars' },
      { id: 'c2', label: 'FLEET\nCAPTAIN',          rank: 'C2', color: YELLOW, req: 'Commanders Board\n10 battles, 2 wars' },
      { id: 'c3', label: 'WING\nCOMMANDER',         rank: 'C1', color: YELLOW, req: 'Squadron Leader\n10 battles, 1 war' },
      { id: 'c4', label: 'COMMANDER\nIN CHIEF',     rank: 'C3', color: GREEN,  req: 'Elected by High Council' },
    ],
  },

  // ── HIGH COUNCIL ──────────────────────────────────────────────────────────
  {
    id: 'council',
    label: 'HIGH COUNCIL',
    icon: '👑',
    nodes: [
      { id: 'hc1', label: 'COLONEL',   rank: 'COL', color: PURPLE, req: 'High Council' },
      { id: 'hc2', label: 'MAJOR',     rank: 'MAJ', color: BLUE,   req: 'Senior leadership' },
      { id: 'hc3', label: 'FIGHTER\nPILOT', rank: 'SPL', color: ORANGE, req: 'Elite pilot designation' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RANK SCALE (top header)
// ─────────────────────────────────────────────────────────────────────────────
const RANK_SCALE = [
  { code: 'REQ',  label: 'RECRUIT' },
  { code: 'E1',   label: 'ENLIST' },
  { code: 'E2',   label: 'CITIZEN' },
  { code: 'E3',   label: 'PRIVATE' },
  { code: 'E4',   label: 'SERGEANT' },
  { code: 'E5',   label: 'WARRANT' },
  { code: 'O1',   label: '2ND LT' },
  { code: 'O2',   label: 'LIEUTENANT' },
  { code: 'O3',   label: 'CAPTAIN' },
  { code: 'O4',   label: 'MAJOR' },
  { code: 'O5',   label: 'SQN LEADER' },
  { code: 'C1',   label: 'CMD OFFICER' },
  { code: 'C2',   label: 'FLEET CPT' },
  { code: 'C3',   label: 'C-IN-C' },
  { code: 'COL',  label: 'COLONEL' },
  { code: 'MAJ',  label: 'MARSHAL' },
  { code: 'SPL',  label: 'SPECIAL' },
];

// Map rank code to column index
const RANK_COL = Object.fromEntries(RANK_SCALE.map((r, i) => [r.code, i]));
const COL_W = 128; // px per column
const ROW_H = 72;  // px per track row
const NODE_H = 50; // node height
const HEADER_H = 72;
const TRACK_GAP = 12;

// ─────────────────────────────────────────────────────────────────────────────
// COLOR → KM DARK STYLE
// ─────────────────────────────────────────────────────────────────────────────
const nodeStyle = (color) => {
  const map = {
    [YELLOW]:  { bg: 'rgba(252,206,20,0.12)', border: '#fcce14', text: '#fcce14', glow: '#fcce1440' },
    [RED]:     { bg: 'rgba(254,112,112,0.10)', border: '#fe7070', text: '#fe7070', glow: '#fe707030' },
    [SILVER]:  { bg: 'rgba(203,194,163,0.08)', border: '#cbc2a3', text: '#cbc2a3', glow: '#cbc2a320' },
    [ORANGE]:  { bg: 'rgba(204,78,0,0.12)',   border: '#cc7a00', text: '#e8a030', glow: '#cc4e0030' },
    [GREEN]:   { bg: 'rgba(0,138,14,0.15)',   border: '#00ff41', text: '#00ff41', glow: '#00ff4140' },
    [PURPLE]:  { bg: 'rgba(99,93,255,0.15)',  border: '#635dff', text: '#a09dff', glow: '#635dff40' },
    [BLUE]:    { bg: 'rgba(16,113,229,0.15)', border: '#1071e5', text: '#60a5fa', glow: '#1071e540' },
  };
  return map[color] || map[SILVER];
};

const colorLabel = (color) => {
  const map = {
    [YELLOW]: 'SINGLE ROLE',
    [RED]:    'TRAINING',
    [ORANGE]: 'DUAL ROLE',
    [SILVER]: 'NON-POLARIS',
    [GREEN]:  'COMMAND',
    [PURPLE]: 'COUNCIL',
    [BLUE]:   'LEADERSHIP',
  };
  return map[color] || '';
};

// ─────────────────────────────────────────────────────────────────────────────
// NODE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const OrgNode = ({ node, x, y }) => {
  const [hovered, setHovered] = useState(false);
  const s = nodeStyle(node.color);
  const lines = node.label.split('\n');

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow */}
      {hovered && (
        <rect
          x={-4} y={-4}
          width={COL_W - 16 + 8} height={NODE_H + 8}
          rx={10}
          fill={s.glow}
          filter="url(#glow)"
        />
      )}
      {/* Box */}
      <rect
        x={0} y={0}
        width={COL_W - 16} height={NODE_H}
        rx={7}
        fill={s.bg}
        stroke={s.border}
        strokeWidth={hovered ? 1.5 : 1}
        style={{ transition: 'all 0.15s' }}
      />
      {/* Top accent line */}
      <line
        x1={8} y1={0} x2={COL_W - 24} y2={0}
        stroke={s.border} strokeWidth={1.5} opacity={0.7}
      />
      {/* Corner marks */}
      <path d="M0,0 L5,0 M0,0 L0,5" stroke={s.border} strokeWidth={1.5} opacity={0.8} />
      <path d={`M${COL_W-16},0 L${COL_W-21},0 M${COL_W-16},0 L${COL_W-16},5`} stroke={s.border} strokeWidth={1.5} opacity={0.8} />
      <path d={`M0,${NODE_H} L5,${NODE_H} M0,${NODE_H} L0,${NODE_H-5}`} stroke={s.border} strokeWidth={1.5} opacity={0.8} />
      <path d={`M${COL_W-16},${NODE_H} L${COL_W-21},${NODE_H} M${COL_W-16},${NODE_H} L${COL_W-16},${NODE_H-5}`} stroke={s.border} strokeWidth={1.5} opacity={0.8} />

      {/* Rank badge */}
      <text
        x={COL_W - 24}
        y={12}
        textAnchor="end"
        fontSize={7}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight={700}
        fill={s.border}
        opacity={0.6}
        letterSpacing={0.5}
      >{node.rank}</text>

      {/* Label */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={(COL_W - 16) / 2}
          y={lines.length === 1 ? NODE_H / 2 + 4.5 : (i === 0 ? NODE_H / 2 - 3.5 : NODE_H / 2 + 10)}
          textAnchor="middle"
          fontSize={lines.length === 1 ? 8.5 : 7.5}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight={700}
          fill={s.text}
          letterSpacing={0.6}
        >{line}</text>
      ))}

      {/* Tooltip */}
      {hovered && node.req && (
        <g transform={`translate(${(COL_W - 16) / 2}, ${NODE_H + 6})`}>
          {/* Tooltip box */}
          <rect
            x={-100} y={0}
            width={200} height={node.req.split('\n').length * 13 + 10}
            rx={5}
            fill="#080e08"
            stroke={s.border}
            strokeWidth={1}
          />
          {node.req.split('\n').map((line, i) => (
            <text
              key={i}
              x={0} y={13 + i * 13}
              textAnchor="middle"
              fontSize={7}
              fontFamily="'JetBrains Mono', monospace"
              fill={s.text}
              opacity={0.8}
            >{line}</text>
          ))}
        </g>
      )}
    </g>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CHART
// ─────────────────────────────────────────────────────────────────────────────
const RanksRolesChart = () => {
  const totalCols = RANK_SCALE.length;
  const chartW = totalCols * COL_W + 160;
  const chartH = HEADER_H + TRACKS.length * (ROW_H + TRACK_GAP) + 40;

  return (
    <div className="w-full rounded-[2rem] border border-lime-300/10 overflow-hidden"
      style={{ background: 'linear-gradient(145deg,rgba(255,255,255,0.03) 0%,rgba(2,6,3,0.95) 60%)' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_#00ff41]" />
          <span className="font-mono text-[10px] font-black tracking-[0.25em] text-lime-400/60 uppercase">
            Ranks &amp; Roles · Star Citizen 1.0
          </span>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          {[
            { color: YELLOW, label: 'Single Role' },
            { color: RED,    label: 'Training' },
            { color: ORANGE, label: 'Dual Role' },
            { color: SILVER, label: 'Non-Polaris' },
          ].map(({ color, label }) => {
            const s = nodeStyle(color);
            return (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm border"
                  style={{ background: s.bg, borderColor: s.border }}
                />
                <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: s.text }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SVG Chart ──────────────────────────────────────── */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '70vh' }}>
        <svg
          width={chartW}
          height={chartH}
          style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace" }}
        >
          <defs>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Rank column header ── */}
          {RANK_SCALE.map((r, ci) => {
            const cx = 150 + ci * COL_W + (COL_W - 16) / 2;
            return (
              <g key={r.code}>
                {/* Vertical guide line */}
                <line
                  x1={150 + ci * COL_W + (COL_W - 16) / 2}
                  y1={HEADER_H - 8}
                  x2={150 + ci * COL_W + (COL_W - 16) / 2}
                  y2={chartH - 20}
                  stroke="#ffffff08"
                  strokeWidth={1}
                  strokeDasharray="3 6"
                />
                {/* Column header box */}
                <rect
                  x={150 + ci * COL_W}
                  y={8}
                  width={COL_W - 16}
                  height={46}
                  rx={6}
                  fill="rgba(255,255,255,0.025)"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth={1}
                />
                <text
                  x={cx} y={28}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight={900}
                  fill="rgba(255,255,255,0.5)"
                  letterSpacing={1}
                >{r.code}</text>
                <text
                  x={cx} y={44}
                  textAnchor="middle"
                  fontSize={6.5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight={700}
                  fill="rgba(255,255,255,0.2)"
                  letterSpacing={0.5}
                >{r.label}</text>
              </g>
            );
          })}

          {/* ── Track rows ── */}
          {TRACKS.map((track, ti) => {
            const trackY = HEADER_H + ti * (ROW_H + TRACK_GAP);
            const trackMidY = trackY + NODE_H / 2;

            return (
              <g key={track.id}>
                {/* Track label (left side) */}
                <rect
                  x={4} y={trackY + 2}
                  width={138} height={NODE_H - 4}
                  rx={6}
                  fill="rgba(0,255,65,0.04)"
                  stroke="rgba(0,255,65,0.1)"
                  strokeWidth={1}
                />
                <text
                  x={9} y={trackY + NODE_H / 2 - 4}
                  fontSize={13}
                  fontFamily="sans-serif"
                  fill="rgba(255,255,255,0.35)"
                >{track.icon}</text>
                <text
                  x={30} y={trackY + NODE_H / 2 + 1}
                  fontSize={6.5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight={900}
                  fill="rgba(255,255,255,0.35)"
                  letterSpacing={1}
                >{track.label}</text>

                {/* Connector line through nodes */}
                {track.nodes.length > 1 && (() => {
                  const sorted = track.nodes.map(n => ({
                    ...n,
                    colX: 150 + RANK_COL[n.rank] * COL_W
                  })).sort((a, b) => a.colX - b.colX);
                  const x1 = sorted[0].colX + (COL_W - 16) / 2;
                  const x2 = sorted[sorted.length - 1].colX + (COL_W - 16) / 2;
                  const s = nodeStyle(track.nodes[0].color);
                  return (
                    <line
                      x1={x1} y1={trackMidY}
                      x2={x2} y2={trackMidY}
                      stroke={s.border}
                      strokeWidth={1}
                      opacity={0.25}
                      strokeDasharray="4 3"
                    />
                  );
                })()}

                {/* Nodes */}
                {track.nodes.map(node => {
                  const colIdx = RANK_COL[node.rank] ?? 0;
                  const nx = 150 + colIdx * COL_W;
                  return (
                    <OrgNode
                      key={node.id}
                      node={node}
                      x={nx}
                      y={trackY}
                    />
                  );
                })}

                {/* Arrows between consecutive nodes */}
                {(() => {
                  const sorted = track.nodes
                    .map(n => ({ ...n, colX: 150 + RANK_COL[n.rank] * COL_W }))
                    .sort((a, b) => a.colX - b.colX);
                  return sorted.slice(0, -1).map((n, i) => {
                    const x1 = n.colX + COL_W - 16;
                    const x2 = sorted[i + 1].colX;
                    if (x2 <= x1 + 4) return null;
                    const s = nodeStyle(n.color);
                    const my = trackY + NODE_H / 2;
                    const mx = (x1 + x2) / 2;
                    return (
                      <g key={`arr-${i}`}>
                        <line
                          x1={x1} y1={my}
                          x2={x2 - 5} y2={my}
                          stroke={s.border}
                          strokeWidth={1}
                          opacity={0.5}
                        />
                        {/* Arrowhead */}
                        <polygon
                          points={`${x2-1},${my} ${x2-6},${my-3} ${x2-6},${my+3}`}
                          fill={s.border}
                          opacity={0.5}
                        />
                      </g>
                    );
                  });
                })()}
              </g>
            );
          })}

          {/* ── Scanlines overlay ── */}
          <rect
            x={0} y={0} width={chartW} height={chartH}
            fill="url(#scanlines)"
            opacity={0.04}
            pointerEvents="none"
          />
          <defs>
            <pattern id="scanlines" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
              <rect x="0" y="3" width="1" height="1" fill="black" />
            </pattern>
          </defs>
        </svg>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="px-6 py-2 border-t border-white/5 flex items-center gap-6 text-[8px] font-mono font-black uppercase tracking-widest text-white/15">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: YELLOW }} />
          Single Role
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: RED }} />
          Training Required
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: ORANGE }} />
          Dual Role
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: SILVER }} />
          Non-Polaris Crew
        </span>
        <span className="ml-auto opacity-50">hover nodes for requirements</span>
      </div>
    </div>
  );
};

export default RanksRolesChart;
