'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';

// Morphing Icosahedron with Fresnel glow
function MorphingSphere({ mouse }: { mouse: React.MutableRefObject<{ normalizedX: number; normalizedY: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#3B82F6') },
      uColor2: { value: new THREE.Color('#8B5CF6') },
      uFresnelPower: { value: 3.0 },
    }),
    []
  );

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vNoise;

    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vNormal = normal;
      vPosition = position;
      
      float noise = snoise(position * 0.8 + vec3(uTime * 0.3));
      vNoise = noise;
      
      // Mouse repulsion
      vec2 mouseInfluence = uMouse * 0.3;
      float mouseEffect = 1.0 - smoothstep(0.0, 1.5, length(position.xy - mouseInfluence * 2.0));
      
      vec3 newPos = position + normal * (noise * 0.25 + mouseEffect * 0.1);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uFresnelPower;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vNoise;

    void main() {
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(vNormal, viewDirection), uFresnelPower);
      
      vec3 color = mix(uColor1, uColor2, vNoise * 0.5 + 0.5);
      color = mix(color, vec3(1.0), fresnel * 0.8);
      
      float alpha = 0.6 + fresnel * 0.4;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame(({ clock }) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = clock.elapsedTime * 0.15;
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.set(
        mouse.current.normalizedX,
        mouse.current.normalizedY
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.6, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
}

// Particle system
function Particles({ mouse }: { mouse: React.MutableRefObject<{ normalizedX: number; normalizedY: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 2000;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.04;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Outer ring glow
function RingGlow() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.03) * 0.3;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.8, 0.008, 8, 200]} />
      <meshBasicMaterial color="#3B82F6" transparent opacity={0.3} />
    </mesh>
  );
}

export default function HeroScene() {
  const mouse = useMousePosition();

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3B82F6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />

      <MorphingSphere mouse={mouse} />
      <Particles mouse={mouse} />
      <RingGlow />
    </Canvas>
  );
}
