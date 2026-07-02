'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { getLenis } from '@/hooks/useLenis';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'GitHub', href: '#github' },
  { label: 'LeetCode', href: '#leetcode' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Contact', href: '#chat' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const theme = useAppStore((s) => s.theme);
  const isLoading = useAppStore((s) => s.isLoading);
  const activeSection = useAppStore((s) => s.activeSection);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.5 });
      else el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  if (isLoading) return null;

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          scrolled ? 'glass py-4' : 'py-6'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
            className="font-clash font-bold text-xl tracking-tight text-white"
            whileHover={{ scale: 1.05 }}
            data-cursor-label="Home"
            data-cursor-variant="hover"
          >
            VY<span className="gradient-text">.</span>
          </motion.a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`font-montreal text-sm tracking-wide transition-all duration-300 hover:text-white relative group ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-white'
                    : 'text-[#A0A0A0]'
                }`}
                data-cursor-variant="hover"
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ${
                  activeSection === link.href.replace('#', '') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            ))}
          </div>

          {/* Right: Theme + Resume + Menu */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-[#A0A0A0] hover:text-white transition-all border border-white/10 hover:border-white/30"
              aria-label="Toggle theme"
              data-cursor-variant="hover"
            >
              {theme === 'dark' ? '○' : '●'}
            </button>

            {/* Resume Download */}
            <motion.a
              href="/resume/vedant-yerne-resume.pdf"
              download
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium font-montreal neon-border-blue text-white hover:shadow-neon-blue transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              data-cursor-label="Download"
              data-cursor-variant="hover"
            >
              <span>Resume</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L2 4h8L6 8z"/>
              </svg>
            </motion.a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
              aria-label="Menu"
            >
              <motion.span
                className="w-6 h-px bg-white block"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              />
              <motion.span
                className="w-6 h-px bg-white block"
                animate={{ opacity: menuOpen ? 0 : 1 }}
              />
              <motion.span
                className="w-6 h-px bg-white block"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[999] glass-strong flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="font-clash text-4xl font-bold text-white hover:gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
