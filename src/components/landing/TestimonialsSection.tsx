import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Parent',
    avatar: '👩',
    rating: 5,
    text: "My daughter has improved so much in just 3 months! The teachers are patient and make learning fun. She actually looks forward to her lessons now.",
  },
  {
    name: 'Ahmed K.',
    role: 'Business Professional',
    avatar: '👨‍💼',
    rating: 5,
    text: "I needed to improve my English for work presentations. The lessons are flexible and focused on exactly what I need. Highly recommend!",
  },
  {
    name: 'Maria L.',
    role: 'University Student',
    avatar: '👩‍🎓',
    rating: 5,
    text: "Preparing for my IELTS exam was so much easier with EnglEuphoria. My teacher helped me go from 6.0 to 7.5 in just two months!",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-900 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            What Our{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Students Say
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Join thousands of happy learners who have transformed their English skills with us.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl p-8 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)] transition-all duration-500"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-2xl border border-white/10">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
