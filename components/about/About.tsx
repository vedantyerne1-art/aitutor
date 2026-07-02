'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import MagneticButton from '@/components/ui/MagneticButton';

const MARQUEE_ITEMS = [
  'AI / ML',
  'Full Stack',
  'IoT Engineering',
  'Database Design',
  'Cloud Computing',
  'Data Analytics',
  'Python',
  'React',
  'FastAPI',
  'Docker',
];

const BIO_TEXT = [
  "I'm Vedant Yerne — a Computer Science student at YCCE Nagpur, pursuing B.Tech in IoT with a minor in AI/ML. I build systems that solve real problems.",
  "My work spans the full stack: from AI-powered healthcare platforms to smart agriculture monitoring systems, from relational database design to cloud-deployed APIs.",
  "Currently interning as a Database Designer where I architect normalized schemas and optimize high-performance query systems for insurance and actuarial teams.",
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const imageRef = useRef<HTMLDivElement>(null);

  // Mouse parallax on image
  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.transform = `perspective(1000px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) scale(1.02)`;
    };
    const handleLeave = () => {
      el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    };
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div
              ref={imageRef}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-sm mx-auto lg:mx-0"
              style={{ transition: 'transform 0.3s ease', cursor: 'none' }}
              data-cursor-label="Vedant"
              data-cursor-variant="drag"
            >
              <Image
                src="/images/vedant.jpg"
                alt="Vedant Yerne"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Glitch overlay effect */}
              <motion.div
                className="absolute inset-0 opacity-0 mix-blend-screen"
                style={{
                  background: 'linear-gradient(90deg, rgba(59,130,246,0.4) 0%, transparent 50%, rgba(139,92,246,0.4) 100%)',
                }}
                animate={{ opacity: [0, 0.15, 0, 0.1, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              />

              {/* Border glow */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: 'inset 0 0 60px rgba(59,130,246,0.2), 0 0 40px rgba(59,130,246,0.15)' }}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-4 -right-4 lg:-right-8 glass rounded-xl p-4 border border-white/10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xl">
                  🎓
                </div>
                <div>
                  <div className="font-clash font-bold text-sm text-white">B.Tech CSE-IoT</div>
                  <div className="font-mono text-[10px] text-[#A0A0A0]">YCCE Nagpur · 2027</div>
                </div>
              </div>
            </motion.div>

            {/* Stats floating card */}
            <motion.div
              className="absolute -top-4 -left-4 lg:-left-8 glass rounded-xl p-3 border border-white/10"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <div className="font-mono text-[10px] text-[#A0A0A0] mb-1">MINOR</div>
              <div className="font-clash font-bold text-sm electric-text">AI & ML</div>
            </motion.div>
          </motion.div>

          {/* Text column */}
          <div className="order-1 lg:order-2">
            <motion.p
              className="overline mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              02 / About Me
            </motion.p>

            <motion.h2
              className="section-title text-white mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              Crafting the{' '}
              <span className="gradient-text">future</span>
              {' '}of intelligent systems
            </motion.h2>

            {BIO_TEXT.map((para, i) => (
              <motion.p
                key={i}
                className="font-montreal text-[#A0A0A0] text-base leading-relaxed mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}

            {/* Quick stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {[
                { label: 'Projects', value: '10+' },
                { label: 'Internships', value: '2' },
                { label: 'Languages', value: '5+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-clash text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="font-mono text-[11px] text-[#555] mt-1 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Contact links */}
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <MagneticButton>
                <a
                  href="https://linkedin.com/in/vedant-yerne-27040628b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-2 px-6 py-3 rounded-full overflow-hidden transition-all duration-500"
                  data-cursor-label="Connect"
                  data-cursor-variant="open"
                >
                  <div className="absolute inset-0 bg-[#0A66C2]/10 border border-[#0A66C2]/30 rounded-full group-hover:bg-[#0A66C2]/20 group-hover:border-[#0A66C2]/60 transition-colors duration-500" />
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(10,102,194,0.4), transparent 70%)',
                    }}
                  />
                  <span className="relative font-montreal font-medium text-[#A0A0A0] group-hover:text-white transition-colors duration-300">
                    LinkedIn ↗
                  </span>
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="https://github.com/vedantyerne1-art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-white/10 hover:border-violet-500/50 text-sm font-montreal text-[#A0A0A0] hover:text-white transition-all duration-500"
                  data-cursor-label="Code"
                  data-cursor-variant="open"
                >
                  GitHub ↗
                </a>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="mt-24 py-6 border-y border-white/5 overflow-hidden">
        <div className="marquee-wrapper">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="marquee-content" aria-hidden={j > 0}>
              {MARQUEE_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-6 font-clash font-bold text-2xl text-white/10 uppercase whitespace-nowrap">
                  {item}
                  <span className="text-blue-500/40">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
