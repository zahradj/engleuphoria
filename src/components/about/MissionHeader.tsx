import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Bird, Sparkles, Briefcase, ArrowRight, Heart, Target, Users, Globe } from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

const GROUP_DATA = [
  {
    icon: Bird,
    label: 'The Playground',
    ageLabel: 'Kids 5–12',
    gradient: 'from-[#FF9F1C] to-[#FFBF00]',
    glowColor: 'bg-[#FF9F1C]',
    dotActive: 'bg-[#FF9F1C]',
  },
  {
    icon: Sparkles,
    label: 'The Academy',
    ageLabel: 'Teens 13–17',
    gradient: 'from-[#6366F1] to-[#A855F7]',
    glowColor: 'bg-[#6366F1]',
    dotActive: 'bg-[#6366F1]',
  },
  {
    icon: Briefcase,
    label: 'The Hub',
    ageLabel: 'Adults 18+',
    gradient: 'from-[#10B981] to-[#059669]',
    glowColor: 'bg-[#10B981]',
    dotActive: 'bg-[#10B981]',
  },
];

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

const MissionHeader = () => {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);
  const [activeGroup, setActiveGroup] = useState(0);
  const theme = GROUP_DATA[activeGroup];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  const founded = useCountUp(2020);
  const countries = useCountUp(45);
  const students = useCountUp(2500);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGroup((prev) => (prev + 1) % GROUP_DATA.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#09090B]' : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/30'
      }`}
    >
      {/* Decorative glows */}
      <div
        className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] transition-colors duration-700 ${theme.glowColor} ${
          isDark ? 'opacity-[0.08]' : 'opacity-[0.06]'
        }`}
      />
      <div
        className={`absolute top-20 right-20 w-72 h-72 rounded-full blur-[100px] transition-colors duration-700 ${theme.glowColor} ${
          isDark ? 'opacity-[0.06]' : 'opacity-[0.04]'
        }`}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[85vh]">

          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border transition-colors duration-300 ${
                isDark
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Our Story</span>
            </motion.div>

            <motion.h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Learning,
              <br />
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent transition-all duration-700`}>
                Reimagined.
              </span>
            </motion.h1>

            <motion.p
              className={`text-xl leading-relaxed mb-8 max-w-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Engleuphoria isn't just a school. It's three distinct worlds 
              designed to meet you exactly where you are.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {[
                { ref: founded.ref, count: founded.count, suffix: '', label: 'Founded', icon: Target },
                { ref: countries.ref, count: countries.count, suffix: '+', label: 'Countries', icon: Globe },
                { ref: students.ref, count: students.count, suffix: '+', label: 'Students', icon: Users },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    isDark ? 'bg-white/5' : 'bg-slate-100'
                  }`}>
                    <stat.icon className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <span ref={stat.ref} className={`text-2xl font-extrabold block leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {stat.count.toLocaleString()}{stat.suffix}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Animated mascot cards */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: bgY }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                className={`absolute inset-0 rounded-full blur-[80px] transition-colors duration-700 ${theme.glowColor} ${
                  isDark ? 'opacity-[0.15]' : 'opacity-[0.10]'
                }`}
                style={{ top: '10%', bottom: '10%', left: '10%', right: '10%' }}
              />

              {/* Mascot circles */}
              <div className="relative aspect-square flex items-center justify-center">
                {GROUP_DATA.map((group, i) => {
                  const isActive = i === activeGroup;
                  const angle = (Math.PI * 2 * i) / GROUP_DATA.length - Math.PI / 2;
                  const radius = 120;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.button
                      key={group.label}
                      onClick={() => setActiveGroup(i)}
                      className="absolute"
                      animate={{
                        x,
                        y,
                        scale: isActive ? 1.3 : 0.9,
                        zIndex: isActive ? 10 : 1,
                      }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      <motion.div
                        className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${group.gradient} flex items-center justify-center shadow-2xl cursor-pointer`}
                        animate={isActive ? { y: [0, -10, 0] } : {}}
                        transition={isActive ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
                      >
                        <group.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      </motion.div>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                          >
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{group.label}</span>
                            <span className={`block text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{group.ageLabel}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}

                {/* Center text */}
                <div className={`text-center px-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <p className="text-sm font-medium opacity-60">Three Worlds</p>
                  <p className="text-lg font-bold">One Mission</p>
                </div>
              </div>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {GROUP_DATA.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGroup(i)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      i === activeGroup
                        ? `w-8 ${g.dotActive}`
                        : `w-2.5 ${isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-slate-300 hover:bg-slate-400'}`
                    }`}
                    aria-label={`Show ${g.label}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z"
            fill={isDark ? '#0F172A' : '#FAFAFA'}
          />
        </svg>
      </div>
    </section>
  );
};

export default MissionHeader;
