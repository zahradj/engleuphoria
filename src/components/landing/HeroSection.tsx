import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Rocket, Briefcase, Globe, Users } from 'lucide-react';

const portals = [
  {
    id: 'kids',
    title: 'The Playground',
    subtitle: 'Ages 4–10',
    description: 'Playful learning adventures with games, songs, and colorful activities.',
    cta: 'Start the Adventure',
    link: '/student-signup',
    icon: Sparkles,
    gradient: 'from-amber-400 via-lime-400 to-emerald-400',
    glowColor: 'shadow-emerald-500/40',
    bgAccent: 'bg-gradient-to-br from-amber-500/10 to-emerald-500/10',
    borderAccent: 'hover:border-emerald-400/50',
    ctaGradient: 'from-amber-500 to-emerald-500',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    rounded: 'rounded-3xl',
  },
  {
    id: 'teens',
    title: 'The Academy',
    subtitle: 'Ages 11–17',
    description: 'Level up your English with interactive challenges and real-world skills.',
    cta: 'Level Up Your English',
    link: '/student-signup',
    icon: Rocket,
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    glowColor: 'shadow-violet-500/40',
    bgAccent: 'bg-gradient-to-br from-violet-500/10 to-indigo-500/10',
    borderAccent: 'hover:border-violet-400/50',
    ctaGradient: 'from-violet-600 to-indigo-500',
    iconBg: 'bg-violet-500/20 text-violet-400',
    rounded: 'rounded-2xl',
  },
  {
    id: 'adults',
    title: 'The Professional',
    subtitle: 'Ages 18+',
    description: 'Master business English and advance your career with executive-level coaching.',
    cta: 'Executive Mastery',
    link: '/signup',
    icon: Briefcase,
    gradient: 'from-slate-400 via-slate-300 to-amber-300',
    glowColor: 'shadow-amber-400/30',
    bgAccent: 'bg-gradient-to-br from-slate-500/10 to-amber-500/5',
    borderAccent: 'hover:border-amber-400/40',
    ctaGradient: 'from-slate-700 to-slate-900',
    iconBg: 'bg-amber-500/20 text-amber-400',
    rounded: 'rounded-xl',
  },
];

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 bg-slate-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Headline */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6">
            Learn English.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Your Way.
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Three specialized schools under one roof — from playful kids' adventures to professional business mastery.
          </p>

          {/* Social Proof Ribbon */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs text-white font-bold border-2 border-slate-950">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-300">
                Trusted by students from <span className="text-white font-semibold">30+ countries</span>
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Three Portal Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                whileHover={{ scale: 1.04, y: -8 }}
                className={`group relative ${portal.rounded} p-8 backdrop-blur-xl bg-white/5 border border-white/10 ${portal.borderAccent} transition-all duration-500 cursor-pointer hover:shadow-2xl hover:${portal.glowColor}`}
              >
                {/* Accent glow behind card */}
                <div className={`absolute inset-0 ${portal.rounded} ${portal.bgAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-3 ${portal.rounded} ${portal.iconBg} mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1">
                    {portal.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium mb-4">{portal.subtitle}</p>

                  {/* Description */}
                  <p className="text-slate-300/80 text-sm leading-relaxed mb-8">
                    {portal.description}
                  </p>

                  {/* CTA */}
                  <Link
                    to={portal.link}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${portal.ctaGradient} text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 animate-[pulse_3s_ease-in-out_infinite]`}
                    style={{
                      animationName: 'none',
                      boxShadow: undefined,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.animationName = '';
                    }}
                  >
                    {portal.cta}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs font-medium mb-2">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-1 bg-white/60 rounded-full"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
