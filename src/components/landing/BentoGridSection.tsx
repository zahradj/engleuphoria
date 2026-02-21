import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users } from 'lucide-react';
import { useRef, useState } from 'react';
import { useThemeMode } from '@/hooks/useThemeMode';

const skills = ['Speaking', 'Listening', 'Reading', 'Writing', 'Vocabulary'];
const skillValues = [0.85, 0.7, 0.9, 0.65, 0.8];
const skillValuesHovered = [0.85, 0.7, 0.9, 0.65, 0.95]; // Vocabulary boosted on hover

function getPolygonPoints(values: number[], radius: number, cx: number, cy: number) {
  return values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    return `${cx + v * radius * Math.cos(angle)},${cy + v * radius * Math.sin(angle)}`;
  }).join(' ');
}

function getAxisEnd(index: number, total: number, radius: number, cx: number, cy: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function TimerRing({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r="42"
          fill="none"
          stroke="url(#timerGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 42}
          initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
          whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * 0.08 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
        />
        <defs>
          <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>55</span>
        <span className={`text-xs ml-0.5 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>min</span>
      </div>
    </div>
  );
}

function SkillRadar({ isDark, hovered }: { isDark: boolean; hovered: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const cx = 100, cy = 100, radius = 75;
  const gridStroke = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const axisStroke = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const activeValues = hovered ? skillValuesHovered : skillValues;

  return (
    <div ref={ref} className="flex justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={getPolygonPoints(Array(5).fill(scale), radius, cx, cy)}
            fill="none"
            stroke={gridStroke}
            strokeWidth="1"
          />
        ))}
        {skills.map((_, i) => {
          const end = getAxisEnd(i, 5, radius, cx, cy);
          return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={axisStroke} strokeWidth="1" />;
        })}
        <motion.polygon
          points={getPolygonPoints(isInView ? activeValues : Array(5).fill(0), radius, cx, cy)}
          fill="rgba(99,102,241,0.15)"
          stroke="#6366f1"
          strokeWidth="2"
          filter="url(#radarGlow)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {activeValues.map((v, i) => {
          const end = getAxisEnd(i, 5, (isInView ? v : 0) * radius, cx, cy);
          return (
            <motion.circle
              key={i}
              cx={end.x} cy={end.y} r="3"
              fill={isDark ? 'white' : '#1e293b'}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            />
          );
        })}
        {skills.map((skill, i) => {
          const end = getAxisEnd(i, 5, radius + 18, cx, cy);
          return (
            <text key={skill} x={end.x} y={end.y} textAnchor="middle" dominantBaseline="middle" className={`text-[9px] font-medium ${isDark ? 'fill-slate-500' : 'fill-slate-400'}`}>
              {skill}
            </text>
          );
        })}
        <defs>
          <filter id="radarGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

const teacherAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

// Staggered float durations for each card
const floatDurations = [3.2, 4.0, 3.6, 4.4, 3.8, 4.2, 3.4];

export function BentoGridSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const [radarHovered, setRadarHovered] = useState(false);

  const GLASS = isDark
    ? 'backdrop-blur-xl rounded-[32px]'
    : 'backdrop-blur-xl rounded-[32px]';

  const glassStyle = isDark
    ? { background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }
    : { background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' };

  const HOVER = isDark
    ? 'hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500'
    : 'hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-500';

  const hoverOverlayClass = isDark
    ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-500'
    : 'opacity-0 transition-opacity duration-500';

  return (
    <section id="features" className={`relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden scroll-mt-20 transition-colors duration-300 ${
      isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'
    }`}>
      {/* Subtle ambient blurs */}
      <div className={`absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
      <div className={`absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`} />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-serif tracking-[0.25em] uppercase text-[11px] text-indigo-400/80 mb-4">Why Choose Us</p>
          <h2 className={`font-display text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">EnglEuphoria</span>?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Three specialized schools under one roof, powered by cutting-edge technology
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[220px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Card 1 — The 55-Minute Rule (col-span-2) */}
          <motion.div
            className={`md:col-span-2 ${GLASS} ${HOVER} p-8 group relative overflow-hidden`}
            style={glassStyle}
            variants={itemVariants}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: floatDurations[0], ease: 'easeInOut' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-[32px] ${hoverOverlayClass}`} />
            <div className="relative h-full flex items-center gap-8">
              <TimerRing isDark={isDark} />
              <div>
                <h3 className={`font-display text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>The 55-Minute Rule</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Optimized sessions with built-in buffer times for maximum focus.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — AI Skill Radar (col-span-2, row-span-2) — Interactive */}
          <motion.div
            className={`md:col-span-2 lg:row-span-2 ${GLASS} ${HOVER} p-8 group relative overflow-hidden`}
            style={glassStyle}
            variants={itemVariants}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: floatDurations[1], ease: 'easeInOut' }}
            onMouseEnter={() => setRadarHovered(true)}
            onMouseLeave={() => setRadarHovered(false)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-[32px] ${hoverOverlayClass}`} />
            <div className="relative h-full flex flex-col">
              <h3 className={`font-display text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Skill Radar</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {radarHovered
                  ? 'AI-Adjusted Curriculum: Your path evolves as you do.'
                  : 'Real-time tracking of your vocabulary, grammar, and fluency.'}
              </p>
              <div className="flex-1 flex items-center justify-center">
                <SkillRadar isDark={isDark} hovered={radarHovered} />
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Top 3% Mentors */}
          <motion.div
            className={`${GLASS} ${HOVER} p-6 group relative overflow-hidden`}
            style={glassStyle}
            variants={itemVariants}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: floatDurations[2], ease: 'easeInOut' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[32px] ${hoverOverlayClass}`} />
            {/* Decorative icon */}
            <span className="absolute top-3 right-3 text-lg opacity-30 animate-float pointer-events-none">🌍</span>
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              <div className="flex -space-x-3 mb-4">
                {teacherAvatars.map((src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    alt="Teacher"
                    className={`w-11 h-11 rounded-full border-2 object-cover grayscale hover:grayscale-0 transition-all duration-500 ${isDark ? 'border-[#09090B]' : 'border-[#FAFAFA]'}`}
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  />
                ))}
                <div className={`w-11 h-11 rounded-full bg-amber-500/20 border-2 flex items-center justify-center text-amber-400 text-xs font-bold ${isDark ? 'border-[#09090B]' : 'border-[#FAFAFA]'}`}>
                  +50
                </div>
              </div>
              <h3 className={`font-display text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Top 3% Mentors</h3>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Handpicked. Certified. Passionate.</p>
            </div>
          </motion.div>

          {/* Card 4 — Daily Feed */}
          <motion.div
            className={`${GLASS} ${HOVER} p-6 group relative overflow-hidden`}
            style={glassStyle}
            variants={itemVariants}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: floatDurations[3], ease: 'easeInOut' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-[32px] ${hoverOverlayClass}`} />
            {/* Decorative icon */}
            <span className="absolute bottom-3 left-3 text-lg opacity-25 animate-float-delayed pointer-events-none">🚀</span>
            <div className="relative h-full flex flex-col items-center justify-center">
              <motion.div
                className={`w-28 rounded-xl border p-2 space-y-1.5 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/50'}`}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <div className="rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/20 p-1.5">
                  <div className="w-full h-1 rounded bg-amber-400/40 mb-1" />
                  <div className="w-3/4 h-1 rounded bg-amber-400/20" />
                </div>
                <div className="rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/10 border border-violet-500/20 p-1.5">
                  <div className="w-full h-1 rounded bg-violet-400/40 mb-1" />
                  <div className="w-2/3 h-1 rounded bg-violet-400/20" />
                </div>
              </motion.div>
              <h3 className={`font-display text-sm font-bold mt-3 mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Feed</h3>
              <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>AI-curated challenges</p>
            </div>
          </motion.div>

          {/* Card 5 — Gamified Learning */}
          <motion.div
            className={`${GLASS} ${HOVER} p-6 group relative overflow-hidden`}
            style={glassStyle}
            variants={itemVariants}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: floatDurations[4], ease: 'easeInOut' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-[32px] ${hoverOverlayClass}`} />
            {/* Decorative icon */}
            <span className="absolute top-3 left-3 text-sm opacity-30 animate-float pointer-events-none">🎮</span>
            <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-400/40 animate-bounce-gentle pointer-events-none">XP</span>
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className={`font-display text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Gamified Learning</h3>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>XP, badges & rewards</p>
            </div>
          </motion.div>

          {/* Card 6 — Live Classes */}
          <motion.div
            className={`${GLASS} ${HOVER} p-6 group relative overflow-hidden`}
            style={glassStyle}
            variants={itemVariants}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: floatDurations[5], ease: 'easeInOut' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-[32px] ${hoverOverlayClass}`} />
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className={`font-display text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Classes</h3>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Real-time interaction</p>
            </div>
          </motion.div>

          {/* Card 7 — CTA */}
          <motion.div
            className="md:col-span-2 relative group overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600/80 via-violet-600/80 to-emerald-500/80 p-6 border border-white/10 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]" />
            <div className="relative h-full flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Start Your Free Trial</h3>
                <p className="text-white/70">No credit card required • 7 days free</p>
              </div>
              <Link
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 bg-white rounded-full text-slate-900 font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl group/btn"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
