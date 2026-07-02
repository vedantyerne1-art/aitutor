'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';

// Generate random points on sphere for cities
function generateCities(count: number, radius: number) {
  const cities = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    
    const pos = new THREE.Vector3(
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi)
    ).multiplyScalar(radius);

    cities.push({ pos, active: Math.random() > 0.8 });
  }
  return cities;
}

// Draw static connection arcs
function ConnectionArcs({ radius }: { radius: number }) {
  const arcs = useMemo(() => {
    const curves = [];
    for (let i = 0; i < 12; i++) {
      const p1 = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(radius);
      
      const p2 = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(radius);
      
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.4);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      curves.push(curve.getPoints(32));
    }
    return curves;
  }, [radius]);

  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      const time = state.clock.getElapsedTime();
      group.current.children.forEach((child, i) => {
        if ((child as any).material) {
          (child as any).material.opacity = 0.1 + (Math.sin(time * 2 + i) * 0.5 + 0.5) * 0.5;
        }
      });
    }
  });

  return (
    <group ref={group}>
      {arcs.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={i % 2 === 0 ? '#3B82F6' : '#8B5CF6'}
          lineWidth={2}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}

function Globe3D() {
  const group = useRef<THREE.Group>(null);
  const radius = 2.4;
  
  const cities = useMemo(() => generateCities(600, radius), [radius]);
  const activeCities = useMemo(() => cities.filter(c => c.active), [cities]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Base Sphere */}
      <Sphere args={[radius, 64, 64]}>
        <meshBasicMaterial
          color="#0A0A0A"
          transparent
          opacity={0.8}
          wireframe
          wireframeLinewidth={1}
        />
      </Sphere>
      
      {/* Subtle Atmosphere Glow */}
      <Sphere args={[radius * 1.05, 32, 32]}>
        <meshBasicMaterial
          color="#1E3A8A"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* City points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(cities.flatMap(c => c.pos.toArray())), 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#A0A0A0" transparent opacity={0.4} />
      </points>

      {/* Active glowing cities */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(activeCities.flatMap(c => c.pos.toArray())), 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#00D4FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      <ConnectionArcs radius={radius} />
    </group>
  );
}

export default function Globe() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [visitors, setVisitors] = useState(1337);

  // Simulate visitors
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="globe" className="section relative" ref={ref}>
      <div className="container relative z-10">
        <motion.p 
          className="overline mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          08 / Global Reach
        </motion.p>
        <motion.h2
          className="section-title text-white text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          Worldwide <span className="gradient-text">Impact</span>
        </motion.h2>

        <div className="relative h-[600px] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass shadow-2xl">
          
          {/* Dark gradient backdrop to prevent any white-out */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#111] pointer-events-none -z-10" />

          <Canvas 
            camera={{ position: [0, 0, 7], fov: 45 }} 
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 2]} // clamp pixel ratio for performance
          >
             <Globe3D />
          </Canvas>

          {/* Overlay Stats */}
          <div className="absolute top-8 left-8 pointer-events-none">
             <div className="font-mono text-[10px] text-[#A0A0A0] tracking-widest mb-1">TOTAL PAGE VIEWS</div>
             <div className="font-clash text-4xl font-bold electric-text drop-shadow-lg">{visitors.toLocaleString()}</div>
          </div>
          
          <div className="absolute bottom-8 right-8 flex items-center gap-3 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            <div className="font-mono text-xs text-[#A0A0A0]">Systems Online</div>
          </div>

        </div>
      </div>
    </section>
  );
}
