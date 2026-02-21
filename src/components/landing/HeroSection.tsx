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
    cursor: 'playground' as const,
  },
  {
    id: 'teens',
    emoji: '🎧',
    label: 'Academy',
    age: 'Teens',
    glowColorDark: 'rgba(99,102,241,0.4)',
    glowColorLight: 'rgba(67,56,202,0.3)',
    cursor: 'academy' as const,
  },
  {
    id: 'adults',
    emoji: '💼',
    label: 'Professional',
    age: 'Adults',
    glowColorDark: 'rgba(245,158,11,0.4)',
    glowColorLight: 'rgba(217,119,6,0.3)',
    cursor: 'professional' as const,
  },
];

const worldTaglines = [
  { label: 'Playground', text: "Stop 'teaching' them. Let them play their way to fluency." },
  { label: 'Academy', text: "Don't just pass exams. Master the language of the global internet." },
  { label: 'Professional', text: "Your expertise is global. Now, make your voice match your ambition." },
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

/* Film Grain Overlay — uses inline SVG feTurbulence, zero network requests */
function FilmGrain({ isDark }: { isDark: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1] animate-grain"
      style={{ mixBlendMode: 'overlay', opacity: isDark ? 0.035 : 0.025 }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="heroGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroGrain)" />
      </svg>
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

      {/* Film Grain Overlay */}
      <FilmGrain isDark={isDark} />

      {/* Light-mode ink bleed corners */}
      {!isDark && (
        <>
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-40 pointer-events-none bg-sky-300/30" />
          <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full blur-[120px] opacity-30 pointer-events-none bg-emerald-300/25" />
          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full blur-[150px] opacity-35 pointer-events-none bg-orange-200/30" />
          <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full blur-[130px] opacity-25 pointer-events-none bg-violet-300/20" />
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

        {/* Euphoria Ring — breathing glow behind headline */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div
            className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full animate-euphoria-ring"
            style={{
              border: '2px solid transparent',
              background: isDark
                ? 'radial-gradient(circle, transparent 60%, rgba(99,102,241,0.08) 100%)'
                : 'radial-gradient(circle, transparent 60%, rgba(251,191,36,0.06) 100%)',
              boxShadow: isDark
                ? '0 0 60px rgba(99,102,241,0.3), 0 0 120px rgba(139,92,246,0.15), inset 0 0 60px rgba(99,102,241,0.1)'
                : '0 0 60px rgba(251,191,36,0.2), 0 0 120px rgba(52,211,153,0.1), inset 0 0 60px rgba(251,191,36,0.05)',
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
          />
        </div>

        {/* Headline — Full Gradient Clip-Path */}
        <motion.h1
          className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05] bg-clip-text text-transparent animate-gradient-text relative z-10 ${isDark ? 'text-glow' : 'text-ink'}`}
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(90deg, #818cf8, #34d399, #fbbf24, #a78bfa, #818cf8)'
              : 'linear-gradient(90deg, #4f46e5, #059669, #d97706, #7c3aed, #4f46e5)',
            backgroundSize: '200% auto',
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
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-colors duration-300 relative z-10 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The Human-First Academy where language meets intuition.
        </motion.p>

        {/* Glassmorphic Pill Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {portals.map((portal) => (
            <Link
              key={portal.id}
              to="/student-signup"
              data-cursor={portal.cursor}
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

        {/* World Taglines */}
        <motion.div
          className="flex flex-col items-center gap-2 mb-16 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {worldTaglines.map((tagline, i) => (
            <motion.p
              key={tagline.label}
              className={`text-sm italic max-w-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
            >
              <span className={`font-semibold not-italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tagline.label}:</span>{' '}
              {tagline.text}
            </motion.p>
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
