import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
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

const courses = [
  {
    icon: BookOpen,
    title: 'General English',
    description: 'Build fluency from beginner to advanced with structured, immersive lessons.',
    levels: 'A1 – C2',
    gradient: 'from-indigo-500 to-violet-500',
    glowDark: 'rgba(99,102,241,0.25)',
    glowLight: 'rgba(99,102,241,0.12)',
  },
  {
    icon: Briefcase,
    title: 'Business English',
    description: 'Master professional communication, presentations, and workplace vocabulary.',
    levels: 'B1 – C2',
    gradient: 'from-amber-500 to-orange-500',
    glowDark: 'rgba(245,158,11,0.25)',
    glowLight: 'rgba(245,158,11,0.12)',
  },
  {
    icon: GraduationCap,
    title: 'Exam Preparation',
    description: 'Targeted prep for IELTS, TOEFL, Cambridge, and other certifications.',
    levels: 'B1 – C2',
    gradient: 'from-rose-500 to-pink-500',
    glowDark: 'rgba(244,63,94,0.25)',
    glowLight: 'rgba(244,63,94,0.12)',
  },
  {
    icon: Baby,
    title: 'Kids English',
    description: 'Playful, age-appropriate lessons that make learning feel like an adventure.',
    levels: 'Pre-A1 – A2',
    gradient: 'from-emerald-500 to-teal-500',
    glowDark: 'rgba(16,185,129,0.25)',
    glowLight: 'rgba(16,185,129,0.12)',
  },
  {
    icon: MessageCircle,
    title: 'Conversation Club',
    description: 'Live speaking practice with peers and mentors to boost confidence fast.',
    levels: 'A2 – C1',
    gradient: 'from-sky-500 to-cyan-500',
    glowDark: 'rgba(14,165,233,0.25)',
    glowLight: 'rgba(14,165,233,0.12)',
  },
  {
    icon: PenTool,
    title: 'Grammar Mastery',
    description: 'Deep-dive into grammar with contextual exercises and real-world application.',
    levels: 'A1 – C1',
    gradient: 'from-purple-500 to-fuchsia-500',
    glowDark: 'rgba(168,85,247,0.25)',
    glowLight: 'rgba(168,85,247,0.12)',
  },
];

export function CourseOfferingsSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span
            className={`inline-block text-sm font-semibold tracking-widest uppercase mb-4 ${
              isDark ? 'text-indigo-400' : 'text-indigo-600'
            }`}
          >
            Our Courses
          </span>
          <h2
            className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Explore Your{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            From playful kids' classes to professional mastery — find the course that fits your goals.
          </p>
        </motion.div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {courses.map((course, i) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to="/student-signup"
                  className={`group relative block rounded-2xl p-6 backdrop-blur-xl transition-all duration-500 h-full ${
                    isDark
                      ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]'
                      : 'bg-white/80 border border-slate-200/60 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40'
                  }`}
                  onMouseEnter={(e) => {
                    const glow = isDark ? course.glowDark : course.glowLight;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${glow}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                  }}
                >
                  {/* Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {course.description}
                  </p>

                  {/* Footer: Level Tag + CTA */}
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        isDark
                          ? 'bg-white/[0.06] text-slate-300'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {course.levels}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
                        isDark
                          ? 'text-indigo-400 group-hover:text-indigo-300'
                          : 'text-indigo-600 group-hover:text-indigo-700'
                      }`}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
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
