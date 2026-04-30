import React, { useEffect, useRef, useCallback } from "react";
import { useHeroTheme, GROUP_THEMES } from "@/contexts/HeroThemeContext";

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

/** Map each hero theme index to a matching color palette. */
const THEME_PALETTES: string[][] = [
  // Kids / Playground — Yellow-Orange
  ["#FF9F1C", "#FFBF00", "#F59E0B", "#F97316", "#FBBF24"],
  // Teens / Academy — Purple-Blue
  ["#6366F1", "#A855F7", "#8B5CF6", "#7C3AED", "#818CF8"],
  // Adults / Success Hub — Emerald-Teal
  ["#10B981", "#059669", "#0F766E", "#34D399", "#2DD4BF"],
];

export function CursorTrail() {
  const { activeIndex } = useHeroTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const colorsRef = useRef<string[]>(THEME_PALETTES[0]);
  const rafId = useRef<number>(0);

  // Update the color ref when activeIndex changes — existing particles keep
  // their original color and fade out naturally for a smooth transition.
  useEffect(() => {
    colorsRef.current = THEME_PALETTES[activeIndex] ?? THEME_PALETTES[0];
  }, [activeIndex]);

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        if (particles.current.length >= MAX_PARTICLES) {
          particles.current.shift();
        }
        const maxLife = 30 + Math.random() * 15;
        const palette = colorsRef.current;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.5,
          size: 3 + Math.random() * 3.5,
          life: maxLife,
          maxLife,
          color: palette[Math.floor(Math.random() * palette.length)],
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
