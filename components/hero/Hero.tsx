'use client';

import dynamic from 'next/dynamic';
import HeroText from './HeroText';
import { useIsMobile } from '@/hooks/useMediaQuery';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function Hero() {
  const isMobile = useIsMobile();

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
        }}
      />

      {/* 3D Scene — desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 z-1 flex items-center justify-center">
          <HeroScene />
        </div>
      )}

      {/* Mobile static glow */}
      {isMobile && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>
      )}

      {/* Light leak top left */}
      <div
        className="absolute top-0 left-0 w-64 h-64 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top left, rgba(59,130,246,0.4), transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Light leak bottom right */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(139,92,246,0.4), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Hero Text overlay */}
      <HeroText />
    </section>
  );
}
