import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Users } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return { ref, count };
}

const portals = [
  {
    id: 'kids',
    emoji: '👶',
    label: 'Playground',
    age: 'Ages 5–12',
    glowColor: 'rgba(16,185,129,0.4)',
    hoverShadow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    borderHover: 'border-emerald-400/40',
  },
  {
    id: 'teens',
    emoji: '🎧',
    label: 'Academy',
    age: 'Teens',
    glowColor: 'rgba(99,102,241,0.4)',
    hoverShadow: 'shadow-[0_0_30px_rgba(99,102,241,0.4)]',
    borderHover: 'border-indigo-400/40',
  },
  {
    id: 'adults',
    emoji: '💼',
    label: 'Professional',
    age: 'Adults',
    glowColor: 'rgba(245,158,11,0.4)',
    hoverShadow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
    borderHover: 'border-amber-400/40',
  },
];

function SocialProofRibbon() {
  const students = useCountUp(2500);
  const countries = useCountUp(30);

  return (
    <motion.div
      className="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl bg-white/[0.04] border border-white/[0.08]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="flex -space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-xs text-white font-bold border-2 border-slate-950">
          <Users className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Globe className="w-4 h-4 text-indigo-400" />
        <span className="text-slate-300">
          <span ref={students.ref} className="text-white font-semibold">{students.count.toLocaleString()}+</span> students from{' '}
          <span ref={countries.ref} className="text-white font-semibold">{countries.count}+</span> countries
        </span>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const orbX = useTransform(mouseX, [-1, 1], [-20, 20]);
  const orbY = useTransform(mouseY, [-1, 1], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center bg-[#09090B] overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] via-slate-950 to-[#09090B]" />

      {/* The Magnetic Orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full blur-[80px] opacity-60 pointer-events-none"
        style={{
          x: orbX,
          y: orbY,
          background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(16,185,129,0.2) 40%, rgba(245,158,11,0.15) 70%, transparent 100%)',
        }}
      />

      {/* Secondary orb glow */}
      <motion.div
        className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full blur-[60px] opacity-40 pointer-events-none"
        style={{
          x: useTransform(mouseX, [-1, 1], [15, -15]),
          y: useTransform(mouseY, [-1, 1], [15, -15]),
          background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(99,102,241,0.15) 60%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-32">
        {/* Headline */}
        <motion.h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-6 leading-[1.05]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Fluency is no longer
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
            a slow process.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet Engleuphoria. The English academy designed for absolute mastery. Choose your world.
        </motion.p>

        {/* Glassmorphic Pill Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {portals.map((portal) => (
            <Link
              key={portal.id}
              to="/student-signup"
              className={`group relative px-8 py-4 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-white font-medium transition-all duration-500 hover:bg-white/[0.08] hover:${portal.borderHover} hover:${portal.hoverShadow}`}
              style={{
                ['--glow-color' as string]: portal.glowColor,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${portal.glowColor}`;
                (e.currentTarget as HTMLElement).style.borderColor = portal.glowColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <span className="text-lg mr-2">{portal.emoji}</span>
              {portal.label}
              <span className="text-slate-500 ml-2 text-sm">({portal.age})</span>
            </Link>
          ))}
        </motion.div>

        {/* Social Proof */}
        <SocialProofRibbon />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs font-medium mb-2">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-1 bg-white/60 rounded-full"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
