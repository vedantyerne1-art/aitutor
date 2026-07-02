'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useAppStore } from '@/store';

export default function Cursor() {
  const cursorVariant = useAppStore((s) => s.cursorVariant);
  const cursorLabel = useAppStore((s) => s.cursorLabel);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 900, mass: 0.3 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 900, mass: 0.3 });
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const isHoveringRef = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = (e: Event) => {
      const el = e.target as HTMLElement;
      const label = el.getAttribute('data-cursor-label') || '';
      const variant = (el.getAttribute('data-cursor-variant') as any) || 'hover';
      useAppStore.getState().setCursorLabel(label);
      useAppStore.getState().setCursorVariant(variant);
      isHoveringRef.current = true;
    };

    const handleMouseLeave = () => {
      useAppStore.getState().setCursorLabel('');
      useAppStore.getState().setCursorVariant('default');
      isHoveringRef.current = false;
    };

    window.addEventListener('mousemove', move);

    // Attach to all interactive elements
    const setupElements = () => {
      const elements = document.querySelectorAll(
        'a, button, [data-cursor], [data-cursor-label], [data-cursor-variant]'
      );
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    setupElements();

    // Re-setup on DOM changes
    const observer = new MutationObserver(setupElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      observer.disconnect();
    };
  }, [mouseX, mouseY]);

  const dotSize = cursorVariant === 'default' ? 8 : cursorVariant === 'text' ? 4 : 8;
  const ringSize = cursorVariant === 'hover' || cursorVariant === 'view' || cursorVariant === 'open'
    ? 56
    : cursorVariant === 'drag'
    ? 72
    : 40;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: dotSize,
            height: dotSize,
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border border-white flex items-center justify-center"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: cursorVariant === 'default' ? 0.4 : 0.9,
          }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {cursorLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-white text-[10px] font-mono tracking-widest uppercase"
            >
              {cursorLabel}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Trailing glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: cursorVariant !== 'default' ? 120 : 60,
            height: cursorVariant !== 'default' ? 120 : 60,
            opacity: cursorVariant !== 'default' ? 0.15 : 0.05,
          }}
          transition={{ duration: 0.3 }}
          className="rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>
    </>
  );
}
