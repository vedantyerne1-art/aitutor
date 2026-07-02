'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

import { PROJECTS } from '@/lib/data';

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mx', `${x}%`);
    ref.current.style.setProperty('--my', `${y}%`);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative flex flex-col flex-shrink-0 w-[min(85vw,480px)] min-h-[500px] rounded-[2rem] glass overflow-hidden border ${project.border} group transition-all duration-700 hover:shadow-2xl`}
      style={{
        background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), ${project.color}15, transparent 50%), #0A0A0A`,
        boxShadow: hovered ? `0 20px 40px -10px ${project.color}20` : 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.01 }}
      data-cursor-label="View"
      data-cursor-variant="view"
    >
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" style={{ padding: '1px', background: `linear-gradient(135deg, ${project.color}, transparent, ${project.color})`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

      {/* Card number */}
      <div className="px-8 pt-8 flex justify-between items-start">
        <span className="font-clash text-5xl font-bold text-white/10 group-hover:text-white/20 transition-colors duration-500">{project.number}</span>
        <span className="tag px-3 py-1 shadow-sm" style={{ backgroundColor: project.color + '10' }}>{project.year}</span>
      </div>

      {/* Preview area — abstract UI block */}
      <div className={`mx-8 mt-6 h-40 rounded-2xl bg-gradient-to-br ${project.gradient} border border-white/5 flex flex-col justify-center overflow-hidden relative shadow-inner`}>
        <motion.div
          className="absolute inset-0"
          animate={hovered ? { opacity: 1, scale: 1.1 } : { opacity: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${project.color}40, transparent 70%)`,
          }}
        />
        {/* Abstract code visualization */}
        <div className="font-mono text-xs text-white/40 px-6 select-none relative z-10 transition-transform duration-500 group-hover:translate-x-2">
          <div style={{ color: project.color }} className="font-bold">// {project.category}</div>
          <div className="mt-2 text-white/20">import {'{'} Architecture, AI {'}'}</div>
          <div className="text-white/20">from &apos;future.systems&apos;</div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pt-8 pb-10 flex flex-col flex-grow">
        <h3 className="font-clash font-bold text-2xl text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-500">
          {project.title}
        </h3>
        <p className="font-montreal text-[#A0A0A0] text-sm leading-relaxed mb-8 flex-grow">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.stack.map((tech) => (
            <span key={tech} className="tag text-[10px]" style={{ borderColor: project.color + '30', color: project.color }}>
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-3 font-montreal text-sm font-medium group/btn"
            style={{ color: project.color }}
            data-cursor-label="Open"
            data-cursor-variant="open"
          >
            <span className="relative overflow-hidden">
              <span className="block group-hover/btn:-translate-y-full transition-transform duration-300">View Case Study</span>
              <span className="block absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300">View Case Study</span>
            </span>
            <motion.span
              animate={hovered ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg"
            >
              →
            </motion.span>
          </Link>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -rotate-45 group-hover:rotate-0" style={{ backgroundColor: project.color + '20' }}>
            <span style={{ color: project.color }}>↗</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="projects" className="section overflow-hidden" ref={ref}>
      {/* Header */}
      <div className="container mb-16">
        <motion.p
          className="overline mb-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          04 / Selected Work
        </motion.p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.h2
            className="section-title text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Featured{' '}
            <span className="gradient-text">Projects</span>
          </motion.h2>
          <motion.p
            className="font-montreal text-[#A0A0A0] text-sm max-w-xs"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Scroll horizontally to explore all projects →
          </motion.p>
        </div>
      </div>

      {/* Horizontal scroll gallery */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 px-[clamp(1.5rem,5vw,5rem)] scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}

        {/* "More projects" card */}
        <motion.div
          className="flex-shrink-0 w-[min(85vw,320px)] rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-4 p-8 glass cursor-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ borderColor: 'rgba(59,130,246,0.3)' }}
          data-cursor-label="Open"
          data-cursor-variant="open"
        >
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-2xl">
            ⚡
          </div>
          <div className="text-center">
            <div className="font-clash font-bold text-white text-xl mb-2">More Projects</div>
            <div className="font-montreal text-[#A0A0A0] text-sm">
              View all repositories on GitHub
            </div>
          </div>
          <a
            href="https://github.com/vedantyerne1-art"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full glass border border-white/10 hover:border-blue-500/50 font-montreal text-sm text-[#A0A0A0] hover:text-white transition-all"
          >
            GitHub ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
