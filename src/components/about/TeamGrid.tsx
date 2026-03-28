import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Linkedin } from 'lucide-react';
import founderImage from '@/assets/founder-fatima.png';
import { useThemeMode } from '@/hooks/useThemeMode';

const TeamGrid = () => {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  return (
    <section className={`py-24 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-b from-slate-950 to-slate-900'
        : 'bg-gradient-to-b from-white to-slate-50'
    }`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-5xl font-display font-bold mb-6 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Meet the Founder
          </h2>
          
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
            isDark ? 'text-white/70' : 'text-slate-600'
          }`}>
            In 2020, amid a world searching for new ways to connect, <span className="text-violet-500 font-semibold">Fatima Zahra Djaanine</span> saw 
            an opportunity to reimagine English education. What started as a vision to make language learning 
            accessible, engaging, and personalized for every age has grown into Engleuphoria — three distinct 
            learning worlds united by one mission: to help every learner find their voice.
          </p>
        </motion.div>

        {/* Founder Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <GlassCard className={`p-8 sm:p-10 max-w-lg w-full border ${
            isDark
              ? 'bg-gradient-to-br from-violet-500/10 via-rose-500/10 to-amber-500/10 border-white/10'
              : 'bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50 border-slate-200 shadow-lg'
          }`}>
            <div className="flex flex-col items-center text-center">
              {/* Photo */}
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-violet-500/30 shadow-xl">
                  <img
                    src={founderImage}
                    alt="Fatima Zahra Djaanine"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-rose-500/20 blur-xl -z-10 scale-110" />
              </div>

              {/* Role Badge */}
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-violet-500 to-rose-500 text-white mb-4 shadow-lg">
                Founder & CEO
              </span>

              {/* Name */}
              <h3 className={`text-2xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Fatima Zahra Djaanine
              </h3>

              {/* Bio */}
              <p className={`leading-relaxed mb-6 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                An educator and innovator passionate about transforming how the world learns English. 
                With a background in language education and technology, Fatima built Engleuphoria to 
                bridge the gap between traditional teaching and modern learning experiences — creating 
                a platform where children play, teens thrive, and professionals succeed.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/in/fatima-zahra-djaanine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full transition-colors group ${
                    isDark ? 'bg-white/5 hover:bg-violet-500/20' : 'bg-slate-100 hover:bg-violet-100'
                  }`}
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className={`w-5 h-5 transition-colors group-hover:text-violet-500 ${
                    isDark ? 'text-white/60' : 'text-slate-400'
                  }`} />
                </a>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamGrid;
