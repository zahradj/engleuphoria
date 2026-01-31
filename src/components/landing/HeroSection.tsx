import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Rocket, Briefcase } from 'lucide-react';

const columns = [
  {
    id: 'kids',
    title: 'English for Kids',
    subtitle: '(Ages 4-10)',
    description: 'Playful learning adventures with games, songs, and colorful activities',
    gradient: 'from-yellow-300 via-lime-400 to-emerald-500',
    textColor: 'text-emerald-900',
    link: '/student-signup',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1200&fit=crop&q=80',
  },
  {
    id: 'teens',
    title: 'The Academy',
    subtitle: '(Ages 11-17)',
    description: 'Level up your English with interactive challenges and real-world skills',
    gradient: 'from-violet-600 via-purple-700 to-slate-900',
    textColor: 'text-white',
    link: '/student-signup',
    icon: Rocket,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop&q=80',
  },
  {
    id: 'adults',
    title: 'Professional Hub',
    subtitle: '(Ages 18+)',
    description: 'Master business English and advance your career with confidence',
    gradient: 'from-slate-100 via-gray-200 to-slate-300',
    textColor: 'text-slate-900',
    link: '/signup',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1200&fit=crop&q=80',
  },
];

export function HeroSection() {
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  return (
    <section className="relative h-screen w-full flex overflow-hidden">
      {columns.map((column, index) => {
        const isActive = activeColumn === column.id;
        const isOtherActive = activeColumn !== null && activeColumn !== column.id;
        const Icon = column.icon;

        return (
          <motion.div
            key={column.id}
            className={`relative h-full cursor-pointer overflow-hidden bg-gradient-to-br ${column.gradient}`}
            initial={{ flex: 1 }}
            animate={{
              flex: isActive ? 2 : isOtherActive ? 0.5 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={() => setActiveColumn(column.id)}
            onMouseLeave={() => setActiveColumn(null)}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={column.image}
                alt={column.title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${column.gradient} opacity-80`} />
            </div>

            {/* Glass Panel */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              {/* Icon */}
              <motion.div
                className={`mb-6 p-4 rounded-2xl backdrop-blur-md bg-white/20 ${column.textColor}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className="w-12 h-12" />
              </motion.div>

              {/* Title */}
              <motion.h2
                className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-2 ${column.textColor}`}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {column.title}
              </motion.h2>

              {/* Subtitle */}
              <p className={`text-xl md:text-2xl font-medium mb-4 ${column.textColor} opacity-80`}>
                {column.subtitle}
              </p>

              {/* Description - Only visible when active */}
              <motion.p
                className={`text-center max-w-xs mb-8 ${column.textColor} opacity-70`}
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  height: isActive ? 'auto' : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {column.description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 20,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link
                  to={column.link}
                  className={`
                    inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg
                    backdrop-blur-md transition-all duration-300
                    ${column.id === 'adults'
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-white/90 text-slate-900 hover:bg-white'
                    }
                    shadow-xl hover:shadow-2xl hover:scale-105
                  `}
                >
                  Start
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Column Number */}
            <div className={`absolute bottom-8 left-8 font-display text-8xl font-bold ${column.textColor} opacity-10`}>
              0{index + 1}
            </div>
          </motion.div>
        );
      })}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-sm font-medium mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
