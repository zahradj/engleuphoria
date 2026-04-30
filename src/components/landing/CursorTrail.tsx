import React, { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

const MAX_PARTICLES = 120;

/** Playground yellow-orange palette for cursor trail particles. */
function getBrandColors(): string[] {
  return [
    "#FE6A2F", // Playground primary orange
    "#F59E0B", // Amber
    "#FBBF24", // Yellow-400
    "#F97316", // Orange-500
    "#FDBA74", // Orange-300 (softer glow)
  ];
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const brandColors = useRef<string[]>([]);
  const rafId = useRef<number>(0);

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  useEffect(() => {
    // Read brand colors once on mount (they adapt to dark/light mode)
    brandColors.current = getBrandColors();

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        if (particles.current.length >= MAX_PARTICLES) {
          particles.current.shift();
        }
        const maxLife = 30 + Math.random() * 15;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.5,
          size: 3 + Math.random() * 3.5,
          life: maxLife,
          maxLife,
          color: brandColors.current[Math.floor(Math.random() * brandColors.current.length)],
        });
      }
    };

    window.addEventListener("mousemove", onMove);

    const loop = () => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, c.width, c.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.size *= 0.97;

        if (p.life <= 0 || p.size < 0.3) {
          particles.current.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [resize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      aria-hidden="true"
    />
  );
}
