'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';

const LETTERS = 'VEDANT YERNE'.split('');

export default function Preloader() {
  const isLoading = useAppStore((s) => s.isLoading);
  const setIsLoading = useAppStore((s) => s.setIsLoading);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'counting' | 'reveal' | 'exit'>('counting');
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Animated counter 0→100
    let current = 0;
    const duration = 2200;
    const steps = 80;
    const increment = 100 / steps;
    const stepTime = duration / steps;

    intervalRef.current = setInterval(() => {
      current += increment + Math.random() * 1.5;
      if (current >= 100) {
        current = 100;
        setCount(100);
        clearInterval(intervalRef.current);
        setTimeout(() => setPhase('reveal'), 300);
        setTimeout(() => setPhase('exit'), 1800);
        setTimeout(() => setIsLoading(false), 2800);
        return;
      }
      setCount(Math.floor(current));
    }, stepTime);

    return () => clearInterval(intervalRef.current);
  }, [setIsLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#0A0A0A' }}
          exit={{
            clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'],
            transition: { duration: 0.9, ease: [0.87, 0, 0.13, 1], delay: 0 },
          }}
        >
          {/* Top half exit */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ background: '#0A0A0A', transformOrigin: 'top' }}
            animate={phase === 'exit' ? { scaleY: 0 } : { scaleY: 1 }}
            transition={phase === 'exit' ? { duration: 0.8, ease: [0.87, 0, 0.13, 1], delay: 0.1 } : {}}
          />

          {/* Bottom half exit */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ background: '#0A0A0A', transformOrigin: 'bottom' }}
            animate={phase === 'exit' ? { scaleY: 0 } : { scaleY: 1 }}
            transition={phase === 'exit' ? { duration: 0.8, ease: [0.87, 0, 0.13, 1] } : {}}
          />

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center gap-10">
            {/* Name reveal */}
            <div className="flex overflow-hidden">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-clash text-[clamp(2.5rem,8vw,7rem)] font-bold tracking-tight text-white"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={
                    phase === 'reveal' || phase === 'exit'
                      ? { y: '0%', opacity: 1 }
                      : { y: '110%', opacity: 0 }
                  }
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: letter === ' ' ? 0 : i * 0.04,
                  }}
                  style={{ display: 'inline-block', minWidth: letter === ' ' ? '0.5em' : 'auto' }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Pulsing glow behind name */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '40vw',
                height: '20vh',
                background: 'radial-gradient(ellipse, rgba(59,130,246,0.3) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Role text */}
            <motion.p
              className="font-mono text-xs tracking-[0.4em] uppercase text-[#A0A0A0]"
              initial={{ opacity: 0 }}
              animate={phase !== 'counting' ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Software Developer · AI/ML Engineer
            </motion.p>

            {/* Counter */}
            <motion.div
              className="absolute bottom-[-12vh] flex items-baseline gap-1"
              animate={phase === 'reveal' ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-clash text-[clamp(3rem,10vw,8rem)] font-bold text-white/10 tabular-nums">
                {String(count).padStart(3, '0')}
              </span>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-10 left-10 right-10 h-[1px] bg-white/5">
            <motion.div
              className="h-full"
              style={{
                background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                width: `${count}%`,
                transition: 'width 0.1s ease',
              }}
            />
          </div>

          {/* Corner text */}
          <div className="absolute bottom-10 right-10 font-mono text-[10px] text-white/20 tracking-widest">
            LOADING EXPERIENCE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
