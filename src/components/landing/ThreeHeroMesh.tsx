import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Heavy Rain Particles ---
const RainParticles: React.FC<{ count?: number }> = ({ count = 600 }) => {
  const points = useRef<THREE.Points>(null!);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = Math.random() * 20 - 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
      spd[i] = 0.2 + Math.random() * 0.3;
    }
    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!points.current) return;
    const geo = points.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= speeds[i]; // fall down
      arr[i * 3] -= speeds[i] * 0.1; // slight wind slant
      if (arr[i * 3 + 1] < -10) {
        arr[i * 3 + 1] = 10;
        arr[i * 3] = (Math.random() - 0.5) * 25;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#38bdf8"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// --- Glowing Zero-Gravity Sensor Particles Floating Upward ---
const FloatingParticles: React.FC<{ count?: number }> = ({ count = 120 }) => {
  const points = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, [count]);

  useFrame((_state, delta) => {
    if (!points.current) return;
    const geo = points.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.4; // float upward
      if (arr[i * 3 + 1] > 8) {
        arr[i * 3 + 1] = -8;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#06b6d4"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// --- Holographic City & Flood Mesh (Cyan / Blue Neon Aesthetic) ---
const CityFloodMesh: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const cityGroup = useRef<THREE.Group>(null!);

  useFrame((_state, delta) => {
    if (cityGroup.current) {
      cityGroup.current.rotation.y += delta * 0.2 + scrollY * 0.0001;
    }
  });

  return (
    <group ref={cityGroup} position={[-1.2, 0, 0]}>
      {/* Flooded Ocean Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[16, 16, 32, 32]} />
        <MeshDistortMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          distort={0.25}
          speed={2}
        />
      </mesh>

      {/* Cyber City Skyscrapers Wireframe */}
      {[-2, -1, 0, 1, 2].map((x, i) =>
        [-2, -1, 0, 1, 2].map((z, j) => {
          const height = Math.abs(Math.sin(i * 3 + j * 5)) * 3 + 1.2;
          return (
            <mesh key={`${i}-${j}`} position={[x * 1.2, height / 2 - 2, z * 1.2]}>
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshBasicMaterial
                color={ (i + j) % 2 === 0 ? "#06b6d4" : "#3b82f6" }
                wireframe
                transparent
                opacity={0.6}
              />
            </mesh>
          );
        })
      )}

      {/* NDMA Telemetry Weather Drone Floating */}
      <mesh position={[0, 1.8, 0]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0891b2"
          emissiveIntensity={1}
          wireframe
        />
      </mesh>
    </group>
  );
};

// --- Holographic Mountain & Landslide Mesh (Orange Hazard / Emerald AI Grid) ---
const MountainLandslideMesh: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const mountainGroup = useRef<THREE.Group>(null!);

  useFrame((_state, delta) => {
    if (mountainGroup.current) {
      mountainGroup.current.rotation.y -= delta * 0.15 + scrollY * 0.0001;
    }
  });

  return (
    <group ref={mountainGroup} position={[1.2, 0, 0]}>
      {/* Mountain Peak Cone */}
      <mesh position={[0, -0.2, 0]}>
        <coneGeometry args={[3, 4, 16]} />
        <meshStandardMaterial
          color="#065f46"
          emissive="#047857"
          emissiveIntensity={0.4}
          wireframe
        />
      </mesh>

      {/* Landslide Hazard Heatmap Area (Orange Neon Overlay) */}
      <mesh position={[0.6, -0.1, 0.6]} rotation={[0.4, 0.2, 0.5]}>
        <planeGeometry args={[2, 2, 8, 8]} />
        <meshBasicMaterial
          color="#f97316"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* NDMA Telemetry Sensor Drone Hovering */}
      <mesh position={[0.5, 2.2, 0.5]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#ea580c"
          emissiveIntensity={1}
          wireframe
        />
      </mesh>
    </group>
  );
};

interface ThreeHeroMeshProps {
  className?: string;
  mode?: 'city' | 'mountain' | 'hybrid';
}

export const ThreeHeroMesh: React.FC<ThreeHeroMeshProps> = ({ className, mode = 'hybrid' }) => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`w-full h-[520px] lg:h-[640px] relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 ${className || ''}`}>
      <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#f97316" />

        {/* Rain Particles */}
        <RainParticles count={700} />
        <FloatingParticles count={150} />

        {(mode === 'city' || mode === 'hybrid') && <CityFloodMesh scrollY={scrollY} />}
        {(mode === 'mountain' || mode === 'hybrid') && <MountainLandslideMesh scrollY={scrollY} />}

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
};
