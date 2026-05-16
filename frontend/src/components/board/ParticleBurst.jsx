import { useEffect, useRef } from 'react';

function useParticles(canvasRef, season, isDark) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    let animId;
    let particles = [];

    const configs = {
      todo: {
        count: 24, duration: 2500, emoji: '🌸',
        spawn: () => ({ x: W * (0.1 + Math.random() * 0.8), y: 20 }),
        update: (p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotSpeed;
          p.opacity -= 1 / (p.duration / 16);
        },
        init: () => ({
          vx: 0.8 + Math.random() * 1.2,
          vy: 1.2 + Math.random() * 1.5,
          rotation: Math.random() * 360,
          rotSpeed: 2 + Math.random() * 3,
          size: 10 + Math.random() * 8,
          opacity: isDark ? 0.22 : 0.18,
          duration: 2200 + Math.random() * 800,
        }),
      },
      inprogress: {
        count: 16, duration: 2200, emoji: '✨',
        spawn: () => ({ x: W * (0.1 + Math.random() * 0.8), y: 20 + Math.random() * (H * 0.3) }),
        update: (p) => {
          p.time += 0.02;
          p.x += Math.sin(p.time) * 0.8;
          p.y += Math.sin(p.time * 0.5) * 0.3;
          p.glowPhase += 0.05;
          p.opacity = (isDark ? 0.22 : 0.18) * (0.5 + 0.5 * Math.sin(p.glowPhase));
        },
        init: () => ({
          time: Math.random() * Math.PI * 2,
          glowPhase: Math.random() * Math.PI * 2,
          size: 4 + Math.random() * 4,
          opacity: isDark ? 0.22 : 0.18,
          duration: 1800 + Math.random() * 700,
          vx: 0, vy: 0,
          rotation: 0, rotSpeed: 0,
        }),
      },
      review: {
        count: 22, duration: 2500, emoji: '🍁',
        spawn: () => ({ x: W * (0.1 + Math.random() * 0.8), y: 20 }),
        update: (p) => {
          p.time += 0.03;
          p.x += p.vx + Math.sin(p.time) * 0.8;
          p.y += p.vy;
          p.rotation += p.rotSpeed;
          p.opacity -= 1 / (p.duration / 16);
        },
        init: () => ({
          vx: -(0.5 + Math.random() * 1),
          vy: 1 + Math.random() * 1.5,
          rotation: Math.random() * 360,
          rotSpeed: 3 + Math.random() * 4,
          size: 10 + Math.random() * 8,
          opacity: isDark ? 0.22 : 0.18,
          duration: 2200 + Math.random() * 800,
          time: Math.random() * Math.PI * 2,
        }),
      },
      done: {
        count: 26, duration: 2600, emoji: '❄️',
        spawn: () => ({ x: W * (0.1 + Math.random() * 0.8), y: 20 }),
        update: (p) => {
          p.time += 0.02;
          p.x += Math.sin(p.time) * 0.5;
          p.y += p.vy;
          p.opacity -= 1 / (p.duration / 16);
        },
        init: () => ({
          vx: 0,
          vy: 0.6 + Math.random() * 0.8,
          rotation: Math.random() * 360,
          rotSpeed: 0,
          size: 8 + Math.random() * 8,
          opacity: isDark ? 0.22 : 0.18,
          duration: 2300 + Math.random() * 800,
          time: Math.random() * Math.PI * 2,
        }),
      },
    };

    const cfg = configs[season] || configs.todo;

    for (let i = 0; i < cfg.count; i++) {
      const pos = cfg.spawn();
      particles.push({
        ...pos,
        ...cfg.init(),
        delay: Math.random() * 3000,
        elapsed: 0,
        started: false,
      });
    }

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, W, H);

      particles = particles.filter(p => p.opacity > 0.01 && p.y < H + 20);

      particles.forEach(p => {
        if (!p.startTime) p.startTime = timestamp + p.delay;
        if (timestamp < p.startTime) return;
        if (!p.started) { p.started = true; }

        p.elapsed = timestamp - p.startTime;
        if (p.elapsed > cfg.duration) {
          p.opacity = 0;
          return;
        }
        cfg.update(p);

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.font = `${p.size}px serif`;
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillText(cfg.emoji, -p.size / 2, p.size / 2);
        ctx.restore();
      });

      if (particles.length > 0) {
        animId = requestAnimationFrame(draw);
      }
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [canvasRef, season, isDark]);
}

export default function ParticleBurst({ season, isDark, containerRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef?.current || !canvasRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasRef.current.width = rect.width * dpr;
    canvasRef.current.height = rect.height * dpr;
    canvasRef.current.getContext('2d')?.scale(dpr, dpr);
  }, [containerRef]);

  useParticles(canvasRef, season, isDark);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
