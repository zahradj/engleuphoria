import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Award, ArrowRight, Users, Zap, Globe } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function BentoGridSection() {
  return (
    <section id="features" className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden scroll-mt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">EnglEuphoria</span>?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Three specialized schools under one roof, powered by cutting-edge technology
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Card 1 - Large: 3 Distinct Curriculums */}
          <motion.div
            className="md:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 to-purple-900/40 backdrop-blur-xl border border-white/10 p-8"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-violet-500/20 text-violet-300">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                  3 Distinct Curriculums
                </h3>
              </div>
              
              <p className="text-slate-300 mb-8 text-lg">
                Each age group has a specially designed learning path with age-appropriate content, activities, and assessments.
              </p>
              
              <div className="mt-auto grid grid-cols-3 gap-4">
                {[
                  { icon: '🎨', label: 'Kids', color: 'from-yellow-400 to-emerald-400' },
                  { icon: '🚀', label: 'Teens', color: 'from-violet-400 to-purple-500' },
                  { icon: '💼', label: 'Adults', color: 'from-slate-300 to-slate-500' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <span className="text-3xl mb-2">{item.icon}</span>
                    <span className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Medium: AI-Powered Progress */}
          <motion.div
            className="lg:col-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/20 to-teal-900/40 backdrop-blur-xl border border-white/10 p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  AI-Powered Progress
                </h3>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                {/* Animated Progress Chart */}
                <div className="flex items-end gap-2 h-24">
                  {[40, 55, 45, 70, 60, 85, 75, 95].map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-6 rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-slate-400 text-sm">
                Smart analytics track your learning journey
              </p>
            </div>
          </motion.div>

          {/* Card 3 - Medium: Certified Teachers */}
          <motion.div
            className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600/20 to-orange-900/40 backdrop-blur-xl border border-white/10 p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Certified Teachers
                </h3>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                  ].map((src, i) => (
                    <motion.img
                      key={i}
                      src={src}
                      alt="Teacher"
                      className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full bg-amber-500/30 border-2 border-slate-900 flex items-center justify-center text-amber-300 text-sm font-bold">
                    +50
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4 - Small: Live Classes */}
          <motion.div
            className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600/20 to-pink-900/40 backdrop-blur-xl border border-white/10 p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">
                Live Classes
              </h3>
              <p className="text-slate-400 text-sm">
                Real-time interaction
              </p>
            </div>
          </motion.div>

          {/* Card 5 - Small: Interactive Games */}
          <motion.div
            className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600/20 to-blue-900/40 backdrop-blur-xl border border-white/10 p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">
                Gamified Learning
              </h3>
              <p className="text-slate-400 text-sm">
                XP, badges & rewards
              </p>
            </div>
          </motion.div>

          {/* Card 6 - CTA: Start Free Trial */}
          <motion.div
            className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500 p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  Start Your Free Trial
                </h3>
                <p className="text-white/80">
                  No credit card required • 7 days free
                </p>
              </div>
              
              <Link
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 bg-white rounded-full text-slate-900 font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl group/btn"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
