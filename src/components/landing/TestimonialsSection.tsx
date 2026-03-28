import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Parent of 2 kids',
    country: '🇬🇧 UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    rating: 5,
    text: "My daughter has improved so much in just 3 months! The teachers are patient and make learning genuinely fun. She actually looks forward to her lessons now — something I never thought possible.",
    highlight: '3 months to fluency improvement',
  },
  {
    name: 'Ahmed Khalil',
    role: 'Marketing Director',
    country: '🇦🇪 UAE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    rating: 5,
    text: "I needed to improve my English for international presentations. The business English course was exactly what I needed — practical, focused, and flexible around my schedule.",
    highlight: 'Promoted after 6 months',
  },
  {
    name: 'Maria Lombardi',
    role: 'University Student',
    country: '🇮🇹 Italy',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    rating: 5,
    text: "Preparing for my IELTS exam was so much easier with EnglEuphoria. My teacher helped me go from 6.0 to 7.5 in just two months! The structured approach made all the difference.",
    highlight: 'IELTS 6.0 → 7.5 in 2 months',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Software Engineer',
    country: '🇯🇵 Japan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    rating: 5,
    text: "The conversation club helped me overcome my fear of speaking English. Now I confidently participate in international meetings. The teachers create such a supportive environment.",
    highlight: 'From shy to confident speaker',
  },
];

export function TestimonialsSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const [current, setCurrent] = useState(0);

  const goNext = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section id="testimonials" className={`py-24 md:py-32 relative overflow-hidden scroll-mt-20 transition-colors duration-300 ${
      isDark ? 'bg-[#09090B]' : 'bg-gradient-to-b from-white to-slate-50'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className={`inline-block text-sm font-bold tracking-widest uppercase mb-4 ${
            isDark ? 'text-indigo-400' : 'text-indigo-600'
          }`}>
            Testimonials
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Real Stories,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
        </motion.div>

        {/* Featured testimonial - large card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className={`relative rounded-3xl overflow-hidden ${
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.08]'
                  : 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50'
              }`}
            >
              <div className="grid md:grid-cols-[240px_1fr]">
                {/* Left: Photo + info */}
                <div className={`p-8 flex flex-col items-center justify-center text-center ${
                  isDark
                    ? 'bg-gradient-to-b from-indigo-500/10 to-transparent'
                    : 'bg-gradient-to-b from-indigo-50 to-slate-50'
                }`}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-indigo-500/20"
                    loading="lazy"
                  />
                  <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.role}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.country}</p>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Right: Quote */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <Quote className={`w-8 h-8 mb-4 ${isDark ? 'text-indigo-500/40' : 'text-indigo-200'}`} />
                  <p className={`text-lg md:text-xl leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "{t.text}"
                  </p>
                  <div className={`inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-sm font-semibold ${
                    isDark
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    ✨ {t.highlight}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goPrev}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? `w-8 ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'}`
                      : `w-2 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
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
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mini testimonial cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { stat: '4.9/5', label: 'Average Rating', icon: '⭐' },
            { stat: '97%', label: 'Satisfaction', icon: '💚' },
            { stat: '85%', label: 'Complete the Course', icon: '🎯' },
            { stat: '92%', label: 'Recommend Us', icon: '🗣️' },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl p-5 text-center transition-colors ${
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.06]'
                  : 'bg-white border border-slate-100 shadow-sm'
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
