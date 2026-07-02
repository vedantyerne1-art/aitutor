'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { getLenis } from '@/hooks/useLenis';

const COMMANDS = [
  { id: 'hero', label: 'Go to Hero', shortcut: 'H', action: () => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' }), icon: '⌂' },
  { id: 'about', label: 'About Me', shortcut: 'A', action: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }), icon: '👤' },
  { id: 'projects', label: 'View Projects', shortcut: 'P', action: () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }), icon: '🚀' },
  { id: 'github', label: 'GitHub Stats', shortcut: 'G', action: () => document.querySelector('#github')?.scrollIntoView({ behavior: 'smooth' }), icon: '⚡' },
  { id: 'leetcode', label: 'LeetCode Stats', shortcut: 'L', action: () => document.querySelector('#leetcode')?.scrollIntoView({ behavior: 'smooth' }), icon: '💡' },
  { id: 'timeline', label: 'Experience Timeline', shortcut: 'T', action: () => document.querySelector('#timeline')?.scrollIntoView({ behavior: 'smooth' }), icon: '📅' },
  { id: 'email', label: 'Copy Email', shortcut: 'E', action: () => navigator.clipboard.writeText('vedantyerne1@gmail.com').then(() => alert('Email copied!')), icon: '📧' },
  { id: 'linkedin', label: 'Open LinkedIn', shortcut: '', action: () => window.open('https://linkedin.com/in/vedant-yerne-27040628b', '_blank'), icon: '🔗' },
  { id: 'github-link', label: 'Open GitHub', shortcut: '', action: () => window.open('https://github.com/vedantyerne1-art', '_blank'), icon: '🐙' },
  { id: 'resume', label: 'Download Resume', shortcut: 'R', action: () => { const a = document.createElement('a'); a.href = '/resume/vedant-yerne-resume.pdf'; a.download = 'Vedant-Yerne-Resume.pdf'; a.click(); }, icon: '📄' },
];

export default function CommandPalette() {
  const isOpen = useAppStore((s) => s.isCommandOpen);
  const toggleCommand = useAppStore((s) => s.toggleCommand);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = ([] as any);

  // Use useState properly
  const { useState } = require('react');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCommand();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleCommand]);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  const execute = (cmd: typeof COMMANDS[0]) => {
    cmd.action();
    toggleCommand();
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9000] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCommand}
          />

          {/* Palette */}
          <motion.div
            className="fixed top-[20vh] left-1/2 z-[9001] w-full max-w-lg -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-strong rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Search bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <svg className="w-4 h-4 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent text-white placeholder-[#555] outline-none font-montreal text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filtered.length > 0) execute(filtered[0]);
                  }}
                />
                <kbd className="font-mono text-[10px] text-[#555] bg-white/5 px-2 py-1 rounded">ESC</kbd>
              </div>

              {/* Commands */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {filtered.map((cmd, i) => (
                  <motion.button
                    key={cmd.id}
                    onClick={() => execute(cmd)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <span className="text-lg w-6">{cmd.icon}</span>
                    <span className="flex-1 text-left text-sm font-montreal text-[#A0A0A0] group-hover:text-white transition-colors">
                      {cmd.label}
                    </span>
                    {cmd.shortcut && (
                      <kbd className="font-mono text-[10px] text-[#555] bg-white/5 px-2 py-1 rounded">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-white/5 flex gap-4">
                <span className="font-mono text-[10px] text-[#555]">↑↓ navigate</span>
                <span className="font-mono text-[10px] text-[#555]">↵ select</span>
                <span className="font-mono text-[10px] text-[#555]">⌘K toggle</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
