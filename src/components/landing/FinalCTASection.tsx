import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useThemeMode } from '@/hooks/useThemeMode';

export function FinalCTASection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className={`py-24 md:py-32 relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'
      }`}
    >
      {/* Pulsing glow orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className={`w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full blur-3xl ${
            isDark
              ? 'bg-gradient-to-br from-indigo-600/30 to-violet-600/30'
              : 'bg-gradient-to-br from-indigo-200/40 to-violet-200/40'
          }`}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase mb-6 px-3 py-1.5 rounded-full ${
              isDark
                ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                : 'text-indigo-600 bg-indigo-50 border border-indigo-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ready to Begin?
          </motion.div>

          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Start Speaking{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              English Today
            </span>
          </h2>

          <p
            className={`text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Join thousands of learners building real confidence with our adaptive, gamified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 px-8 h-12 text-base font-medium rounded-xl"
            >
              <Link to="/student-signup">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToPricing}
              className={`px-8 h-12 text-base font-medium rounded-xl ${
                isDark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Explore Courses
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
