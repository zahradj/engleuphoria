import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, BookOpen, Target, Trophy, Headphones } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useHeroTheme } from '@/contexts/HeroThemeContext';

const skills = ['Speaking', 'Listening', 'Reading', 'Writing', 'Vocabulary'];
const skillValues = [0.85, 0.7, 0.9, 0.65, 0.8];

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

function SkillRadar({ isDark }: { isDark: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const cx = 100, cy = 100, radius = 75;
  const gridStroke = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const axisStroke = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

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
          points={getPolygonPoints(isInView ? skillValues : Array(5).fill(0), radius, cx, cy)}
          fill="rgba(99,102,241,0.15)"
          stroke="#6366f1"
          strokeWidth="2"
          filter="url(#radarGlow)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {skillValues.map((v, i) => {
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

const FEATURES = [
  {
    icon: Target,
    title: 'Adaptive Learning',
    desc: 'Lessons adjust to your pace, strengths, and weaknesses in real-time.',
    color: 'from-violet-500 to-indigo-600',
    iconBg: 'bg-violet-500/10 text-violet-500',
    span: 'md:col-span-1',
  },
  {
    icon: Headphones,
    title: 'Immersive Audio',
    desc: 'Native-speaker conversations, pronunciation drills, and real-world listening.',
    color: 'from-cyan-500 to-blue-600',
    iconBg: 'bg-cyan-500/10 text-cyan-500',
    span: 'md:col-span-1',
  },
  {
    icon: BookOpen,
    title: 'CEFR-Aligned Curriculum',
    desc: 'Structured progression from A1 to C2 with measurable milestones.',
    color: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-500/10 text-amber-500',
    span: 'md:col-span-1',
  },
  {
    icon: Trophy,
    title: 'Gamified Progress',
    desc: 'XP, streaks, badges, and leaderboards keep motivation high.',
    color: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    span: 'md:col-span-1',
  },
];

const teacherAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export function BentoGridSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const { theme } = useHeroTheme();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const parallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -15]);

  const cardBase = isDark
    ? 'bg-slate-900/60 border border-white/[0.06] hover:border-white/[0.12]'
    : 'bg-white border border-slate-200/60 hover:border-slate-300/80 shadow-sm hover:shadow-lg';

  return (
    <section ref={sectionRef} id="features" className={`relative py-28 px-6 md:px-12 lg:px-24 overflow-hidden scroll-mt-20 transition-colors duration-300 ${
      isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'
    }`}>
      {/* Ambient glow synced with hero */}
      <div
        className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: theme.cssFrom, opacity: isDark ? 0.06 : 0.04 }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: theme.cssTo, opacity: isDark ? 0.06 : 0.04 }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 transition-all duration-700"
            style={{
              background: `linear-gradient(to right, ${theme.cssFrom}15, ${theme.cssTo}15)`,
              color: theme.cssFrom,
              border: `1px solid ${theme.cssFrom}30`,
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            Why Choose Us
          </motion.div>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Why{' '}
            <span
              className="bg-clip-text text-transparent transition-all duration-700"
              style={{ backgroundImage: `linear-gradient(to right, ${theme.cssFrom}, ${theme.cssTo})` }}
            >
              EnglEuphoria
            </span>
            ?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Three specialized programs under one roof — personalized for every age and goal.
          </p>
        </motion.div>

        {/* Top row: 4 feature cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              className={`${cardBase} rounded-2xl p-6 group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-400`}
              variants={itemVariants}
            >
              <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom row: Skill Radar + Mentors + CTA */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Skill Radar */}
          <motion.div
            className={`${cardBase} rounded-2xl p-8 group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-400`}
            variants={itemVariants}
          >
            <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Skill Radar</h3>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Track speaking, writing, listening & more in real-time.
            </p>
            <SkillRadar isDark={isDark} />
          </motion.div>

          {/* Top 3% Mentors */}
          <motion.div
            className={`${cardBase} rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-400`}
            variants={itemVariants}
          >
            <div className="flex -space-x-3 mb-5">
              {teacherAvatars.map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt="Teacher"
                  className={`w-12 h-12 rounded-full border-2 object-cover grayscale hover:grayscale-0 transition-all duration-500 ${isDark ? 'border-[#09090B]' : 'border-[#FAFAFA]'}`}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                />
              ))}
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isDark ? 'border-[#09090B] bg-amber-500/20 text-amber-400' : 'border-[#FAFAFA] bg-amber-50 text-amber-600'}`}>
                +50
              </div>
            </div>
            <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Top 3% Mentors</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Handpicked. Certified. Passionate about teaching.</p>
          </motion.div>

          {/* CTA Card — synced with hero */}
          <motion.div
            className="rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${theme.cssFrom}, ${theme.cssTo})`,
              y: parallaxSlow,
            }}
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-2">Start Your Free Trial</h3>
              <p className="text-white/70 text-sm mb-6">No credit card required • 7 days free</p>
              <Link
                to="/student-signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-lg group/btn"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
