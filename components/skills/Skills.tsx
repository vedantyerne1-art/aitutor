'use client';

import { useRef, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';

const SkillOrb = dynamic(() => import('./SkillOrb'), { ssr: false });

const SKILLS = [
  { name: 'Python', color: '#3776AB', category: 'Languages' },
  { name: 'Java', color: '#ED8B00', category: 'Languages' },
  { name: 'JavaScript', color: '#F7DF1E', category: 'Languages' },
  { name: 'TypeScript', color: '#3178C6', category: 'Languages' },
  { name: 'SQL', color: '#336791', category: 'Languages' },
  { name: 'React', color: '#61DAFB', category: 'Frontend' },
  { name: 'Next.js', color: '#FFFFFF', category: 'Frontend' },
  { name: 'Node.js', color: '#339933', category: 'Backend' },
  { name: 'Flask', color: '#FFFFFF', category: 'Backend' },
  { name: 'FastAPI', color: '#009688', category: 'Backend' },
  { name: 'Docker', color: '#2496ED', category: 'DevOps' },
  { name: 'GitHub', color: '#FFFFFF', category: 'DevOps' },
  { name: 'GCP', color: '#4285F4', category: 'Cloud' },
  { name: 'ML', color: '#FF6F00', category: 'AI/ML' },
  { name: 'IoT', color: '#00BCD4', category: 'IoT' },
];

const CATEGORIES = ['Languages', 'Frontend', 'Backend', 'DevOps', 'Cloud', 'AI/ML', 'IoT'];

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.p
            className="overline mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            03 / Technical Arsenal
          </motion.p>
          <motion.h2
            className="section-title text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Skills &{' '}
            <span className="gradient-text">Technologies</span>
          </motion.h2>
          <motion.p
            className="font-montreal text-[#A0A0A0] mt-4 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Drag to explore. Hover to inspect. The orbital sphere contains every tool in my stack.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 3D Orbital Sphere */}
          <motion.div
            className="h-[500px] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                </div>
              }
            >
              <SkillOrb skills={SKILLS} />
            </Suspense>

            {/* Drag hint */}
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[10px] text-[#555] tracking-widest"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>DRAG</span>
              <span>•</span>
              <span>ROTATE</span>
            </motion.div>
          </motion.div>

          {/* Skill category grid */}
          <div className="space-y-6">
            {CATEGORIES.map((category, catI) => {
              const catSkills = SKILLS.filter((s) => s.category === category);
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + catI * 0.08 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-px h-4 bg-gradient-to-b from-blue-500 to-violet-500" />
                    <span className="font-mono text-[10px] text-[#555] tracking-widest uppercase">
                      {category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/5 hover:border-white/20 transition-all duration-300 group cursor-none"
                        whileHover={{ scale: 1.05, y: -2 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.3 + catI * 0.08 + i * 0.04 }}
                        data-cursor-variant="hover"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: skill.color, boxShadow: `0 0 6px ${skill.color}80` }}
                        />
                        <span className="font-montreal text-sm text-[#A0A0A0] group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
