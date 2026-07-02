'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TIMELINE = [
  {
    type: 'work',
    period: 'July 2025 – August 2025',
    title: 'Deloitte Data Analytics',
    subtitle: 'Virtual Internship',
    description:
      'Built Tableau dashboards, performed forensic Excel analytics, solved business intelligence problems, and developed data-driven decision systems for enterprise clients.',
    tags: ['Tableau', 'Excel', 'BI', 'Analytics'],
    color: '#06B6D4',
    icon: '📊',
  },
  {
    type: 'work',
    period: 'June 2025 – July 2025',
    title: 'Database Designer Intern',
    subtitle: 'Nagpur, Maharashtra',
    description:
      'Designed normalized relational database schemas, built policy & claims systems with high-performance query optimization. Advanced indexing strategies and reporting systems for actuarial teams.',
    tags: ['PostgreSQL', 'Schema Design', 'Query Optimization', 'Indexing'],
    color: '#3B82F6',
    icon: '🗄️',
  },
  {
    type: 'edu',
    period: '2023 – 2027',
    title: 'Yeshwantrao Chavan College of Engineering',
    subtitle: 'B.Tech CSE-IoT · Minor in AI & ML · Nagpur',
    description:
      'Pursuing Bachelor of Technology in Computer Science with specialization in Internet of Things. Minor in Artificial Intelligence & Machine Learning. Building AI-powered systems, IoT platforms, and full-stack applications.',
    tags: ['IoT', 'AI/ML', 'Full Stack', 'Computer Science'],
    color: '#8B5CF6',
    icon: '🎓',
  },
  {
    type: 'edu',
    period: '2021 – 2023',
    title: 'Dr. Babasaheb Ambedkar Junior College',
    subtitle: 'HSC Science',
    description:
      'Higher Secondary Certificate in Science stream. Built foundational knowledge in mathematics, physics, and computer science.',
    tags: ['Science', 'Mathematics', 'Physics'],
    color: '#F59E0B',
    icon: '📚',
  },
];

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="timeline" className="section" ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.p className="overline mb-4" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
          07 / Journey
        </motion.p>
        <motion.h2
          className="section-title text-white mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          Experience &{' '}
          <span className="gradient-text">Education</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Animated vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px overflow-hidden">
            <motion.div
              className="w-full"
              style={{
                background: 'linear-gradient(to bottom, transparent, #3B82F6 10%, #8B5CF6 50%, #EC4899 90%, transparent)',
              }}
              initial={{ height: 0 }}
              animate={isInView ? { height: '100%' } : { height: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-12">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                className={`relative flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-0 pl-16 md:pl-0`}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.15 }}
              >
                {/* Node dot */}
                <div
                  className={`absolute left-[22px] md:left-1/2 top-6 -translate-y-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10`}
                  style={{
                    borderColor: item.color,
                    backgroundColor: '#0A0A0A',
                    boxShadow: `0 0 12px ${item.color}60`,
                  }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                </div>

                {/* Content card */}
                <div className={`md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <motion.div
                    className="rounded-2xl glass border border-white/5 p-6 hover:border-white/15 transition-all duration-300"
                    whileHover={{ y: -4 }}
                    style={{
                      borderLeftColor: item.color,
                      borderLeftWidth: '2px',
                    }}
                  >
                    {/* Type badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="flex items-center gap-2 text-2xl"
                        title={item.type === 'work' ? 'Work Experience' : 'Education'}
                      >
                        {item.icon}
                      </span>
                      <span className="font-mono text-[10px] text-[#555] tracking-widest">
                        {item.period}
                      </span>
                    </div>

                    <h3 className="font-clash font-bold text-lg text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs mb-4" style={{ color: item.color }}>
                      {item.subtitle}
                    </p>
                    <p className="font-montreal text-[#A0A0A0] text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
