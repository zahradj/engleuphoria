import { UserPlus, ClipboardCheck, Calendar, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeMode } from '@/hooks/useThemeMode';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account in less than a minute',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: ClipboardCheck,
    title: 'Take Assessment',
    description: 'Quick placement test to find your level',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: 'Book Lessons',
    description: 'Choose times that fit your schedule',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Rocket,
    title: 'Start Learning',
    description: 'Enjoy interactive lessons with expert teachers',
    color: 'from-green-500 to-emerald-500',
  },
];

export function HowItWorksSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  return (
    <section id="how-it-works" className={`py-24 relative overflow-hidden scroll-mt-20 transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-[#FAFAFA]'
    }`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial rounded-full blur-3xl ${
          isDark ? 'from-amber-500/10 to-transparent' : 'from-amber-500/5 to-transparent'
        }`} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How It{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Getting started is easy. Follow these simple steps to begin your English journey.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection line - desktop only */}
          <div className={`hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 ${
            isDark
              ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 via-amber-500/30 to-green-500/30'
              : 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 via-amber-500/20 to-green-500/20'
          }`} />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Icon container */}
              <div className={`relative w-32 h-32 rounded-2xl bg-gradient-to-br ${step.color} p-[2px] mb-6`}>
                <div className={`w-full h-full rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <step.icon className={`w-12 h-12 ${isDark ? 'text-white' : 'text-slate-800'}`} />
                </div>
                {/* Step number */}
                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{index + 1}</span>
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
