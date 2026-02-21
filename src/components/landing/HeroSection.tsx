import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Rocket, Briefcase, Globe, Users, Star, Zap } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

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
    title: 'The Playground',
    subtitle: 'Ages 4–10',
    tagline: 'Where English feels like play.',
    description: 'Playful learning adventures with games, songs, and colorful activities.',
    cta: 'Claim Your Free Assessment',
    link: '/student-signup',
    icon: Sparkles,
    gradientBg: 'from-amber-400/20 via-lime-300/10 to-emerald-400/20',
    ctaGradient: 'from-amber-500 to-emerald-500',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    borderHover: 'border-emerald-400/30',
    floatingElements: ['⭐', '🚀', '🔤', '🌟', '✨'],
  },
  {
    id: 'teens',
    title: 'The Academy',
    subtitle: 'Ages 11–17',
    tagline: 'Own your future. Speak with confidence.',
    description: 'Level up your English with interactive challenges and real-world skills.',
    cta: 'Claim Your Free Assessment',
    link: '/student-signup',
    icon: Rocket,
    gradientBg: 'from-violet-500/20 via-purple-400/10 to-indigo-500/20',
    ctaGradient: 'from-violet-600 to-indigo-500',
    iconBg: 'bg-violet-500/20 text-violet-400',
    borderHover: 'border-violet-400/30',
    floatingElements: [],
  },
  {
    id: 'adults',
    title: 'The Professional',
    subtitle: 'Ages 18+',
    tagline: 'Master the language of leadership.',
    description: 'Master business English and advance your career with executive-level coaching.',
    cta: 'Claim Your Free Assessment',
    link: '/signup',
    icon: Briefcase,
    gradientBg: 'from-slate-400/10 via-slate-300/5 to-amber-300/10',
    ctaGradient: 'from-slate-700 to-slate-900',
    iconBg: 'bg-amber-500/20 text-amber-400',
    borderHover: 'border-amber-400/30',
    floatingElements: [],
  },
];

function FloatingKidsElements() {
  const elements = ['⭐', '🚀', '🔤', '🌟', '✨', '📚'];
  return (
    <>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl md:text-3xl opacity-40 pointer-events-none select-none"
          style={{
            top: `${15 + (i * 14) % 70}%`,
            left: `${10 + (i * 23) % 80}%`,
          }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        >
          {el}
        </motion.span>
      ))}
    </>
  );
}

function XPBar() {
  return (
    <div className="absolute bottom-16 left-6 right-6 opacity-40 pointer-events-none">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-3 h-3 text-violet-400" />
        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Level 12 — XP</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
          initial={{ width: '0%' }}
          whileInView={{ width: '72%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
    </div>
  );
}

function MotionLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-violet-400 to-transparent"
          style={{
            top: `${20 + i * 15}%`,
            left: '-20%',
            width: '60%',
            rotate: `${-15 + i * 5}deg`,
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}

function SocialProofRibbon() {
  const students = useCountUp(2500);
  const countries = useCountUp(30);

  return (
    <motion.div
      className="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="flex -space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs text-white font-bold border-2 border-slate-950">
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
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);

  return (
    <section className="relative pt-32 pb-12 md:pb-0 bg-slate-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Headline */}
        <motion.div
          className="text-center mb-12 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6">
            Learn English.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Your Way.
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Three specialized schools under one roof — from playful kids' adventures to professional business mastery.
          </p>
          <SocialProofRibbon />
        </motion.div>

        {/* Tri-Portal Panels — Desktop: expanding flex row, Mobile: stacked cards */}
        <div className="hidden md:flex min-h-[70vh] gap-3 lg:gap-4 max-w-7xl mx-auto">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            const isHovered = hoveredPortal === portal.id;
            const hasHover = hoveredPortal !== null;

            return (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                onMouseEnter={() => setHoveredPortal(portal.id)}
                onMouseLeave={() => setHoveredPortal(null)}
                className={`relative rounded-3xl backdrop-blur-xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-700 ease-out ${
                  isHovered ? `flex-[2.5] ${portal.borderHover} shadow-2xl` : hasHover ? 'flex-[0.8]' : 'flex-1'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradientBg} transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-40'}`} />

                {/* Glassmorphic overlay for Professional */}
                {portal.id === 'adults' && (
                  <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl" />
                )}

                {/* Floating elements for Kids */}
                {portal.id === 'kids' && <FloatingKidsElements />}

                {/* Motion lines for Teens */}
                {portal.id === 'teens' && <MotionLines />}

                {/* XP bar for Teens */}
                {portal.id === 'teens' && <XPBar />}

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-10">
                  <div>
                    <div className={`inline-flex p-3 rounded-2xl ${portal.iconBg} mb-6`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1">
                      {portal.title}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mb-3">{portal.subtitle}</p>

                    {/* Tagline — only prominent when hovered or no hover state */}
                    <motion.p
                      className={`text-lg font-medium mb-4 transition-all duration-500 ${
                        portal.id === 'adults' ? 'font-serif italic text-slate-200' : 'text-white/80'
                      }`}
                      animate={{ opacity: isHovered || !hasHover ? 1 : 0.5 }}
                    >
                      {portal.tagline}
                    </motion.p>

                    {/* Description — visible when expanded */}
                    <motion.p
                      className="text-slate-300/80 text-sm leading-relaxed"
                      animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {portal.description}
                    </motion.p>
                  </div>

                  {/* CTA */}
                  <motion.div
                    animate={{ opacity: isHovered || !hasHover ? 1 : 0.4 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link
                      to={portal.link}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${portal.ctaGradient} text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110`}
                    >
                      {portal.cta}
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: Stacked portal cards */}
        <div className="md:hidden grid gap-6 max-w-md mx-auto pb-8">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="relative rounded-3xl p-8 backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradientBg} opacity-60`} />

                {portal.id === 'kids' && <FloatingKidsElements />}

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-2xl ${portal.iconBg} mb-5`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight mb-1">{portal.title}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-2">{portal.subtitle}</p>
                  <p className={`text-base font-medium mb-4 ${portal.id === 'adults' ? 'font-serif italic text-slate-200' : 'text-white/80'}`}>
                    {portal.tagline}
                  </p>
                  <p className="text-slate-300/80 text-sm leading-relaxed mb-6">{portal.description}</p>
                  <Link
                    to={portal.link}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${portal.ctaGradient} text-white text-sm font-semibold shadow-lg`}
                  >
                    {portal.cta} →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center text-white/50"
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
