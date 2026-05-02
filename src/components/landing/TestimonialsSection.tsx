import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Real customer profiles — names/countries stay as-is; only role/text/highlight are translated.
const testimonialsBase = [
  {
    name: 'Sarah Mitchell',
    country: '🇬🇧 UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    rating: 5,
    roleKey: 'lp.testimonials.t1.role',
    textKey: 'lp.testimonials.t1.text',
    highlightKey: 'lp.testimonials.t1.highlight',
  },
  {
    name: 'Ahmed Khalil',
    country: '🇦🇪 UAE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    rating: 5,
    roleKey: 'lp.testimonials.t2.role',
    textKey: 'lp.testimonials.t2.text',
    highlightKey: 'lp.testimonials.t2.highlight',
  },
  {
    name: 'Maria Lombardi',
    country: '🇮🇹 Italy',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    rating: 5,
    roleKey: 'lp.testimonials.t3.role',
    textKey: 'lp.testimonials.t3.text',
    highlightKey: 'lp.testimonials.t3.highlight',
  },
  {
    name: 'Yuki Tanaka',
    country: '🇯🇵 Japan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    rating: 5,
    roleKey: 'lp.testimonials.t4.role',
    textKey: 'lp.testimonials.t4.text',
    highlightKey: 'lp.testimonials.t4.highlight',
  },
];

export function TestimonialsSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const [current, setCurrent] = useState(0);
  const { t } = useTranslation();

  const goNext = () => setCurrent((prev) => (prev + 1) % testimonialsBase.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + testimonialsBase.length) % testimonialsBase.length);

  const tBase = testimonialsBase[current];

  const stats = [
    { stat: '4.9/5', label: t('lp.testimonials.stat.rating'), icon: '⭐' },
    { stat: '97%', label: t('lp.testimonials.stat.satisfaction'), icon: '💚' },
    { stat: '85%', label: t('lp.testimonials.stat.complete'), icon: '🎯' },
    { stat: '92%', label: t('lp.testimonials.stat.recommend'), icon: '🗣️' },
  ];

  return (
    <section
      id="testimonials"
      className={`py-24 md:py-32 relative overflow-hidden scroll-mt-20 transition-colors duration-300 ${
        isDark ? 'bg-[#09090B]' : 'bg-gradient-to-b from-white to-slate-50'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className={`inline-block text-sm font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {t('lp.testimonials.eyebrow')}
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('lp.testimonials.heading')}{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t('lp.testimonials.headingAccent')}
            </span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className={`relative rounded-3xl overflow-hidden ${
                isDark ? 'bg-white/[0.03] border border-white/[0.08]' : 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50'
              }`}
            >
              <div className="grid md:grid-cols-[240px_1fr]">
                <div className={`p-8 flex flex-col items-center justify-center text-center ${
                  isDark ? 'bg-gradient-to-b from-indigo-500/10 to-transparent' : 'bg-gradient-to-b from-indigo-50 to-slate-50'
                }`}>
                  <img
                    src={tBase.avatar}
                    alt={tBase.name}
                    className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-indigo-500/20"
                    loading="lazy"
                  />
                  <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{tBase.name}</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t(tBase.roleKey)}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{tBase.country}</p>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(tBase.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <Quote className={`w-8 h-8 mb-4 ${isDark ? 'text-indigo-500/40' : 'text-indigo-200'}`} />
                  <p className={`text-lg md:text-xl leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    “{t(tBase.textKey)}”
                  </p>
                  <div className={`inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-sm font-semibold ${
                    isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    ✨ {t(tBase.highlightKey)}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goPrev}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
              aria-label={t('lp.testimonials.prev')}
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>

            <div className="flex gap-2">
              {testimonialsBase.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? `w-8 ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'}`
                      : `w-2 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`
                  }`}
                  aria-label={`${t('lp.testimonials.goTo')} ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
              aria-label={t('lp.testimonials.next')}
            >
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl p-5 text-center transition-colors ${
                isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-slate-100 shadow-sm'
              }`}
            >
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <p className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.stat}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
