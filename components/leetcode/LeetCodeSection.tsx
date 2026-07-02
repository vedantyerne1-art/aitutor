'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLeetCode } from '@/hooks/useLeetCode';

function DonutChart({
  solved,
  total,
  color,
  label,
  size = 80,
}: {
  solved: number;
  total: number;
  color: string;
  label: string;
  size?: number;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const isInView = useInView(ref as any, { once: true });
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? solved / total : 0;
  const offset = circ * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
          <motion.circle
            ref={ref}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circ }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-clash font-bold text-lg text-white">{solved}</span>
        </div>
      </div>
      <span className="font-mono text-[10px] tracking-wide" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function SubmissionCalendar({ calendar }: { calendar: Record<string, number> }) {
  const now = Math.floor(Date.now() / 1000);
  const weeks = 20;
  const days = 7;
  const cells = [];

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < days; d++) {
      const ts = now - ((w * 7 + (days - 1 - d)) * 86400);
      const count = calendar[String(ts)] || 0;
      const intensity = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : 3;
      cells.push({ ts, intensity, count });
    }
  }

  const colors = ['rgba(255,255,255,0.04)', 'rgba(59,130,246,0.3)', 'rgba(59,130,246,0.6)', '#3B82F6'];

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${days}, minmax(0, 1fr))`,
        gridAutoFlow: 'column',
      }}
    >
      {cells.map((cell, i) => (
        <div
          key={i}
          title={`${cell.count} submissions`}
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: colors[cell.intensity] }}
        />
      ))}
    </div>
  );
}

export default function LeetCodeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { stats, isLoading } = useLeetCode();

  return (
    <section id="leetcode" className="section" ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.p className="overline mb-4" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
          06 / Problem Solving
        </motion.p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.h2
            className="section-title text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            LeetCode{' '}
            <span className="gradient-text">Stats</span>
          </motion.h2>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-amber-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-mono text-xs text-[#555]">
              @Vedant_2409 · Live data
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Donut charts */}
          <motion.div
            className="rounded-3xl glass border border-white/5 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col items-center gap-8">
              {/* Main total */}
              <div className="relative">
                <svg width={160} height={160} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={80} cy={80} r={64} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
                  <motion.circle
                    cx={80}
                    cy={80}
                    r={64}
                    fill="none"
                    stroke="url(#lc-gradient)"
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 64}
                    initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                    animate={
                      isInView
                        ? {
                            strokeDashoffset:
                              2 *
                              Math.PI *
                              64 *
                              (1 - (stats?.totalSolved || 0) / (stats?.totalQuestions || 3371)),
                          }
                        : {}
                    }
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <defs>
                    <linearGradient id="lc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-clash font-bold text-4xl text-white">{stats?.totalSolved || '—'}</span>
                  <span className="font-mono text-[10px] text-[#555] tracking-wide">SOLVED</span>
                </div>
              </div>

              {/* Difficulty breakdown */}
              <div className="flex gap-8">
                <DonutChart
                  solved={stats?.easySolved || 0}
                  total={stats?.easyTotal || 835}
                  color="#22C55E"
                  label="EASY"
                  size={80}
                />
                <DonutChart
                  solved={stats?.mediumSolved || 0}
                  total={stats?.mediumTotal || 1761}
                  color="#F59E0B"
                  label="MEDIUM"
                  size={80}
                />
                <DonutChart
                  solved={stats?.hardSolved || 0}
                  total={stats?.hardTotal || 775}
                  color="#EF4444"
                  label="HARD"
                  size={80}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Stats + calendar */}
          <div className="space-y-6">
            {/* Stats cards */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              {[
                { label: 'Global Ranking', value: stats?.ranking ? `#${stats.ranking.toLocaleString()}` : '—', icon: '🏆' },
                { label: 'Acceptance Rate', value: stats?.acceptanceRate ? `${stats.acceptanceRate}%` : '—', icon: '✅' },
                { label: 'Reputation', value: stats?.reputation || 0, icon: '⭐' },
                { label: 'Contributions', value: stats?.contributionPoints || 0, icon: '💡' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl glass border border-white/5 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{s.icon}</span>
                  </div>
                  <div className="font-clash font-bold text-xl text-white">{s.value}</div>
                  <div className="font-mono text-[9px] text-[#555] tracking-wide">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Submission calendar */}
            <motion.div
              className="rounded-2xl glass border border-white/5 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <div className="font-mono text-[10px] text-[#555] tracking-wide mb-4">SUBMISSION ACTIVITY</div>
              {stats?.submissionCalendar ? (
                <SubmissionCalendar calendar={stats.submissionCalendar} />
              ) : (
                <div className="h-24 skeleton rounded-lg" />
              )}
            </motion.div>

            {/* Recent submissions */}
            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 && (
              <motion.div
                className="rounded-2xl glass border border-white/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <div className="font-mono text-[10px] text-[#555] tracking-wide mb-4">RECENT ACCEPTED</div>
                <div className="space-y-2">
                  {stats.recentSubmissions.slice(0, 4).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between">
                      <span className="font-montreal text-xs text-[#A0A0A0] truncate max-w-[200px]">
                        {sub.title}
                      </span>
                      <span className="font-mono text-[10px] text-[#555] flex-shrink-0 ml-2">
                        {sub.lang}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
