'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useGitHub } from '@/hooks/useGitHub';

const LANG_COLORS: Record<string, string> = {
  Python: '#3776AB',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Java: '#ED8B00',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Shell: '#89E051',
  C: '#555555',
};

function RepoCard({ repo }: { repo: any }) {
  const [hovered, setHovered] = ([] as any);
  const { useState } = require('react');
  const [isHov, setIsHov] = useState(false);

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl glass border border-white/5 p-5 hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden"
      whileHover={{ y: -4, rotateX: 2, rotateY: 2 }}
      style={{ transformStyle: 'preserve-3d' }}
      onMouseEnter={() => setIsHov(true)}
      onMouseLeave={() => setIsHov(false)}
      data-cursor-label="Open"
      data-cursor-variant="open"
    >
      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={isHov ? { opacity: 1 } : { opacity: 0 }}
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.15), transparent 70%)',
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#555]" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9z" />
          </svg>
          <h3 className="font-montreal font-medium text-sm text-white group-hover:text-blue-400 transition-colors truncate max-w-[160px]">
            {repo.name}
          </h3>
        </div>
        <svg className="w-3.5 h-3.5 text-[#555] group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>

      <p className="font-montreal text-[#555] text-xs leading-relaxed mb-4 line-clamp-2">
        {repo.description || 'No description available.'}
      </p>

      <div className="flex items-center gap-4">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: LANG_COLORS[repo.language] || '#A0A0A0' }}
            />
            <span className="font-mono text-[10px] text-[#555]">{repo.language}</span>
          </div>
        )}
        <div className="flex items-center gap-1 font-mono text-[10px] text-[#555]">
          <span>⭐</span>
          <span>{repo.stargazers_count}</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-[#555]">
          <span>🍴</span>
          <span>{repo.forks_count}</span>
        </div>
      </div>
    </motion.a>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <motion.div
      className="rounded-2xl glass border border-white/5 p-5 flex items-center gap-4"
      whileHover={{ scale: 1.02, borderColor: 'rgba(59,130,246,0.3)' }}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="font-clash font-bold text-2xl text-white">{value}</div>
        <div className="font-mono text-[10px] text-[#555] tracking-wide">{label}</div>
      </div>
    </motion.div>
  );
}

function LangBar({ langs }: { langs: Record<string, number> }) {
  const total = Object.values(langs).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="space-y-3">
      {sorted.map(([lang, count]) => (
        <div key={lang} className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-24">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LANG_COLORS[lang] || '#A0A0A0' }} />
            <span className="font-mono text-[10px] text-[#A0A0A0] truncate">{lang}</span>
          </div>
          <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: LANG_COLORS[lang] || '#A0A0A0' }}
              initial={{ width: 0 }}
              whileInView={{ width: `${(count / total) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="font-mono text-[10px] text-[#555] w-8 text-right">
            {Math.round((count / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function GitHubSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { stats, isLoading, error } = useGitHub();

  return (
    <section id="github" className="section" ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.p className="overline mb-4" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
          05 / Open Source
        </motion.p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.h2
            className="section-title text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            GitHub{' '}
            <span className="gradient-text">Activity</span>
          </motion.h2>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-mono text-xs text-[#555]">Live · Refreshes every 60s</span>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats row */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <StatCard label="REPOSITORIES" value={stats?.public_repos || 0} icon="📦" />
              <StatCard label="TOTAL STARS" value={stats?.totalStars || 0} icon="⭐" />
              <StatCard label="TOTAL FORKS" value={stats?.totalForks || 0} icon="🍴" />
              <StatCard label="FOLLOWERS" value={stats?.followers || 0} icon="👥" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Repos grid */}
              <div className="lg:col-span-2">
                <div className="font-mono text-xs text-[#555] mb-4 tracking-wide">PINNED REPOSITORIES</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(stats?.repos || []).slice(0, 6).map((repo: any) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                  {isLoading && [...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton h-36 rounded-2xl" />
                  ))}
                </div>
              </div>

              {/* Language breakdown */}
              <div>
                <div className="font-mono text-xs text-[#555] mb-4 tracking-wide">LANGUAGE BREAKDOWN</div>
                <div className="rounded-2xl glass border border-white/5 p-6">
                  {stats?.languages ? (
                    <LangBar langs={stats.languages} />
                  ) : (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton h-4 rounded" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile link */}
                <motion.a
                  href="https://github.com/vedantyerne1-art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl glass border border-white/10 hover:border-blue-500/40 font-montreal text-sm text-[#A0A0A0] hover:text-white transition-all"
                  whileHover={{ scale: 1.02 }}
                  data-cursor-label="Open"
                  data-cursor-variant="open"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Full Profile
                </motion.a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
