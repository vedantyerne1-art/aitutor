'use client';

import { useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { useAppStore } from '@/store';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const lineVariants: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroText() {
  const isLoading = useAppStore((s) => s.isLoading);

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 flex flex-col justify-end pb-20 h-full pointer-events-none">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={!isLoading ? 'visible' : 'hidden'}
          className="pointer-events-none"
        >
          {/* Overline */}
          <div className="overflow-hidden mb-6">
            <motion.p
              variants={lineVariants}
              className="overline"
            >
              01 / Introduction
            </motion.p>
          </div>

          {/* Main hero text */}
          <div className="overflow-hidden">
            <motion.h1
              variants={lineVariants}
              className="hero-text text-white leading-none"
            >
              VEDANT
            </motion.h1>
          </div>

          <div className="overflow-hidden flex flex-wrap items-center gap-4">
            <motion.div variants={lineVariants} className="overflow-hidden">
              <span className="hero-text electric-text leading-none">
                SOFTWARE
              </span>
            </motion.div>
          </div>

          <div className="overflow-hidden">
            <motion.div variants={lineVariants}>
              <span className="hero-text text-white leading-none opacity-20">
                DEVELOPER
              </span>
            </motion.div>
          </div>

          {/* Subtext */}
          <div className="overflow-hidden mt-8">
            <motion.p
              variants={lineVariants}
              className="font-montreal text-[#A0A0A0] text-lg max-w-2xl leading-relaxed"
            >
              Building intelligent systems, immersive products,
              <br className="hidden md:block" />
              and AI-driven experiences.
            </motion.p>
          </div>

          {/* CTAs */}
          <div className="overflow-hidden mt-10">
            <motion.div
              variants={lineVariants}
              className="flex flex-wrap items-center gap-6 pointer-events-auto"
            >
              {/* Open to Work badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/30">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="font-mono text-xs text-green-400 tracking-wide">Open to Work</span>
              </div>

              {/* View work button */}
              <motion.button
                onClick={scrollToProjects}
                className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium font-montreal text-white neon-border-blue hover:shadow-neon-blue transition-all duration-300"
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.97 }}
                data-cursor-label="View"
                data-cursor-variant="view"
              >
                View Work
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </motion.button>

              {/* Contact button */}
              <motion.a
                href="mailto:vedantyerne1@gmail.com"
                className="font-montreal text-sm text-[#A0A0A0] hover:text-white transition-colors underline underline-offset-4"
                whileHover={{ x: 2 }}
                data-cursor-variant="hover"
              >
                Get in touch
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={!isLoading ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span className="font-mono text-[10px] text-[#555] tracking-widest rotate-90 mb-4">
            SCROLL
          </span>
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-transparent via-[#555] to-transparent"
            animate={{ scaleY: [0, 1, 0], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
