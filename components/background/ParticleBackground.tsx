'use client';

import { useEffect, useRef } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface Orb {
  x: number;
  y: number;
  tx: number;   // target x (home position)
  ty: number;   // target y
  vx: number;
  vy: number;
  radius: number;
  r: number; g: number; b: number;  // base colour
  phase: number;          // time offset for pulsing
  speed: number;          // drift speed
}

interface Star {
  x: number; y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ParticleBackground() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const mouseRef    = useRef({ x: -2000, y: -2000, rx: -2000, ry: -2000 }); // rx/ry = raw viewport coords
  const orbsRef     = useRef<Orb[]>([]);
  const starsRef    = useRef<Star[]>([]);
  const timeRef     = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    /* ── Canvas size (viewport only — fixed position handles scroll) ── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      buildOrbs();
      buildStars();
    };

    /* ── Floating gradient orbs ── */
    const ORB_DATA: [number, number, number, number, number][] = [
      // rx%, ry%,  radius%,  R,  G,  B
      [  20,  25,    38,    59, 130, 246 ],   // blue
      [  75,  15,    30,   139,  92, 246 ],   // violet
      [  50,  60,    42,    99, 102, 241 ],   // indigo
      [  10,  70,    26,     6, 182, 212 ],   // cyan
      [  85,  75,    32,   168,  85, 247 ],   // purple
      [  60,  40,    20,    59, 130, 246 ],   // blue accent
    ];

    const buildOrbs = () => {
      orbsRef.current = ORB_DATA.map(([rx, ry, rr, R, G, B]) => {
        const x = (rx / 100) * canvas.width;
        const y = (ry / 100) * canvas.height;
        return {
          x, y, tx: x, ty: y,
          vx: 0, vy: 0,
          radius: (rr / 100) * Math.min(canvas.width, canvas.height),
          r: R, g: G, b: B,
          phase: Math.random() * Math.PI * 2,
          speed: 0.18 + Math.random() * 0.12,
        };
      });
    };

    /* ── Background stars ── */
    const buildStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      starsRef.current = Array.from({ length: Math.min(count, 220) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.55 + 0.05,
        twinkleSpeed: 0.005 + Math.random() * 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    /* ── Mouse tracking ── */
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.rx = e.clientX;
      mouseRef.current.ry = e.clientY;
      // canvas is fixed so no scroll offset needed
      mouseRef.current.x  = e.clientX;
      mouseRef.current.y  = e.clientY;
    };

    /* ── Main render loop ── */
    const draw = () => {
      timeRef.current += 0.008;
      const t    = timeRef.current;
      const W    = canvas.width;
      const H    = canvas.height;
      const mx   = mouseRef.current.x;
      const my   = mouseRef.current.y;

      /* 1. Clear */
      ctx.clearRect(0, 0, W, H);

      /* 2. Deep base gradient (static — dark space feel) */
      const base = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.5, W * 0.9);
      base.addColorStop(0,   'rgba(10, 8, 25, 0.0)');
      base.addColorStop(1,   'rgba(2,  2, 10, 0.0)');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      /* 3. Floating aurora orbs */
      ctx.globalCompositeOperation = 'screen';
      orbsRef.current.forEach((orb, i) => {
        // Gentle autonomous drift (Lissajous-style)
        const driftX = Math.sin(t * orb.speed + orb.phase)         * W  * 0.04;
        const driftY = Math.cos(t * orb.speed * 0.7 + orb.phase + 1) * H * 0.04;
        const homeX  = orb.tx + driftX;
        const homeY  = orb.ty + driftY;

        // Mouse attraction — orbs gently pull toward cursor
        const mdx   = mx - orb.x;
        const mdy   = my - orb.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
        const attraction = Math.min(220 / mdist, 1.0) * 0.018;
        orb.vx += mdx * attraction * 0.001;
        orb.vy += mdy * attraction * 0.001;

        // Spring back toward home
        orb.vx += (homeX - orb.x) * 0.012;
        orb.vy += (homeY - orb.y) * 0.012;

        // Damping
        orb.vx *= 0.88;
        orb.vy *= 0.88;

        orb.x += orb.vx;
        orb.y += orb.vy;

        // Pulsing radius
        const pulse  = 1 + Math.sin(t * 0.7 + orb.phase) * 0.12;
        const radius = orb.radius * pulse;

        // Draw radial gradient blob
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, radius);
        const alpha1 = 0.22 + Math.sin(t * 0.5 + orb.phase) * 0.06;
        const alpha2 = 0.07;
        grad.addColorStop(0,   `rgba(${orb.r}, ${orb.g}, ${orb.b}, ${alpha1})`);
        grad.addColorStop(0.5, `rgba(${orb.r}, ${orb.g}, ${orb.b}, ${alpha2})`);
        grad.addColorStop(1,   `rgba(${orb.r}, ${orb.g}, ${orb.b}, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';

      /* 4. Cursor spotlight — smooth glow that follows mouse exactly */
      if (mx > -1000) {
        // Outer halo
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
        halo.addColorStop(0,   'rgba(99,  102, 241, 0.10)');
        halo.addColorStop(0.4, 'rgba(59,  130, 246, 0.06)');
        halo.addColorStop(1,   'rgba(139,  92, 246, 0.00)');
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        ctx.arc(mx, my, 280, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Sharp inner core
        const core = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
        core.addColorStop(0,   'rgba(180, 200, 255, 0.18)');
        core.addColorStop(0.5, 'rgba(99,  102, 241, 0.08)');
        core.addColorStop(1,   'rgba(99,  102, 241, 0.00)');
        ctx.beginPath();
        ctx.arc(mx, my, 60, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }

      /* 5. Twinkling stars */
      ctx.globalCompositeOperation = 'screen';
      starsRef.current.forEach(s => {
        s.twinklePhase += s.twinkleSpeed;
        const op = s.opacity * (0.55 + Math.sin(s.twinklePhase) * 0.45);

        // Repel slightly from mouse
        const sdx  = s.x - mx;
        const sdy  = s.y - my;
        const sdist= Math.sqrt(sdx * sdx + sdy * sdy);
        const rx   = sdist < 90 ? s.x + (sdx / sdist) * (90 - sdist) * 0.015 : s.x;
        const ry   = sdist < 90 ? s.y + (sdy / sdist) * (90 - sdist) * 0.015 : s.y;

        // Draw star dot
        ctx.beginPath();
        ctx.arc(rx, ry, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${op})`;
        ctx.fill();

        // Tiny cross sparkle on bigger stars
        if (s.size > 0.9) {
          const arm = s.size * 2.5;
          ctx.strokeStyle = `rgba(200, 215, 255, ${op * 0.5})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(rx - arm, ry); ctx.lineTo(rx + arm, ry);
          ctx.moveTo(rx, ry - arm); ctx.lineTo(rx, ry + arm);
          ctx.stroke();
        }
      });
      ctx.globalCompositeOperation = 'source-over';

      /* 6. Subtle horizontal scan-line texture for depth */
      ctx.globalAlpha = 0.018;
      ctx.fillStyle   = 'rgba(255,255,255,1)';
      for (let y = 0; y < H; y += 4) {
        ctx.fillRect(0, y, W, 1);
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize',    resize);
    window.addEventListener('mousemove', onMouseMove);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width:  '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
