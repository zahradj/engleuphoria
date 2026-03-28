import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Play, ArrowRight, Globe, Users, Award, CheckCircle2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useThemeMode } from '@/hooks/useThemeMode';
import heroStudent from '@/assets/hero-student.jpg';
import heroKid from '@/assets/hero-kid.jpg';
import heroAdult from '@/assets/hero-adult.jpg';

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

const heroImages = [
  { src: heroStudent, alt: 'Student learning English online', label: 'Teens & Adults' },
  { src: heroKid, alt: 'Child learning English on tablet', label: 'Kids 5-12' },
  { src: heroAdult, alt: 'Professional taking English course', label: 'Professionals' },
];

export function HeroSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);
  const [activeImage, setActiveImage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  const students = useCountUp(2500);
  const countries = useCountUp(45);
  const lessons = useCountUp(50000);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#09090B]' : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/30'
      }`}
    >
      {/* Decorative elements */}
      <div className={`absolute top-0 right-0 w-[60%] h-full ${isDark ? 'bg-gradient-to-l from-indigo-950/20 to-transparent' : 'bg-gradient-to-l from-indigo-100/40 to-transparent'}`} />
      <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/10'}`} />
      <div className={`absolute top-20 right-20 w-72 h-72 rounded-full blur-[100px] ${isDark ? 'bg-emerald-600/8' : 'bg-emerald-400/8'}`} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[85vh]">
          
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
                isDark
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Trusted by 2,500+ students worldwide</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Learn English
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Your Way.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className={`text-xl leading-relaxed mb-8 max-w-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Personalized 1-on-1 lessons with native speakers. 
              For kids, teens, and professionals — at any level.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                to="/student-signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-lg shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <Play className="w-5 h-5" />
                How It Works
              </button>
            </motion.div>

            {/* Stats Row - Skyeng style floating stats */}
            <motion.div
              className="flex flex-wrap gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {[
                { ref: students.ref, count: students.count, suffix: '+', label: 'Active Students', icon: Users },
                { ref: countries.ref, count: countries.count, suffix: '+', label: 'Countries', icon: Globe },
                { ref: lessons.ref, count: lessons.count, suffix: '+', label: 'Lessons Delivered', icon: Award },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-white/5' : 'bg-indigo-50'
                  }`}>
                    <stat.icon className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
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

          {/* Right: Hero Image with floating cards */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: bgY }}
          >
            {/* Main image container */}
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className={`relative rounded-3xl overflow-hidden aspect-[4/5] ${
                isDark ? 'shadow-2xl shadow-indigo-500/10' : 'shadow-2xl shadow-slate-300/40'
              }`}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={heroImages[activeImage].src}
                    alt={heroImages[activeImage].alt}
                    className="w-full h-full object-cover"
                    loading="eager"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                  />
                </AnimatePresence>
                {/* Gradient overlay */}
                <div className={`absolute inset-0 ${
                  isDark
                    ? 'bg-gradient-to-t from-[#09090B]/60 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-white/30 via-transparent to-transparent'
                }`} />
              </div>

              {/* Image selector dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeImage
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Show ${heroImages[i].label}`}
                  />
                ))}
              </div>

              {/* Floating stat card - Top left */}
              <motion.div
                className={`absolute -left-4 top-8 lg:-left-12 backdrop-blur-xl rounded-2xl px-5 py-4 ${
                  isDark
                    ? 'bg-slate-900/80 border border-white/10 shadow-xl'
                    : 'bg-white/90 border border-slate-200/60 shadow-xl shadow-slate-200/50'
                }`}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>4.9/5</span>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>from 1,200+ reviews</p>
              </motion.div>

              {/* Floating stat card - Bottom right */}
              <motion.div
                className={`absolute -right-4 bottom-20 lg:-right-12 backdrop-blur-xl rounded-2xl px-5 py-4 ${
                  isDark
                    ? 'bg-slate-900/80 border border-white/10 shadow-xl'
                    : 'bg-white/90 border border-slate-200/60 shadow-xl shadow-slate-200/50'
                }`}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center`}>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Free Trial Lesson</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No credit card needed</p>
                  </div>
                </div>
              </motion.div>

              {/* Active now indicator */}
              <motion.div
                className={`absolute -left-2 bottom-32 lg:-left-8 backdrop-blur-xl rounded-xl px-4 py-3 ${
                  isDark
                    ? 'bg-slate-900/80 border border-white/10 shadow-lg'
                    : 'bg-white/90 border border-slate-200/60 shadow-lg'
                }`}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 2 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>127</strong> students online now
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave separator */}
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
}
