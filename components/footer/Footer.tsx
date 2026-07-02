'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

export default function Footer() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end']
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['50%', '0%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);

  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={container} className="relative bg-[#050505] overflow-hidden pt-32 pb-8 border-t border-white/5">
      
      <div className="container relative z-10 flex flex-col min-h-[50vh] justify-between">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <h3 className="font-clash font-bold text-3xl text-white mb-6">Let&apos;s build something extraordinary.</h3>
            <p className="font-montreal text-[#A0A0A0] max-w-sm mb-8">
              Available for freelance opportunities and full-time roles. Open to collaborate on innovative projects.
            </p>
            <a href="mailto:vedantyerne1@gmail.com" className="inline-block px-8 py-4 rounded-full bg-white text-black font-montreal font-medium hover:bg-gray-200 transition-colors" data-cursor-variant="hover">
              vedantyerne1@gmail.com
            </a>
          </div>

          <div className="flex flex-col md:items-end justify-between">
            <div className="flex gap-8 mb-8 md:mb-0">
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[10px] text-[#555] tracking-widest uppercase">Socials</span>
                <MagneticButton>
                  <a href="https://linkedin.com/in/vedant-yerne-27040628b" target="_blank" rel="noopener noreferrer" className="font-montreal text-[#A0A0A0] hover:text-[#0A66C2] transition-colors duration-300" data-cursor-variant="hover">LinkedIn</a>
                </MagneticButton>
                <MagneticButton>
                  <a href="https://github.com/vedantyerne1-art" target="_blank" rel="noopener noreferrer" className="font-montreal text-[#A0A0A0] hover:text-white transition-colors duration-300" data-cursor-variant="hover">GitHub</a>
                </MagneticButton>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[10px] text-[#555] tracking-widest uppercase">Menu</span>
                <a href="#about" className="font-montreal text-[#A0A0A0] hover:text-white transition-colors" data-cursor-variant="hover">About</a>
                <a href="#projects" className="font-montreal text-[#A0A0A0] hover:text-white transition-colors" data-cursor-variant="hover">Work</a>
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <span className="font-mono text-[10px] text-[#555] tracking-widest uppercase block mb-2">Local Time (IST)</span>
              <span className="font-mono text-white text-lg">{time}</span>
            </div>
          </div>
        </div>

        {/* Big Text Overlay */}
        <div className="relative h-[20vh] md:h-[30vh] overflow-hidden flex items-end">
          <motion.h1 
            style={{ y: textY, opacity: textOpacity }}
            className="font-clash font-bold text-[12vw] leading-[0.8] text-[#1a1a1a] whitespace-nowrap tracking-tighter w-full text-center select-none"
          >
            VEDANT YERNE
          </motion.h1>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-8 border-t border-white/5 gap-4">
          <p className="font-mono text-xs text-[#555]">
            © {new Date().getFullYear()} Vedant Yerne. All rights reserved.
          </p>
          
          <button onClick={scrollToTop} className="flex items-center gap-2 font-mono text-xs text-[#A0A0A0] hover:text-white transition-colors" data-cursor-variant="hover">
            BACK TO TOP ↑
          </button>
        </div>

      </div>

    </footer>
  );
}
