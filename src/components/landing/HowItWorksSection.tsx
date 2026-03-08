import { UserPlus, ClipboardCheck, Calendar, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeMode } from '@/hooks/useThemeMode';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account in less than a minute',
    color: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50',
    lightIcon: 'text-blue-600',
  },
  {
    icon: ClipboardCheck,
    title: 'Take Assessment',
    description: 'Quick placement test to find your level',
    color: 'from-purple-500 to-pink-500',
    lightBg: 'bg-purple-50',
    lightIcon: 'text-purple-600',
  },
  {
    icon: Calendar,
    title: 'Book Lessons',
    description: 'Choose times that fit your schedule',
    color: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50',
    lightIcon: 'text-amber-600',
  },
  {
    icon: Rocket,
    title: 'Start Learning',
    description: 'Enjoy interactive lessons with expert teachers',
    color: 'from-green-500 to-emerald-500',
    lightBg: 'bg-emerald-50',
    lightIcon: 'text-emerald-600',
  },
];

export function HowItWorksSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  return (
    <section id="how-it-works" className={`py-24 relative overflow-hidden scroll-mt-20 transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-[#FAFAFA]'
    }`}>
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

        {/* Timeline - Desktop horizontal, Mobile vertical */}
        <div className="relative">
          {/* Desktop horizontal timeline */}
          <div className="hidden md:block">
            {/* Animated connecting line */}
            <div className="absolute top-16 left-[12.5%] right-[12.5%] h-[2px] overflow-hidden">
              <motion.div
                className="h-full w-full"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, #3b82f6, #a855f7, #f59e0b, #10b981)'
                    : 'linear-gradient(90deg, #3b82f6, #a855f7, #f59e0b, #10b981)',
                  opacity: isDark ? 0.3 : 0.25,
                }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              {/* Traveling pulse */}
              <motion.div
                className="absolute top-0 h-full w-24 blur-sm"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
                }}
                animate={{ x: ['-100px', 'calc(100% + 100px)'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              />
            </div>

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon container */}
                  <motion.div
                    className={`relative w-32 h-32 rounded-2xl mb-6 ${
                      isDark ? '' : step.lightBg
                    }`}
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={isDark ? {
                      background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))`,
                      border: '1px solid rgba(255,255,255,0.08)',
                    } : {
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div className="w-full h-full rounded-2xl flex items-center justify-center">
                      <step.icon className={`w-12 h-12 ${isDark ? 'text-white' : step.lightIcon}`} />
                    </div>
                    {/* Step number badge */}
                    <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isDark
                        ? 'bg-slate-900 border-2 border-slate-700 text-white'
                        : `bg-gradient-to-br ${step.color} text-white shadow-md`
                    }`}>
                      {index + 1}
                    </div>
                  </motion.div>

                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="md:hidden relative">
            {/* Vertical line */}
            <div className={`absolute left-8 top-0 bottom-0 w-[2px] ${
              isDark ? 'bg-white/10' : 'bg-slate-200'
            }`}>
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, #3b82f6, #a855f7, #f59e0b, #10b981)',
                  opacity: isDark ? 0.4 : 0.3,
                }}
                initial={{ scaleY: 0, transformOrigin: 'top' }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>

            <div className="space-y-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex items-start gap-6 pl-0"
                >
                  {/* Timeline node */}
                  <div className={`relative z-10 w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-slate-900 border border-white/10' : `${step.lightBg} border border-slate-100`
                  }`}>
                    <step.icon className={`w-7 h-7 ${isDark ? 'text-white' : step.lightIcon}`} />
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDark ? 'bg-slate-800 text-white border border-slate-600' : `bg-gradient-to-br ${step.color} text-white shadow-sm`
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
