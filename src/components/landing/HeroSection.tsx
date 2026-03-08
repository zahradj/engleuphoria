import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
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
    glowColorLight: 'rgba(5,150,105,0.25)',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-teal-400',
    gradientBorder: 'linear-gradient(135deg, #10b981, #14b8a6)',
    cursor: 'playground' as const,
  },
  {
    id: 'teens',
    emoji: '🎧',
    label: 'Academy',
    age: 'Teens',
    glowColorDark: 'rgba(99,102,241,0.4)',
    glowColorLight: 'rgba(67,56,202,0.25)',
    accentFrom: 'from-indigo-500',
    accentTo: 'to-violet-400',
    gradientBorder: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    cursor: 'academy' as const,
  },
  {
    id: 'adults',
    emoji: '💼',
    label: 'Professional',
    age: 'Adults',
    glowColorDark: 'rgba(245,158,11,0.4)',
    glowColorLight: 'rgba(217,119,6,0.25)',
    accentFrom: 'from-amber-500',
    accentTo: 'to-orange-400',
    gradientBorder: 'linear-gradient(135deg, #f59e0b, #f97316)',
    cursor: 'professional' as const,
  },
];

const rotatingTaglines = [
  "Stop 'teaching' them. Let them play their way to fluency.",
  "Don't just pass exams. Master the language of the global internet.",
  "Your expertise is global. Now, make your voice match your ambition.",
  "Where language meets intuition — the human-first academy.",
];

/* Animated gradient mesh background for light mode */
function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0]">
      <div className="absolute w-[600px] h-[600px] -top-[200px] -left-[100px] rounded-full blur-[120px] opacity-40 animate-gradient-mesh bg-gradient-to-br from-rose-200 via-fuchsia-100 to-violet-200" />
      <div className="absolute w-[500px] h-[500px] top-[100px] -right-[150px] rounded-full blur-[100px] opacity-35 animate-gradient-mesh bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-200" style={{ animationDelay: '-3s' }} />
      <div className="absolute w-[400px] h-[400px] -bottom-[100px] left-[30%] rounded-full blur-[110px] opacity-30 animate-gradient-mesh bg-gradient-to-br from-amber-200 via-orange-100 to-rose-200" style={{ animationDelay: '-6s' }} />
    </div>
  );
}

/* Animated dot grid background */
function DotGrid({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <svg className="w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotGrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>
    </div>
  );
}

function SocialProofRibbon({ isDark }: { isDark: boolean }) {
  const students = useCountUp(2500);
  const countries = useCountUp(30);

  const avatarGradients = [
    'from-indigo-400 to-violet-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
  ];

  return (
    <motion.div
      className={`inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? 'bg-white/[0.04] border border-white/[0.08]'
          : 'bg-white/80 border border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="flex -space-x-2">
        {avatarGradients.map((gradient, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-[10px] text-white font-bold border-2 ${
              isDark ? 'border-[#09090B]' : 'border-white'
            }`}
          >
            {i === 0 ? <Users className="w-3.5 h-3.5" /> : ['S', 'A', 'M'][i - 1]}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Globe className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
          <span ref={students.ref} className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{students.count.toLocaleString()}+</span> students from{' '}
          <span ref={countries.ref} className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{countries.count}+</span> countries
        </span>
      </div>
    </motion.div>
  );
}

/* Rotating tagline component */
function RotatingTagline({ isDark }: { isDark: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingTaglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[28px] overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className={`text-base md:text-lg italic absolute inset-0 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          "{rotatingTaglines[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
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
    : 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(52,211,153,0.08) 40%, rgba(251,146,60,0.06) 70%, transparent 100%)';

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
          : 'bg-gradient-to-b from-[#FAFAFA] via-white to-[#FAFAFA]'
      }`} />

      {/* Gradient Mesh — Light mode only */}
      {!isDark && <GradientMesh />}

      {/* Dot Grid */}
      <DotGrid isDark={isDark} />

      {/* The Magnetic Orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full blur-[80px] opacity-60 pointer-events-none"
        style={{ x: orbX, y: orbY, background: orbGradient }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-32">

        {/* Headline with text shimmer */}
        <motion.h1
          className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05] relative z-10 ${
            isDark
              ? 'bg-clip-text text-transparent animate-gradient-text text-glow'
              : 'animate-text-shimmer bg-clip-text text-transparent text-ink'
          }`}
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(90deg, #818cf8, #34d399, #fbbf24, #a78bfa, #818cf8)'
              : 'linear-gradient(92deg, #1e293b 0%, #4f46e5 25%, #059669 50%, #d97706 75%, #1e293b 100%)',
            backgroundSize: isDark ? '200% auto' : '300% auto',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Find Your Voice
          <br />
          in a Global World.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed transition-colors duration-300 relative z-10 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The Human-First Academy where language meets intuition.
        </motion.p>

        {/* Rotating Tagline */}
        <motion.div
          className="mb-10 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <RotatingTagline isDark={isDark} />
        </motion.div>

        {/* Enhanced Frosted Glass Portal Cards */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {portals.map((portal) => (
            <motion.div
              key={portal.id}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative rounded-2xl p-[1.5px]"
              style={{
                background: isDark ? 'transparent' : portal.gradientBorder,
              }}
            >
              <Link
                to="/student-signup"
                data-cursor={portal.cursor}
                className={`group relative flex items-center gap-3 px-7 py-4 rounded-2xl backdrop-blur-xl font-medium transition-all duration-500 block ${
                  isDark
                    ? 'bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08]'
                    : 'bg-white/90 text-slate-800 hover:bg-white'
                }`}
                onMouseEnter={(e) => {
                  const color = isDark ? portal.glowColorDark : portal.glowColorLight;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <span className="text-2xl">{portal.emoji}</span>
                <div className="text-left">
                  <span className="font-semibold block">{portal.label}</span>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{portal.age}</span>
                </div>
                {/* Gradient underline on hover */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-3/4 transition-all duration-500 rounded-full bg-gradient-to-r ${portal.accentFrom} ${portal.accentTo}`} />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <div className="relative z-10">
          <SocialProofRibbon isDark={isDark} />
        </div>
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
