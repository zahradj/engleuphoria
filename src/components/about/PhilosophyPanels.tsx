import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Rocket, Briefcase, ArrowRight } from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';

const panels = [
  {
    id: 'spark',
    icon: Sparkles,
    label: 'The Spark',
    headline: 'For Kids, we believe in Magic.',
    body: "In our Playground, every lesson is an adventure. Kids explore a gamified forest world where learning English feels like playing their favorite game. Animated mascots guide them, rewards celebrate every milestone, and laughter is part of the curriculum.",
    gradient: 'from-[#FF9F1C] to-[#FFBF00]',
    glowColor: '#FF9F1C',
    iconBgDark: 'bg-[#FF9F1C]/15',
    iconBgLight: 'bg-orange-50',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop',
  },
  {
    id: 'drive',
    icon: Rocket,
    label: 'The Drive',
    headline: 'For Teens, we believe in Agency.',
    body: "The Academy puts teens in the driver's seat. Project-based learning, real-world challenges, and creative expression help them build confidence. No boring textbooks — just skills that matter for their future.",
    gradient: 'from-[#6366F1] to-[#A855F7]',
    glowColor: '#6366F1',
    iconBgDark: 'bg-[#6366F1]/15',
    iconBgLight: 'bg-indigo-50',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
  },
  {
    id: 'goal',
    icon: Briefcase,
    label: 'The Goal',
    headline: 'For Adults, we believe in Results.',
    body: "The Professional Hub is designed for busy professionals who need English for career growth. Structured business English courses, interview preparation, and presentation skills — all delivered efficiently with measurable progress.",
    gradient: 'from-[#10B981] to-[#059669]',
    glowColor: '#10B981',
    iconBgDark: 'bg-[#10B981]/15',
    iconBgLight: 'bg-emerald-50',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
  },
];

function PanelCard({ panel, index, isDark }: { panel: typeof panels[0]; index: number; isDark: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`rounded-[2rem] overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900/60 border border-white/5'
          : 'bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40'
      }`}
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image side */}
        <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
          <div
            className="absolute inset-0 opacity-20 blur-3xl"
            style={{ backgroundColor: panel.glowColor }}
          />
          <img
            src={panel.image}
            alt={panel.headline}
            className="relative w-full h-full object-cover"
            loading="lazy"
          />
          {/* Group chip */}
          <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${panel.gradient} text-white shadow-lg`}>
            {panel.label}
          </div>
        </div>

        {/* Content side */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
            isDark ? panel.iconBgDark : panel.iconBgLight
          }`}>
            <panel.icon className="w-6 h-6" style={{ color: panel.glowColor }} />
          </div>

          <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {panel.headline}
          </h3>

          <p className={`text-base leading-relaxed mb-6 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {panel.body}
          </p>

          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: panel.glowColor }}>
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const PhilosophyPanels = () => {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section
      id="philosophy"
      className={`py-24 md:py-32 transition-colors duration-300 ${
        isDark ? 'bg-[#0F172A]' : 'bg-[#FAFAFA]'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border ${
            isDark
              ? 'bg-violet-500/10 border-violet-500/20 text-violet-300'
              : 'bg-violet-50 border-violet-200 text-violet-700'
          }`}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Our Philosophy</span>
          </div>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Three Worlds,{' '}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#A855F7] bg-clip-text text-transparent">
              One Mission
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Every learner deserves an experience crafted for their stage of life.
          </p>
        </motion.div>

        {/* Stacked panels */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {panels.map((panel, index) => (
            <PanelCard key={panel.id} panel={panel} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhilosophyPanels;
