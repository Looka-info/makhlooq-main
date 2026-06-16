'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, OrbitControls, Stars } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';
import * as THREE from 'three';

function FleetHoloModel({ url, accentColor, shipKey, onError }) {
  const group = useRef(null);
  const [scene, setScene] = useState(null);
  const model = useMemo(() => scene?.clone(true) || null, [scene]);

  useEffect(() => {
    let cancelled = false;
    setScene(null);

    const manager = new THREE.LoadingManager();
    manager.onError = (assetUrl) => {
      if (!cancelled) {
        onError?.(new Error(`Fleet asset failed: ${assetUrl}`));
      }
    };

    const loader = new GLTFLoader(manager);
    loader.setCrossOrigin('anonymous');

    try {
      loader.load(
        url,
        (gltf) => {
          if (!cancelled) {
            setScene(gltf.scene);
          }
        },
        undefined,
        (error) => {
          if (!cancelled) {
            onError?.(error);
          }
        }
      );
    } catch (error) {
      if (!cancelled) {
        onError?.(error);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [url, onError]);

  useEffect(() => {
    if (!model) return;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = 7 / maxAxis;

    model.position.sub(center);
    model.scale.setScalar(scale);

    model.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material) {
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 0.92;
        child.material.side = THREE.DoubleSide;
        child.material.emissive = new THREE.Color(accentColor);
        child.material.emissiveIntensity = 0.08;
        child.material.metalness = Math.max(child.material.metalness || 0, 0.35);
        child.material.roughness = Math.min(child.material.roughness ?? 0.55, 0.45);
      }
    });
  }, [model, accentColor]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += 0.0025;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.12;
  });

  if (!model) return <LoadingModel />;

  return <primitive key={shipKey} ref={group} object={model} />;
}

function ScanRing({ color }) {
  const ref = useRef(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.PI / 2;
    const scale = 3.2 + Math.sin(state.clock.elapsedTime) * 0.45;
    ref.current.scale.set(scale, scale, 1);
    ref.current.material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 2) * 0.035;
  });

  return (
    <mesh ref={ref} position={[0, -1.65, 0]}>
      <ringGeometry args={[0.95, 1, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function LoadingModel() {
  return (
    <mesh>
      <torusKnotGeometry args={[1, 0.03, 160, 8]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function FleetScene({ selectedShip }) {
  const [modelFailed, setModelFailed] = useState(false);
  const accentColor = selectedShip?.accentColor || '#d4d4d8';
  const modelUrl = selectedShip?.modelPath || selectedShip?.holoUrl || '';
  const modelKey = selectedShip?.id || modelUrl;

  useEffect(() => {
    setModelFailed(false);
  }, [modelKey]);

  if (!modelUrl) {
    return (
      <div className="flex h-full min-h-[720px] items-center justify-center p-8 text-center">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-white/35">3D Scene Not Ready</div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
            Is ship ka 3D model abhi hangar mein nahi hai. Picture mode bhi kaafi clean lag raha hai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[520px] md:min-h-[720px]">
      {modelFailed ? (
        <div className="pointer-events-none absolute inset-x-6 top-24 z-20 rounded-2xl border border-lime-300/10 bg-black/55 p-4 text-sm leading-6 text-white/55 backdrop-blur md:left-8 md:right-auto md:max-w-sm">
          3D file load nahi hui. No tension, ship ka photo mode abhi bhi clean chal raha hai.
        </div>
      ) : null}

      <Canvas
        camera={{ position: [8, 4, 8], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ background: 'transparent', minHeight: 'inherit' }}
      >
        <fog attach="fog" args={['#050505', 16, 60]} />

        <ambientLight intensity={0.45} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-5, 2, 5]} intensity={1.4} color={accentColor} distance={24} />
        <pointLight position={[5, -2, -5]} intensity={0.8} color="#71717a" distance={18} />

        {!modelFailed ? (
          <FleetHoloModel
            url={modelUrl}
            accentColor={accentColor}
            shipKey={modelKey}
            onError={(error) => {
              console.warn('Fleet 3D model failed to load:', error);
              setModelFailed(true);
            }}
          />
        ) : null}

        <ScanRing color={accentColor} />
        <Grid
          position={[0, -2, 0]}
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.25}
          cellColor="#27272a"
          sectionSize={5}
          sectionThickness={0.5}
          sectionColor={accentColor}
          fadeDistance={38}
          fadeStrength={1}
          infiniteGrid
        />
        <Stars radius={80} depth={60} count={2400} factor={3} saturation={0} fade speed={0.35} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 + 0.35}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
