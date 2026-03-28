import { UserPlus, ClipboardCheck, Calendar, Rocket, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeMode } from '@/hooks/useThemeMode';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in 30 seconds. No credit card required.',
    gradient: 'from-indigo-500 to-violet-600',
    bgLight: 'bg-indigo-50',
  },
  {
    icon: ClipboardCheck,
    number: '02',
    title: 'Take the Level Test',
    description: 'Our adaptive placement test finds your exact CEFR level in 10 minutes.',
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
  },
  {
    icon: Calendar,
    number: '03',
    title: 'Book Your Lessons',
    description: 'Choose your teacher, pick times that work for you. It\'s that simple.',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Start Speaking',
    description: 'Jump into interactive 1-on-1 lessons and watch your confidence soar.',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
  },
];

export function HowItWorksSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  return (
    <section id="how-it-works" className={`py-24 md:py-32 relative overflow-hidden scroll-mt-20 transition-colors duration-300 ${
      isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className={`inline-block text-sm font-bold tracking-widest uppercase mb-4 ${
            isDark ? 'text-indigo-400' : 'text-indigo-600'
          }`}>
            Getting Started
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            How It{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            From sign-up to speaking — in four simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop: Alternating left-right layout */}
          <div className="space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 top-[120px] h-[calc(100%-60px)] w-[2px] ${
                      isDark ? 'bg-white/[0.06]' : 'bg-slate-200'
                    }`}>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-indigo-500/50 to-transparent"
                        initial={{ scaleY: 0, transformOrigin: 'top' }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
                      />
                    </div>
                  )}

                  <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 py-8 ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}>
                    {/* Number circle in center for desktop */}
                    <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-extrabold text-xl shadow-xl`}>
                        {step.number}
                      </div>
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 ${isEven ? 'md:pr-24 md:text-right' : 'md:pl-24 md:text-left'}`}>
                      <div className={`rounded-3xl p-8 transition-all duration-500 ${
                        isDark
                          ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                          : 'bg-white border border-slate-100 shadow-sm hover:shadow-lg'
                      }`}>
                        {/* Mobile number */}
                        <div className={`md:hidden w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-sm mb-4`}>
                          {step.number}
                        </div>

                        <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-white/5' : step.bgLight} flex items-center justify-center mb-5 ${isEven ? 'md:ml-auto' : ''}`}>
                          <Icon className={`w-7 h-7 ${isDark ? 'text-white' : 'text-slate-700'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {step.title}
                        </h3>
                        <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for other side */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="/student-signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-lg shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
