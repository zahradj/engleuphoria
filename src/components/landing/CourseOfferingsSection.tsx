import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeMode } from '@/hooks/useThemeMode';
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  MessageCircle,
  PenTool,
  ArrowRight,
  Users,
} from 'lucide-react';

const courses = [
  {
    icon: BookOpen,
    title: 'General English',
    description: 'Build fluency from beginner to advanced with structured, immersive lessons tailored to your level.',
    levels: 'A1 – C2',
    gradient: 'from-indigo-500 to-violet-600',
    iconBg: 'bg-indigo-500/10',
    accentColor: 'text-indigo-500',
    borderHover: 'hover:border-indigo-500/30',
    students: '800+',
    tag: 'Most Popular',
  },
  {
    icon: Briefcase,
    title: 'Business English',
    description: 'Master professional communication, presentations, negotiations and workplace vocabulary.',
    levels: 'B1 – C2',
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-500/10',
    accentColor: 'text-amber-500',
    borderHover: 'hover:border-amber-500/30',
    students: '450+',
    tag: null,
  },
  {
    icon: GraduationCap,
    title: 'Exam Preparation',
    description: 'Targeted preparation for IELTS, TOEFL, Cambridge FCE/CAE and other certifications.',
    levels: 'B1 – C2',
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-500/10',
    accentColor: 'text-rose-500',
    borderHover: 'hover:border-rose-500/30',
    students: '350+',
    tag: null,
  },
  {
    icon: Sparkles,
    title: 'Kids English',
    description: 'Playful, age-appropriate lessons that make learning feel like an exciting adventure.',
    levels: 'Pre-A1 – A2',
    gradient: 'from-[#FF9F1C] to-[#FFBF00]',
    iconBg: 'bg-[#FF9F1C]/10',
    accentColor: 'text-[#FF9F1C]',
    borderHover: 'hover:border-[#FF9F1C]/30',
    students: '600+',
    tag: 'Kids Favourite',
  },
  {
    icon: MessageCircle,
    title: 'Conversation Club',
    description: 'Live speaking practice with peers and mentors to boost confidence and fluency fast.',
    levels: 'A2 – C1',
    gradient: 'from-sky-500 to-cyan-600',
    iconBg: 'bg-sky-500/10',
    accentColor: 'text-sky-500',
    borderHover: 'hover:border-sky-500/30',
    students: '200+',
    tag: null,
  },
  {
    icon: PenTool,
    title: 'Grammar Mastery',
    description: 'Deep-dive into grammar with contextual exercises and real-world application scenarios.',
    levels: 'A1 – C1',
    gradient: 'from-purple-500 to-fuchsia-600',
    iconBg: 'bg-purple-500/10',
    accentColor: 'text-purple-500',
    borderHover: 'hover:border-purple-500/30',
    students: '300+',
    tag: null,
  },
];

export function CourseOfferingsSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className={`inline-block text-sm font-bold tracking-widest uppercase mb-4 ${
            isDark ? 'text-indigo-400' : 'text-indigo-600'
          }`}>
            Programs
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Courses for{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Every Goal
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Whether you're preparing for an exam, advancing your career, or just starting out — we've got you covered.
          </p>
        </motion.div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {courses.map((course, i) => {
            const Icon = course.icon;
            const isHovered = hoveredIndex === i;
            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  to="/student-signup"
                  className={`group relative block rounded-3xl overflow-hidden transition-all duration-500 h-full min-h-[300px] ${course.borderHover} ${
                    isDark
                      ? 'bg-white/[0.03] border border-white/[0.06]'
                      : 'bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60'
                  }`}
                >
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${course.gradient} transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} />

                  <div className="relative p-8 flex flex-col h-full">
                    {/* Tag */}
                    {course.tag && (
                      <div className={`absolute top-6 right-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r ${course.gradient} text-white`}>
                        {course.tag}
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${course.iconBg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110`}>
                      <Icon className={`w-7 h-7 ${course.accentColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {course.title}
                    </h3>

                    {/* Level badge */}
                    <span className={`inline-flex self-start text-xs font-semibold px-2.5 py-1 rounded-lg mb-4 ${
                      isDark
                        ? 'bg-white/[0.06] text-slate-300'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {course.levels}
                    </span>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed flex-1 mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {course.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Users className="w-3.5 h-3.5" />
                        {course.students} enrolled
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 ${course.accentColor}`}>
                        Explore
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
