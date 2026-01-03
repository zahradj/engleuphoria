import { motion } from 'framer-motion';
import { Bird, Sparkles, Briefcase } from 'lucide-react';

const MissionHeader = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-950 via-slate-900 to-emerald-950 pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            Learning, Reimagined for Every Stage of Life.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 mb-16 max-w-2xl mx-auto"
          >
            Engleuphoria isn't just a school. It's three distinct worlds designed to meet you exactly where you are.
          </motion.p>

          {/* Floating Mascots */}
          <div className="flex justify-center items-center gap-8 md:gap-16 mt-12">
            {/* Kids - Pip the Bird */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-400 to-green-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30"
              >
                <Bird className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </motion.div>
              <span className="mt-4 text-yellow-400 font-semibold text-sm md:text-base">Playground</span>
            </motion.div>

            {/* Teens - Academy */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-violet-500/30"
              >
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </motion.div>
              <span className="mt-4 text-violet-400 font-semibold text-sm md:text-base">Academy</span>
            </motion.div>

            {/* Adults - Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-slate-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30"
              >
                <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </motion.div>
              <span className="mt-4 text-blue-400 font-semibold text-sm md:text-base">Hub</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MissionHeader;
