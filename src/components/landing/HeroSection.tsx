import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Users } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useThemeMode } from '@/hooks/useThemeMode';

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
    glowColorDark: 'rgba(16,185,129,0.4)',
    glowColorLight: 'rgba(5,150,105,0.3)',
  },
  {
    id: 'teens',
    emoji: '🎧',
    label: 'Academy',
    age: 'Teens',
    glowColorDark: 'rgba(99,102,241,0.4)',
    glowColorLight: 'rgba(67,56,202,0.3)',
  },
  {
    id: 'adults',
    emoji: '💼',
    label: 'Professional',
    age: 'Adults',
    glowColorDark: 'rgba(245,158,11,0.4)',
    glowColorLight: 'rgba(217,119,6,0.3)',
  },
];

function SocialProofRibbon({ isDark }: { isDark: boolean }) {
  const students = useCountUp(2500);
  const countries = useCountUp(30);

  return (
    <motion.div
      className={`inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? 'bg-white/[0.04] border border-white/[0.08]'
          : 'bg-white/70 border border-slate-200 shadow-sm'
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="flex -space-x-2">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-xs text-white font-bold border-2 ${
          isDark ? 'border-[#09090B]' : 'border-[#FAFAFA]'
        }`}>
          <Users className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Globe className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
          <span ref={students.ref} className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{students.count.toLocaleString()}+</span> students from{' '}
          <span ref={countries.ref} className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{countries.count}+</span> countries
        </span>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
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

  const orbGradient = isDark
    ? 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(16,185,129,0.2) 40%, rgba(245,158,11,0.15) 70%, transparent 100%)'
    : 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(52,211,153,0.15) 40%, rgba(251,146,60,0.12) 70%, transparent 100%)';

  const secondaryOrbGradient = isDark
    ? 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(99,102,241,0.15) 60%, transparent 100%)'
    : 'radial-gradient(circle, rgba(251,146,60,0.15) 0%, rgba(56,189,248,0.1) 60%, transparent 100%)';

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'
      }`}
    >
      {/* Ambient background */}
      <div className={`absolute inset-0 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#09090B] via-slate-950 to-[#09090B]'
          : 'bg-gradient-to-b from-[#FAFAFA] via-slate-50 to-[#FAFAFA]'
      }`} />

      {/* Light-mode ink bleed corners */}
      {!isDark && (
        <>
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-40 pointer-events-none bg-sky-300/30" />
          <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full blur-[100px] opacity-30 pointer-events-none bg-emerald-300/25" />
          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full blur-[130px] opacity-35 pointer-events-none bg-orange-200/30" />
        </>
      )}

      {/* The Magnetic Orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full blur-[80px] opacity-60 pointer-events-none"
        style={{
          x: orbX,
          y: orbY,
          background: orbGradient,
        }}
      />

      {/* Secondary orb glow */}
      <motion.div
        className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full blur-[60px] opacity-40 pointer-events-none"
        style={{
          x: useTransform(mouseX, [-1, 1], [15, -15]),
          y: useTransform(mouseY, [-1, 1], [15, -15]),
          background: secondaryOrbGradient,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-32">
        {/* Headline — Kinetic Typography */}
        <motion.h1
          className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05] transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          English Mastery,
          <br />
          <span
            className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent animate-gradient-text"
            style={{ backgroundSize: '200% auto' }}
          >
            Accelerated.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          One platform. Three worlds. Unlimited potential. Welcome to the future of fluency.
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
              className={`group relative px-8 py-4 rounded-full backdrop-blur-xl font-medium transition-all duration-500 ${
                isDark
                  ? 'bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08]'
                  : 'bg-white/70 border border-slate-200 text-slate-800 shadow-sm hover:bg-white/90'
              }`}
              onMouseEnter={(e) => {
                const color = isDark ? portal.glowColorDark : portal.glowColorLight;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${color}`;
                (e.currentTarget as HTMLElement).style.borderColor = color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgb(226,232,240)';
              }}
            >
              <span className="text-lg mr-2">{portal.emoji}</span>
              {portal.label}
              <span className={`ml-2 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>({portal.age})</span>
            </Link>
          ))}
        </motion.div>

        {/* Social Proof */}
        <SocialProofRibbon isDark={isDark} />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center ${isDark ? 'text-white/40' : 'text-slate-400/40'}`}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs font-medium mb-2">Scroll to explore</span>
        <div className={`w-5 h-8 border-2 rounded-full flex justify-center pt-1.5 ${isDark ? 'border-white/20' : 'border-slate-300/40'}`}>
          <motion.div
            className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/60' : 'bg-slate-400/60'}`}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
