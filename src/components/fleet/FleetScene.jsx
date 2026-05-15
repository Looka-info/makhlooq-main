'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Grid, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ── Placeholder ship meshes ─────────────────────────────────────────────────
   These procedural geometries stand in until real GLB models are added.
   To swap in a real model: replace <PlaceholderShip/> with useGLTF(ship.modelPath)
   ────────────────────────────────────────────────────────────────────────── */

function HullMaterial({ color }) {
  return <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} transparent opacity={0.92} side={THREE.DoubleSide} />;
}

function WireMaterial() {
  return <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.08} />;
}

function CapitalShip({ color }) {
  return (
    <group>
      <mesh><boxGeometry args={[2.5, 1.2, 10]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, 1.1, -3]}><boxGeometry args={[1.2, 0.8, 2.5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[1.8, 0, 4]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.35, 0.6, 2]} /><HullMaterial color={color} /></mesh>
      <mesh position={[-1.8, 0, 4]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.35, 0.6, 2]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, -0.2, 2]}><boxGeometry args={[4, 0.15, 3]} /><HullMaterial color={color} /></mesh>
      <mesh><boxGeometry args={[2.6, 1.3, 10.1]} /><WireMaterial /></mesh>
    </group>
  );
}

function FighterShip({ color }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.8, 6, 4]} /><HullMaterial color={color} /></mesh>
      <mesh position={[2, 0, 1]}><boxGeometry args={[2, 0.1, 2.5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[-2, 0, 1]}><boxGeometry args={[2, 0.1, 2.5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.4, 1]} /><HullMaterial color={color} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.85, 6.1, 4]} /><WireMaterial /></mesh>
    </group>
  );
}

function ExplorerShip({ color }) {
  return (
    <group>
      <mesh><boxGeometry args={[2, 1.5, 6]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, 0.9, -1.5]}><boxGeometry args={[1.5, 0.6, 2]} /><HullMaterial color={color} /></mesh>
      <mesh position={[1.6, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.4, 0.6, 1.8]} /><HullMaterial color={color} /></mesh>
      <mesh position={[-1.6, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.4, 0.6, 1.8]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, -0.9, 0]}><boxGeometry args={[1.2, 0.5, 2]} /><HullMaterial color={color} /></mesh>
      <mesh><boxGeometry args={[2.05, 1.55, 6.05]} /><WireMaterial /></mesh>
    </group>
  );
}

function MediumShip({ color }) {
  return (
    <group>
      <mesh><boxGeometry args={[1.8, 1.4, 5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, 0.5, -1.8]}><boxGeometry args={[1.4, 0.5, 1.5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[1.3, -0.2, 2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.5, 0.7, 1.5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[-1.3, -0.2, 2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.5, 0.7, 1.5]} /><HullMaterial color={color} /></mesh>
      <mesh><boxGeometry args={[1.85, 1.45, 5.05]} /><WireMaterial /></mesh>
    </group>
  );
}

function IndustrialShip({ color }) {
  return (
    <group>
      <mesh><boxGeometry args={[4, 3, 10]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, 2.2, -3.5]}><boxGeometry args={[2, 1.5, 2.5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, -0.5, 1]}><boxGeometry args={[6, 0.5, 3]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, -2, 3]}><boxGeometry args={[5, 0.4, 2.5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[2.5, 0, 4]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.5, 0.8, 2]} /><HullMaterial color={color} /></mesh>
      <mesh position={[-2.5, 0, 4]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.5, 0.8, 2]} /><HullMaterial color={color} /></mesh>
      <mesh><boxGeometry args={[4.1, 3.1, 10.1]} /><WireMaterial /></mesh>
    </group>
  );
}

function LuxuryShip({ color }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[1, 5, 4, 12]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, 0.8, -1.5]}><boxGeometry args={[1.8, 0.4, 2.5]} /><HullMaterial color={color} /></mesh>
      <mesh position={[2, -0.3, 1]}><boxGeometry args={[2, 0.08, 2]} /><HullMaterial color={color} /></mesh>
      <mesh position={[-2, -0.3, 1]}><boxGeometry args={[2, 0.08, 2]} /><HullMaterial color={color} /></mesh>
      <mesh position={[0, 0, 3]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.5, 1.2]} /><HullMaterial color={color} /></mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[1.05, 5.05, 4, 12]} /><WireMaterial /></mesh>
    </group>
  );
}

const SHIP_COMPONENTS = {
  capital: CapitalShip,
  fighter: FighterShip,
  explorer: ExplorerShip,
  medium: MediumShip,
  industrial: IndustrialShip,
  luxury: LuxuryShip,
};

/* ── Animated ship wrapper ───────────────────────────────────────────────── */

function ShipModel({ ship, shipKey }) {
  const group = useRef();
  const Component = SHIP_COMPONENTS[ship.meshType] || MediumShip;

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.003;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={group} key={shipKey}>
        <Component color={ship.accentColor} />
      </group>
    </Float>
  );
}

/* ── Scan ring effect ────────────────────────────────────────────────────── */

function ScanRing({ color }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2;
      const s = 3 + Math.sin(state.clock.elapsedTime) * 0.5;
      ref.current.scale.set(s, s, 1);
      ref.current.material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    }
  });
  return (
    <mesh ref={ref} position={[0, -1.5, 0]}>
      <ringGeometry args={[0.95, 1, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Main Scene ──────────────────────────────────────────────────────────── */

export default function FleetScene({ selectedShip }) {
  const accentColor = selectedShip?.accentColor || '#00f3ff';

  return (
    <Canvas
      camera={{ position: [8, 4, 8], fov: 50 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#020408', 15, 60]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, 2, 5]} intensity={2} color={accentColor} distance={20} />
      <pointLight position={[5, -2, -5]} intensity={1} color="#4400ff" distance={15} />

      {/* Ship */}
      {selectedShip && (
        <ShipModel ship={selectedShip} shipKey={selectedShip.id} />
      )}

      {/* Environment */}
      <ScanRing color={accentColor} />

      <Grid
        position={[0, -2, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#1a3a4a"
        sectionSize={5}
        sectionThickness={0.8}
        sectionColor={accentColor}
        fadeDistance={40}
        fadeStrength={1}
        infiniteGrid
      />

      <Stars radius={80} depth={60} count={3000} factor={3} saturation={0} fade speed={0.5} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 + 0.2}
        autoRotate={false}
      />
    </Canvas>
  );
}
