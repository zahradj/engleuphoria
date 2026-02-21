import { UserPlus, ClipboardCheck, Calendar, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

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
  return (
    <section id="how-it-works" className="py-24 bg-slate-950 relative overflow-hidden scroll-mt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl" />
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Getting started is easy. Follow these simple steps to begin your English journey.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection line - desktop only */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 via-amber-500/30 to-green-500/30" />

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
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
