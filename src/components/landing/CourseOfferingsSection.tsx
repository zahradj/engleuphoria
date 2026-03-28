import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeMode } from '@/hooks/useThemeMode';
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Baby,
  MessageCircle,
  PenTool,
  ArrowRight,
} from 'lucide-react';
import heroKid from '@/assets/hero-kid.jpg';
import heroAdult from '@/assets/hero-adult.jpg';
import heroStudent from '@/assets/hero-student.jpg';

const courses = [
  {
    icon: BookOpen,
    title: 'General English',
    description: 'Build fluency from beginner to advanced with structured, immersive lessons tailored to your level.',
    levels: 'A1 – C2',
    gradient: 'from-indigo-500 to-violet-600',
    image: heroStudent,
    students: '800+',
  },
  {
    icon: Briefcase,
    title: 'Business English',
    description: 'Master professional communication, presentations, negotiations and workplace vocabulary.',
    levels: 'B1 – C2',
    gradient: 'from-amber-500 to-orange-600',
    image: heroAdult,
    students: '450+',
  },
  {
    icon: GraduationCap,
    title: 'Exam Preparation',
    description: 'Targeted preparation for IELTS, TOEFL, Cambridge FCE/CAE and other certifications.',
    levels: 'B1 – C2',
    gradient: 'from-rose-500 to-pink-600',
    image: heroStudent,
    students: '350+',
  },
  {
    icon: Baby,
    title: 'Kids English',
    description: 'Playful, age-appropriate lessons that make learning feel like an exciting adventure.',
    levels: 'Pre-A1 – A2',
    gradient: 'from-emerald-500 to-teal-600',
    image: heroKid,
    students: '600+',
  },
  {
    icon: MessageCircle,
    title: 'Conversation Club',
    description: 'Live speaking practice with peers and mentors to boost confidence and fluency fast.',
    levels: 'A2 – C1',
    gradient: 'from-sky-500 to-cyan-600',
    image: heroStudent,
    students: '200+',
  },
  {
    icon: PenTool,
    title: 'Grammar Mastery',
    description: 'Deep-dive into grammar with contextual exercises and real-world application scenarios.',
    levels: 'A1 – C1',
    gradient: 'from-purple-500 to-fuchsia-600',
    image: heroAdult,
    students: '300+',
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

        {/* Course Grid - Large cards with image reveal on hover */}
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
                  className={`group relative block rounded-3xl overflow-hidden transition-all duration-500 h-full min-h-[280px] ${
                    isDark
                      ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15]'
                      : 'bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/60'
                  }`}
                >
                  {/* Background image that reveals on hover */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      isHovered ? 'opacity-20' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={course.image}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="relative p-8 flex flex-col h-full">
                    {/* Icon + Level Row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.gradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        isDark
                          ? 'bg-white/[0.06] text-slate-300'
                          : 'bg-white text-slate-500 border border-slate-200'
                      }`}>
                        {course.levels}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed flex-1 mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {course.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {course.students} students enrolled
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 ${
                        isDark
                          ? 'text-indigo-400 group-hover:text-indigo-300'
                          : 'text-indigo-600 group-hover:text-indigo-700'
                      }`}>
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
