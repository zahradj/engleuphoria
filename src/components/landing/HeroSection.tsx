import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Play, ArrowRight, Globe, Users, Award, CheckCircle2, Tablet, Headphones, Briefcase } from 'lucide-react';
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

// --- Inline SVG Character Illustrations ---

function KidIllustration() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <rect x="130" y="220" width="140" height="160" rx="30" fill="url(#kidShirt)" />
      {/* Arms */}
      <rect x="90" y="240" width="50" height="120" rx="25" fill="url(#kidShirt)" />
      <rect x="260" y="240" width="50" height="120" rx="25" fill="url(#kidShirt)" />
      {/* Hands */}
      <circle cx="115" cy="370" r="18" fill="#FBBF7A" />
      <circle cx="285" cy="370" r="18" fill="#FBBF7A" />
      {/* Head */}
      <circle cx="200" cy="160" r="72" fill="#FDDCB5" />
      {/* Hair */}
      <ellipse cx="200" cy="110" rx="75" ry="42" fill="#5B3A1A" />
      <ellipse cx="145" cy="135" rx="18" ry="30" fill="#5B3A1A" />
      <ellipse cx="255" cy="135" rx="18" ry="30" fill="#5B3A1A" />
      {/* Eyes */}
      <circle cx="175" cy="158" r="9" fill="#1E293B" />
      <circle cx="225" cy="158" r="9" fill="#1E293B" />
      <circle cx="178" cy="155" r="3" fill="white" />
      <circle cx="228" cy="155" r="3" fill="white" />
      {/* Smile */}
      <path d="M180 185 Q200 205 220 185" stroke="#E76A4B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="162" cy="180" r="10" fill="#FFBFA0" opacity="0.6" />
      <circle cx="238" cy="180" r="10" fill="#FFBFA0" opacity="0.6" />
      {/* Tablet */}
      <rect x="155" y="310" width="90" height="65" rx="8" fill="#1E293B" />
      <rect x="161" y="316" width="78" height="48" rx="4" fill="#60A5FA" />
      <text x="200" y="347" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">ABC</text>
      {/* Legs */}
      <rect x="150" y="370" width="40" height="80" rx="18" fill="#4A7DFF" />
      <rect x="210" y="370" width="40" height="80" rx="18" fill="#4A7DFF" />
      {/* Shoes */}
      <ellipse cx="170" cy="455" rx="28" ry="14" fill="#FF9F1C" />
      <ellipse cx="230" cy="455" rx="28" ry="14" fill="#FF9F1C" />
      {/* Stars decoration */}
      <polygon points="80,80 85,95 100,95 88,105 92,120 80,110 68,120 72,105 60,95 75,95" fill="#FFBF00" opacity="0.8" />
      <polygon points="320,60 323,70 333,70 325,77 328,87 320,80 312,87 315,77 307,70 317,70" fill="#FF9F1C" opacity="0.7" />
      <polygon points="340,140 343,148 351,148 345,153 347,161 340,156 333,161 335,153 329,148 337,148" fill="#FFBF00" opacity="0.6" />
      <defs>
        <linearGradient id="kidShirt" x1="130" y1="220" x2="270" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9F1C" />
          <stop offset="1" stopColor="#FFBF00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TeenIllustration() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <rect x="140" y="230" width="120" height="150" rx="20" fill="url(#teenHoodie)" />
      {/* Hood strings */}
      <line x1="185" y1="230" x2="180" y2="270" stroke="white" strokeWidth="2" />
      <line x1="215" y1="230" x2="220" y2="270" stroke="white" strokeWidth="2" />
      {/* Arms */}
      <rect x="100" y="245" width="48" height="110" rx="22" fill="url(#teenHoodie)" />
      <rect x="252" y="245" width="48" height="110" rx="22" fill="url(#teenHoodie)" />
      {/* Hands */}
      <circle cx="124" cy="365" r="16" fill="#D4A87C" />
      <circle cx="276" cy="365" r="16" fill="#D4A87C" />
      {/* Head */}
      <circle cx="200" cy="165" r="65" fill="#E8C5A0" />
      {/* Hair — swept style */}
      <path d="M135 150 Q140 85 200 80 Q260 85 268 130 L260 155 Q250 120 200 110 Q150 120 145 155 Z" fill="#2D1B0E" />
      <path d="M150 130 Q165 95 220 90 Q240 95 250 115" fill="#3D2B1E" />
      {/* Eyes */}
      <ellipse cx="178" cy="165" rx="7" ry="8" fill="#1E293B" />
      <ellipse cx="222" cy="165" rx="7" ry="8" fill="#1E293B" />
      <circle cx="180" cy="163" r="2.5" fill="white" />
      <circle cx="224" cy="163" r="2.5" fill="white" />
      {/* Eyebrows */}
      <path d="M165 148 Q178 142 188 148" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M212 148 Q222 142 235 148" stroke="#2D1B0E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Smirk */}
      <path d="M188 192 Q200 200 215 190" stroke="#C27A5A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Headphones */}
      <path d="M130 145 Q130 85 200 80 Q270 85 270 145" stroke="#6366F1" strokeWidth="8" strokeLinecap="round" fill="none" />
      <rect x="118" y="135" width="22" height="34" rx="10" fill="#6366F1" />
      <rect x="260" y="135" width="22" height="34" rx="10" fill="#6366F1" />
      <rect x="121" y="140" width="16" height="24" rx="7" fill="#A855F7" />
      <rect x="263" y="140" width="16" height="24" rx="7" fill="#A855F7" />
      {/* Laptop */}
      <rect x="130" y="340" width="140" height="8" rx="2" fill="#94A3B8" />
      <path d="M140 340 L150 290 L250 290 L260 340 Z" fill="#334155" />
      <path d="M155 295 L245 295 L253 335 L145 335 Z" fill="#818CF8" />
      <text x="200" y="322" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">{'</>'}</text>
      {/* Legs */}
      <rect x="155" y="375" width="35" height="78" rx="16" fill="#334155" />
      <rect x="210" y="375" width="35" height="78" rx="16" fill="#334155" />
      {/* Sneakers */}
      <ellipse cx="172" cy="458" rx="25" ry="12" fill="#A855F7" />
      <ellipse cx="228" cy="458" rx="25" ry="12" fill="#6366F1" />
      {/* Decorative elements */}
      <circle cx="70" cy="100" r="6" fill="#A855F7" opacity="0.5" />
      <circle cx="340" cy="80" r="8" fill="#6366F1" opacity="0.4" />
      <circle cx="55" cy="300" r="5" fill="#818CF8" opacity="0.5" />
      <rect x="330" y="200" width="12" height="12" rx="2" fill="#A855F7" opacity="0.3" transform="rotate(45 336 206)" />
      <defs>
        <linearGradient id="teenHoodie" x1="140" y1="230" x2="260" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AdultIllustration() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body — suit jacket */}
      <rect x="135" y="225" width="130" height="160" rx="16" fill="url(#adultSuit)" />
      {/* Lapels */}
      <path d="M200 225 L170 260 L175 290 L200 270 L225 290 L230 260 Z" fill="#0F766E" />
      {/* Tie */}
      <path d="M196 260 L200 320 L204 260 Z" fill="#FBBF24" />
      <rect x="194" y="250" width="12" height="14" rx="2" fill="#FBBF24" />
      {/* Arms */}
      <rect x="95" y="240" width="46" height="120" rx="22" fill="url(#adultSuit)" />
      <rect x="259" y="240" width="46" height="120" rx="22" fill="url(#adultSuit)" />
      {/* Hands */}
      <circle cx="118" cy="370" r="16" fill="#D4A87C" />
      <circle cx="282" cy="370" r="16" fill="#D4A87C" />
      {/* Head */}
      <circle cx="200" cy="160" r="62" fill="#E0B896" />
      {/* Hair — professional */}
      <path d="M138 145 Q140 95 200 88 Q260 95 262 145 Q255 118 200 110 Q145 118 138 145 Z" fill="#1A1A2E" />
      {/* Eyes */}
      <ellipse cx="180" cy="158" rx="6" ry="7" fill="#1E293B" />
      <ellipse cx="220" cy="158" rx="6" ry="7" fill="#1E293B" />
      <circle cx="182" cy="156" r="2" fill="white" />
      <circle cx="222" cy="156" r="2" fill="white" />
      {/* Glasses */}
      <rect x="165" y="148" width="28" height="22" rx="6" stroke="#64748B" strokeWidth="2" fill="none" />
      <rect x="207" y="148" width="28" height="22" rx="6" stroke="#64748B" strokeWidth="2" fill="none" />
      <line x1="193" y1="158" x2="207" y2="158" stroke="#64748B" strokeWidth="2" />
      {/* Confident smile */}
      <path d="M185 185 Q200 196 215 185" stroke="#B87A5A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Shirt collar */}
      <path d="M170 228 L200 245 L230 228" stroke="white" strokeWidth="3" fill="none" />
      {/* Briefcase */}
      <rect x="260" y="350" width="55" height="40" rx="6" fill="#92400E" />
      <rect x="270" y="345" width="35" height="10" rx="4" fill="#B45309" />
      <rect x="283" y="355" width="9" height="8" rx="2" fill="#FBBF24" />
      {/* Legs */}
      <rect x="155" y="380" width="36" height="76" rx="14" fill="#1E293B" />
      <rect x="210" y="380" width="36" height="76" rx="14" fill="#1E293B" />
      {/* Dress shoes */}
      <ellipse cx="173" cy="460" rx="24" ry="11" fill="#1E293B" />
      <ellipse cx="228" cy="460" rx="24" ry="11" fill="#1E293B" />
      {/* Decorative */}
      <circle cx="60" cy="120" r="4" fill="#10B981" opacity="0.5" />
      <circle cx="350" cy="100" r="6" fill="#059669" opacity="0.4" />
      <rect x="55" y="280" width="10" height="10" rx="2" fill="#10B981" opacity="0.3" transform="rotate(45 60 285)" />
      <circle cx="340" cy="250" r="4" fill="#34D399" opacity="0.4" />
      <defs>
        <linearGradient id="adultSuit" x1="135" y1="225" x2="265" y2="385" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const ILLUSTRATIONS = [KidIllustration, TeenIllustration, AdultIllustration];

const GROUP_THEMES = [
  {
    id: 'kids',
    label: 'The Playground',
    ageLabel: 'Kids 5–12',
    tagline: 'Learn Through Play!',
    gradient: 'from-[#FF9F1C] to-[#FFBF00]',
    gradientHover: 'hover:from-[#FFB340] hover:to-[#FFD040]',
    shadow: 'shadow-[#FF9F1C]/25 hover:shadow-[#FF9F1C]/35',
    glowColor: 'bg-[#FF9F1C]',
    glowColorAlt: 'bg-[#FFBF00]',
    dotActive: 'bg-[#FF9F1C]',
    iconBg: { dark: 'bg-[#FF9F1C]/15', light: 'bg-orange-50' },
    iconColor: { dark: 'text-[#FF9F1C]', light: 'text-orange-600' },
    accentText: { dark: 'text-[#FF9F1C]', light: 'text-orange-600' },
    badgeBg: { dark: 'bg-[#FF9F1C]/10 border-[#FF9F1C]/20 text-[#FFBF00]', light: 'bg-orange-50 border-orange-200 text-orange-700' },
    chipBg: 'bg-gradient-to-r from-[#FF9F1C] to-[#FFBF00] text-white',
  },
  {
    id: 'teen',
    label: 'The Academy',
    ageLabel: 'Teens 13–17',
    tagline: 'Level Up Your English!',
    gradient: 'from-[#6366F1] to-[#A855F7]',
    gradientHover: 'hover:from-[#7578F3] hover:to-[#B96AF8]',
    shadow: 'shadow-[#6366F1]/25 hover:shadow-[#6366F1]/35',
    glowColor: 'bg-[#6366F1]',
    glowColorAlt: 'bg-[#A855F7]',
    dotActive: 'bg-[#6366F1]',
    iconBg: { dark: 'bg-[#6366F1]/15', light: 'bg-indigo-50' },
    iconColor: { dark: 'text-[#6366F1]', light: 'text-indigo-600' },
    accentText: { dark: 'text-[#A855F7]', light: 'text-indigo-600' },
    badgeBg: { dark: 'bg-[#6366F1]/10 border-[#6366F1]/20 text-[#A855F7]', light: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    chipBg: 'bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white',
  },
  {
    id: 'adult',
    label: 'The Hub',
    ageLabel: 'Adults 18+',
    tagline: 'Professional Growth Starts Here.',
    gradient: 'from-[#10B981] to-[#059669]',
    gradientHover: 'hover:from-[#34D399] hover:to-[#10B981]',
    shadow: 'shadow-[#10B981]/25 hover:shadow-[#10B981]/35',
    glowColor: 'bg-[#10B981]',
    glowColorAlt: 'bg-[#059669]',
    dotActive: 'bg-[#10B981]',
    iconBg: { dark: 'bg-[#10B981]/15', light: 'bg-emerald-50' },
    iconColor: { dark: 'text-[#10B981]', light: 'text-emerald-600' },
    accentText: { dark: 'text-[#10B981]', light: 'text-emerald-600' },
    badgeBg: { dark: 'bg-[#10B981]/10 border-[#10B981]/20 text-[#34D399]', light: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    chipBg: 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white',
  },
];

export function HeroSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const theme = GROUP_THEMES[activeImage];
  const ActiveIllustration = ILLUSTRATIONS[activeImage];

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
      setActiveImage((prev) => (prev + 1) % GROUP_THEMES.length);
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
      {/* Decorative glows */}
      <div
        className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] transition-colors duration-700 ${theme.glowColor} ${
          isDark ? 'opacity-[0.08]' : 'opacity-[0.06]'
        }`}
      />
      <div
        className={`absolute top-20 right-20 w-72 h-72 rounded-full blur-[100px] transition-colors duration-700 ${theme.glowColorAlt} ${
          isDark ? 'opacity-[0.06]' : 'opacity-[0.05]'
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border transition-colors duration-700 ${
                isDark ? theme.badgeBg.dark : theme.badgeBg.light
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Trusted by 2,500+ students worldwide</span>
            </motion.div>

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
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent transition-all duration-700`}>
                {theme.tagline}
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
              Personalized 1-on-1 lessons with native speakers.
              For kids, teens, and professionals — at any level.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                to="/student-signup"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r ${theme.gradient} ${theme.gradientHover} text-white font-bold text-lg shadow-xl ${theme.shadow} transition-all duration-500 hover:-translate-y-0.5`}
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-700 ${
                    isDark ? theme.iconBg.dark : theme.iconBg.light
                  }`}>
                    <stat.icon className={`w-5 h-5 transition-colors duration-700 ${isDark ? theme.iconColor.dark : theme.iconColor.light}`} />
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

          {/* Right: SVG Character Illustration */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: bgY }}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Colored glow behind illustration */}
              <div
                className={`absolute inset-0 rounded-full blur-[80px] transition-colors duration-700 ${theme.glowColor} ${
                  isDark ? 'opacity-[0.15]' : 'opacity-[0.12]'
                }`}
                style={{ top: '10%', bottom: '10%', left: '10%', right: '10%' }}
              />

              {/* SVG illustration with pop-up spring animation */}
              <div className="relative aspect-[4/5] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    className="w-full h-full flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.3, y: 60 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -30 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <div className="w-[85%] h-[85%] drop-shadow-2xl">
                      <ActiveIllustration />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Group label chip */}
              <motion.div
                className={`absolute top-4 right-4 z-10 px-4 py-1.5 rounded-full text-sm font-bold ${theme.chipBg} shadow-lg`}
                key={`chip-${activeImage}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
              >
                {theme.ageLabel}
              </motion.div>

              {/* Selector dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {GROUP_THEMES.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      i === activeImage
                        ? `w-8 ${g.dotActive}`
                        : `w-2.5 ${isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-slate-300 hover:bg-slate-400'}`
                    }`}
                    aria-label={`Show ${g.label}`}
                  />
                ))}
              </div>

              {/* Floating card — Rating */}
              <motion.div
                className={`absolute -left-4 top-8 lg:-left-12 backdrop-blur-xl rounded-2xl px-5 py-4 z-10 ${
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

              {/* Floating card — Free Trial */}
              <motion.div
                className={`absolute -right-4 bottom-20 lg:-right-12 backdrop-blur-xl rounded-2xl px-5 py-4 z-10 ${
                  isDark
                    ? 'bg-slate-900/80 border border-white/10 shadow-xl'
                    : 'bg-white/90 border border-slate-200/60 shadow-xl shadow-slate-200/50'
                }`}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center transition-all duration-700`}>
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
                className={`absolute -left-2 bottom-32 lg:-left-8 backdrop-blur-xl rounded-xl px-4 py-3 z-10 ${
                  isDark
                    ? 'bg-slate-900/80 border border-white/10 shadow-lg'
                    : 'bg-white/90 border border-slate-200/60 shadow-lg'
                }`}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 2 }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-700 ${theme.dotActive}`} />
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>127</strong> students online now
                  </span>
                </div>
              </motion.div>
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
}
