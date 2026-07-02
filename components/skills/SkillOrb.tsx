'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useGesture } from '@use-gesture/react';

interface Skill {
  name: string;
  color: string;
  category: string;
}

function SkillNode({ position, skill, index }: { position: THREE.Vector3; skill: Skill; index: number }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = hovered ? 1.4 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={hovered ? 1 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.005, 8, 32]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={hovered ? 0.6 : 0.1}
        />
      </mesh>

      {/* Label */}
      <Billboard>
        <Text
          fontSize={0.12}
          color={hovered ? '#FFFFFF' : '#A0A0A0'}
          anchorX="center"
          anchorY="bottom"
          position={[0, 0.2, 0]}
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        >
          {skill.name}
        </Text>
      </Billboard>
    </group>
  );
}

function OrbitalSphere({ skills }: { skills: Skill[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const autoRotateRef = useRef(true);
  const velocityRef = useRef({ x: 0, y: 0 });

  // Fibonacci sphere distribution
  const positions = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return skills.map((_, i) => {
      const y = 1 - (i / (skills.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return new THREE.Vector3(
        Math.cos(theta) * radius * 2.5,
        y * 2.5,
        Math.sin(theta) * radius * 2.5
      );
    });
  }, [skills]);

  // Gesture handling
  const bind = useGesture({
    onDrag: ({ delta: [dx, dy], active }) => {
      autoRotateRef.current = !active;
      if (groupRef.current) {
        velocityRef.current.x = dy * 0.01;
        velocityRef.current.y = dx * 0.01;
        groupRef.current.rotation.x += dy * 0.01;
        groupRef.current.rotation.y += dx * 0.01;
      }
    },
    onDragEnd: () => {
      autoRotateRef.current = true;
    },
  });

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (autoRotateRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.1;
    }
    // Momentum decay
    velocityRef.current.x *= 0.95;
    velocityRef.current.y *= 0.95;
  });

  return (
    <group ref={groupRef} {...(bind() as any)}>
      {/* Wireframe sphere guide */}
      <mesh>
        <sphereGeometry args={[2.5, 24, 24]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.03} wireframe />
      </mesh>

      {positions.map((pos, i) => (
        <SkillNode key={skills[i].name} position={pos} skill={skills[i]} index={i} />
      ))}
    </group>
  );
}

export default function SkillOrb({ skills }: { skills: Skill[] }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#3B82F6" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8B5CF6" />
      <OrbitalSphere skills={skills} />
    </Canvas>
  );
}
